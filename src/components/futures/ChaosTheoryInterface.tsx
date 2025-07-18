import React from 'react';

const ChaosTheoryInterface: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-healthcare-blue to-healthcare-lavender p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Chaos Theory Interface</h2>
      <p className="mb-4">Unpredictable, playful UI elements inspired by chaos theory.</p>
      <div className="flex gap-2 animate-bounce">
        <div className="w-8 h-8 bg-healthcare-blue rounded animate-spin" />
        <div className="w-8 h-8 bg-healthcare-mint rounded animate-pulse" />
        <div className="w-8 h-8 bg-healthcare-lavender rounded animate-bounce" />
      </div>
    </div>
  );
};

export default ChaosTheoryInterface; 