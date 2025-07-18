import React from 'react';

const BiotechOrganicComputing: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-healthcare-mint to-healthcare-teal p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Biotech Organic Computing</h2>
      <p className="mb-4">Organic, cell-like UI with animated growth visuals.</p>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-healthcare-mint rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-healthcare-teal rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-healthcare-blue rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default BiotechOrganicComputing; 