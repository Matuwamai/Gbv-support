import React from "react";

const LogoComponent = () => {
  return (
    <div className='flex flex-col items-start space-y-1'>
      <h1 className='text-2xl font-extrabold text-purple-800'>GBV</h1>
      <p className='text-sm font-semibold text-gray-700'>
        GENDER-BASED VIOLENCE AWARENESS PLATFORM
      </p>
      <p className='text-xs text-gray-600 italic'>
        Join us in the fight against GBV.
      </p>
    </div>
  );
};

export default LogoComponent;
