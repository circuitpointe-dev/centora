
import React, { useRef } from "react";
import { Edit, Delete } from "lucide-react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

const ProposalRowActions: React.FC<Props> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = React.useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  // Close the menu if clicked outside
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={actionRef}>
      <button
        className="hover:bg-gray-100 rounded-full p-2"
        onClick={() => setOpen((o) => !o)}
        aria-label="Actions"
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="#8a8a91" strokeWidth={2} viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
      </button>
      {open && (
        <div className="absolute z-20 right-0 mt-2 w-32 bg-white border border-gray-100 rounded shadow-md py-1 animate-fade-in">
          <button
            className="flex items-center px-4 py-2 w-full text-sm text-violet-700 hover:bg-violet-50"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            <Edit className="mr-2 w-4 h-4" /> Edit
          </button>
          <button
            className="flex items-center px-4 py-2 w-full text-sm text-rose-700 hover:bg-rose-50"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <Delete className="mr-2 w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalRowActions;
