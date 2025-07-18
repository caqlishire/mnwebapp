import React from 'react';

const SpatialHolographicInterface: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-healthcare-blue to-healthcare-lavender p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Spatial Holographic Interface</h2>
      <p className="mb-4">Interact with a 3D holographic card in space.</p>
      <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl shadow-2xl border-2 border-white transform rotate-12 hover:rotate-0 transition-transform duration-500" />
    </div>
  );
};

export default SpatialHolographicInterface; 