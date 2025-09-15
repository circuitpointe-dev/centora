-- First, let's check if the foreign key relationships exist and fix them
-- Add missing foreign key constraints for document relationships

-- Fix the relationship between document_signatures and documents
DO $$ 
BEGIN
    -- Check if the foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_signatures' 
        AND constraint_name = 'document_signatures_document_id_fkey'
    ) THEN
        ALTER TABLE document_signatures 
        ADD CONSTRAINT document_signatures_document_id_fkey 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
    END IF;
    
    -- Check if the created_by foreign key exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_signatures' 
        AND constraint_name = 'document_signatures_created_by_fkey'
    ) THEN
        ALTER TABLE document_signatures 
        ADD CONSTRAINT document_signatures_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Fix the relationship between documents and profiles (created_by, updated_by)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'documents' 
        AND constraint_name = 'documents_created_by_fkey'
    ) THEN
        ALTER TABLE documents 
        ADD CONSTRAINT documents_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'documents' 
        AND constraint_name = 'documents_updated_by_fkey'
    ) THEN
        ALTER TABLE documents 
        ADD CONSTRAINT documents_updated_by_fkey 
        FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    -- Fix document_shares relationships
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_shares' 
        AND constraint_name = 'document_shares_document_id_fkey'
    ) THEN
        ALTER TABLE document_shares 
        ADD CONSTRAINT document_shares_document_id_fkey 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_shares' 
        AND constraint_name = 'document_shares_created_by_fkey'
    ) THEN
        ALTER TABLE document_shares 
        ADD CONSTRAINT document_shares_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Fix document versions relationships
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_versions' 
        AND constraint_name = 'document_versions_document_id_fkey'
    ) THEN
        ALTER TABLE document_versions 
        ADD CONSTRAINT document_versions_document_id_fkey 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_versions' 
        AND constraint_name = 'document_versions_created_by_fkey'
    ) THEN
        ALTER TABLE document_versions 
        ADD CONSTRAINT document_versions_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    -- Fix document tag associations relationships
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_tag_associations' 
        AND constraint_name = 'document_tag_associations_document_id_fkey'
    ) THEN
        ALTER TABLE document_tag_associations 
        ADD CONSTRAINT document_tag_associations_document_id_fkey 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'document_tag_associations' 
        AND constraint_name = 'document_tag_associations_tag_id_fkey'
    ) THEN
        ALTER TABLE document_tag_associations 
        ADD CONSTRAINT document_tag_associations_tag_id_fkey 
        FOREIGN KEY (tag_id) REFERENCES document_tags(id) ON DELETE CASCADE;
    END IF;
END $$;