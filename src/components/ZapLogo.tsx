
import React from 'react';

const ZapLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/lovable-uploads/50ec2a1c-db90-4100-bc0f-c8f71549a8e2.png"
      alt="TheZapCoin Logo"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      style={{ filter: 'drop-shadow(0 0 10px rgba(153,69,255,0.3))' }}
    />
  );
};

export default ZapLogo;

