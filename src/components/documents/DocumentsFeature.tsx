
import React, { useState } from "react";
import DocumentsFilterMenu, { DocumentTypeFilter } from "./DocumentsFilterMenu";

// Placeholder data for demonstration purposes
const allDocuments = [
  { id: 1, title: "Data Protection Policy", type: "Policies" },
  { id: 2, title: "2023 Finance Statement", type: "Finance" },
  { id: 3, title: "Employee Contract Template", type: "Contracts" },
  { id: 4, title: "Monitoring Checklist", type: "M & E" },
  { id: 5, title: "Miscellaneous Document", type: "Uncategorized" },
  { id: 6, title: "Procurement Policy", type: "Policies" },
  { id: 7, title: "Quarterly Report", type: "M & E" },
];

export const DOCUMENT_FILTERS: DocumentTypeFilter[] = [
  { label: "All Documents", value: "all" },
  { label: "Policies", value: "Policies" },
  { label: "Finance", value: "Finance" },
  { label: "Contracts", value: "Contracts" },
  { label: "M & E", value: "M & E" },
  { label: "Uncategorized", value: "Uncategorized" }
];

const DocumentsFeature = () => {
  const [filter, setFilter] = useState<DocumentTypeFilter>(DOCUMENT_FILTERS[0]);

  // Filter logic
  const filteredDocuments =
    filter.value === "all"
      ? allDocuments
      : allDocuments.filter((doc) => doc.type === filter.value);

  return (
    <div className="bg-white border rounded-sm shadow-sm p-6 min-h-[400px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Documents
        </h2>

        {/* Dropdown for filter */}
        <DocumentsFilterMenu
          filters={DOCUMENT_FILTERS}
          selected={filter}
          onSelect={setFilter}
        />
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-auto">
        {filteredDocuments.length === 0 && (
          <div className="text-gray-400 text-center py-16">
            No documents found for this category.
          </div>
        )}
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((doc) => (
            <li key={doc.id} className="py-4 flex items-center justify-between">
              <span className="font-medium text-gray-800">{doc.title}</span>
              <span className="inline-block text-xs rounded-full px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600">
                {doc.type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsFeature;
