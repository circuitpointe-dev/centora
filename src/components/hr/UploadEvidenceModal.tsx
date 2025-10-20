import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: { type: string; description: string; file: File | null }) => void
}

const UploadEvidenceModal: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
  const [evidenceType, setEvidenceType] = useState('Document')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    onUpload({
      type: evidenceType,
      description: description,
      file: selectedFile
    })
    // Reset form
    setEvidenceType('Document')
    setDescription('')
    setSelectedFile(null)
    onClose()
  }

  const handleCancel = () => {
    // Reset form
    setEvidenceType('Document')
    setDescription('')
    setSelectedFile(null)
    onClose()
  }

  return (
    <>
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Blurred Background Overlay */}
          <div 
            className="absolute inset-0 bg-white/30 backdrop-blur-md"
            onClick={onClose}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">Upload evidence</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Attach documents, certificates, or other evidence of completion.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Evidence Type */}
              <div className="space-y-2">
                <Label htmlFor="evidence-type">Evidence type</Label>
                <Select value={evidenceType} onValueChange={setEvidenceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select evidence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Screenshot">Screenshot</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description of the evidence..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload file</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Choose a file or drag & drop it here
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse file
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
                      />
                    </label>
                  </Button>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-700">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 border-t flex-shrink-0">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Upload evidence
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default UploadEvidenceModal
