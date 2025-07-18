import React from 'react';

const QuantumSuperpositionUI: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-healthcare-mint to-healthcare-blue p-6 rounded-xl shadow-lg text-white flex flex-col items-center animate-pulse">
      <h2 className="text-2xl font-bold mb-2">Quantum Superposition UI</h2>
      <p className="mb-4">Visualize quantum states in superposition. Toggle between |0⟩ and |1⟩, or both!</p>
      <div className="flex gap-4">
        <span className="bg-white text-healthcare-mint px-4 py-2 rounded-full font-mono shadow">|0⟩</span>
        <span className="bg-white text-healthcare-blue px-4 py-2 rounded-full font-mono shadow">|1⟩</span>
        <span className="bg-gradient-to-r from-healthcare-mint to-healthcare-blue px-4 py-2 rounded-full font-mono shadow">|ψ⟩</span>
      </div>
    </div>
  );
};

export default QuantumSuperpositionUI; 