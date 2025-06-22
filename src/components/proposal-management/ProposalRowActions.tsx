import React from "react";
import { Edit, Delete } from "lucide-react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

const ProposalRowActions: React.FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Edit button */}
      <button
        onClick={onEdit}
        aria-label="Edit"
        className="p-2 rounded hover:bg-gray-100 transition"
        type="button"
      >
        <Edit className="w-5 h-5 text-gray-600 hover:text-gray-900" />
      </button>

      {/* Delete button */}
      <button
        onClick={onDelete}
        aria-label="Delete"
        className="p-2 rounded hover:bg-gray-100 transition"
        type="button"
      >
        <Delete className="w-5 h-5 text-rose-600 hover:text-rose-800" />
      </button>
    </div>
  );
};

export default ProposalRowActions;
