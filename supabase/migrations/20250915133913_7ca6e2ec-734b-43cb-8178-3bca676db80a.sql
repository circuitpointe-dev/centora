-- Fix the foreign key constraints by making created_by nullable first
DO $$ 
BEGIN
    -- First, make created_by and updated_by columns nullable in documents table
    ALTER TABLE documents ALTER COLUMN created_by DROP NOT NULL;
    ALTER TABLE documents ALTER COLUMN updated_by DROP NOT NULL;
    
    -- Clean up invalid foreign key data
    DELETE FROM document_signatures 
    WHERE created_by NOT IN (SELECT id FROM auth.users);
    
    -- Update invalid user references in documents to NULL (now that it's nullable)
    UPDATE documents 
    SET created_by = NULL 
    WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM auth.users);
    
    UPDATE documents 
    SET updated_by = NULL 
    WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM auth.users);

    -- Clean up other tables
    DELETE FROM document_shares 
    WHERE created_by NOT IN (SELECT id FROM auth.users);

    DELETE FROM document_versions 
    WHERE created_by NOT IN (SELECT id FROM auth.users);

    -- Now add foreign key constraints
    -- Document signatures to documents
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
    
    -- Document signatures to auth.users
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
    
    -- Documents to auth.users
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

    -- Document shares
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
    
    -- Document versions
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

    -- Document tag associations
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