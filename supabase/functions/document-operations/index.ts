import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UploadRequest {
  fileName: string
  fileContent: string // base64 encoded
  title: string
  description?: string
  category: string
  tags?: string[]
}

interface DocumentOperation {
  operation: 'upload' | 'download' | 'delete' | 'update'
  documentId?: string
  data?: UploadRequest
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Set the auth context
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's profile and org
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { operation, documentId, data } = await req.json() as DocumentOperation

    switch (operation) {
      case 'upload':
        if (!data) {
          return new Response(
            JSON.stringify({ error: 'Upload data required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Decode base64 file content
        const fileBuffer = Uint8Array.from(atob(data.fileContent), c => c.charCodeAt(0))
        
        // Create file path: userId/orgId/filename
        const filePath = `${user.id}/${profile.org_id}/${data.fileName}`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, fileBuffer, {
            contentType: getMimeType(data.fileName),
            upsert: true
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          return new Response(
            JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create document record in database
        const { data: document, error: dbError } = await supabase
          .from('documents')
          .insert({
            title: data.title,
            file_name: data.fileName,
            file_path: uploadData.path,
            file_size: fileBuffer.length,
            mime_type: getMimeType(data.fileName),
            category: data.category as any,
            description: data.description,
            status: 'active',
            version: '1.0',
            is_template: false,
            org_id: profile.org_id,
            created_by: user.id
          })
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
          // Clean up uploaded file
          await supabase.storage.from('documents').remove([uploadData.path])
          return new Response(
            JSON.stringify({ error: 'Failed to create document record', details: dbError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Add tags if provided
        if (data.tags && data.tags.length > 0) {
          const tagAssociations = data.tags.map(tagId => ({
            document_id: document.id,
            tag_id: tagId
          }))
          
          await supabase
            .from('document_tag_associations')
            .insert(tagAssociations)
        }

        return new Response(
          JSON.stringify({ success: true, document }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'download':
        if (!documentId) {
          return new Response(
            JSON.stringify({ error: 'Document ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get document info
        const { data: doc, error: docError } = await supabase
          .from('documents')
          .select('file_path, file_name, mime_type')
          .eq('id', documentId)
          .single()

        if (docError || !doc) {
          return new Response(
            JSON.stringify({ error: 'Document not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get file from storage
        const { data: fileData, error: fileError } = await supabase.storage
          .from('documents')
          .download(doc.file_path)

        if (fileError) {
          return new Response(
            JSON.stringify({ error: 'Failed to download file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Convert to base64 for transport
        const arrayBuffer = await fileData.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

        return new Response(
          JSON.stringify({
            success: true,
            fileName: doc.file_name,
            mimeType: doc.mime_type,
            content: base64
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'delete':
        if (!documentId) {
          return new Response(
            JSON.stringify({ error: 'Document ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get document info first
        const { data: docToDelete, error: getDocError } = await supabase
          .from('documents')
          .select('file_path')
          .eq('id', documentId)
          .single()

        if (getDocError || !docToDelete) {
          return new Response(
            JSON.stringify({ error: 'Document not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Delete from storage
        const { error: storageDeleteError } = await supabase.storage
          .from('documents')
          .remove([docToDelete.file_path])

        if (storageDeleteError) {
          console.error('Storage delete error:', storageDeleteError)
        }

        // Delete from database
        const { error: dbDeleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', documentId)

        if (dbDeleteError) {
          return new Response(
            JSON.stringify({ error: 'Failed to delete document' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed'
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}