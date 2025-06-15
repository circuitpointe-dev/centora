
import React, { useState } from "react";
import DocumentsSubMenu from "./DocumentsSubMenu";

// Stub for later: This can be replaced by document data.
const mockDocuments = [
  { id: 1, name: "Finance Report Q1", type: "finance" },
  { id: 2, name: "Procurement Policy", type: "policies" },
  { id: 3, name: "Grant Contract 2023", type: "contracts" },
  { id: 4, name: "KPI Metrics", type: "me" },
  { id: 5, name: "HR Policy", type: "policies" },
  { id: 6, name: "Uncategorized Memo", type: "uncategorized" },
];

export default function DocumentsFeaturePage() {
  const [selectedMenu, setSelectedMenu] = useState("all");

  const filteredDocuments =
    selectedMenu === "all"
      ? mockDocuments
      : mockDocuments.filter((doc) => doc.type === selectedMenu);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Documents
      </h1>
      <DocumentsSubMenu
        selected={selectedMenu}
        onSelect={setSelectedMenu}
      />
      <div className="bg-white rounded-md border border-gray-200 mt-2 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                Document Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-400">
                  No documents found for this category.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-100"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {doc.type === "me" ? "M & E" : doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
