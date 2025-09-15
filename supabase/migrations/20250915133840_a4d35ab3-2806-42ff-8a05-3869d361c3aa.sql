-- Clean up invalid foreign key data and then add constraints
DO $$ 
BEGIN
    -- First, clean up any invalid data in document_signatures that references non-existent users
    DELETE FROM document_signatures 
    WHERE created_by NOT IN (SELECT id FROM auth.users);
    
    -- Clean up invalid data in documents
    UPDATE documents 
    SET created_by = NULL 
    WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM auth.users);
    
    UPDATE documents 
    SET updated_by = NULL 
    WHERE updated_by IS NOT NULL AND updated_by NOT IN (SELECT id FROM auth.users);

    -- Clean up invalid data in document_shares
    DELETE FROM document_shares 
    WHERE created_by NOT IN (SELECT id FROM auth.users);

    -- Clean up invalid data in document_versions
    DELETE FROM document_versions 
    WHERE created_by NOT IN (SELECT id FROM auth.users);

    -- Now add the foreign key constraints safely
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
    
    -- Documents to auth.users (created_by)
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
    
    -- Documents to auth.users (updated_by)
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

    -- Document shares to documents and auth.users
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
    
    -- Document versions relationships
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

    -- Document tag associations relationships
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