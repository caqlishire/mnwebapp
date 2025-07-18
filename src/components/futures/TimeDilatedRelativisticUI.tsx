import React from 'react';

const TimeDilatedRelativisticUI: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-healthcare-blue to-healthcare-mint p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Time-Dilated Relativistic UI</h2>
      <p className="mb-4">UI elements that slow down or speed up based on interaction.</p>
      <div className="flex gap-2 animate-pulse">
        <div className="w-8 h-8 bg-healthcare-blue rounded-full animate-spin" />
        <div className="w-8 h-8 bg-healthcare-mint rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-healthcare-lavender rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default TimeDilatedRelativisticUI; 