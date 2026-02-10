import React from "react";

export default function SettingsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Inställningar</h2>
          <button onClick={onClose}>Stäng</button>
        </header>
        <section className="modal-body">
          {/* Lägg in inställningsformulär här (tema, deepWork, timer-inställningar) */}
        </section>
      </div>
    </div>
  );
}