import React from "react";
import CreateLeadForm from "../leads/CreateLeadForm";
function EditLead({ onClose, leadId }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-5xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CreateLeadForm leadId={leadId} onClose={onClose} />
      </div>
    </div>
  );
}

export default EditLead;
