import React from 'react';

const Heading = ({ children, className = '', style = {}, weight = 590 }) => {
  return (
    <h2
      className={`font-sans text-[30px] sm:text-[34px] md:text-[44px] leading-[1.1] tracking-[-0.03em] ${className}`}
      style={{
        fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: weight,
        ...style,
      }}
    >
      {children}
    </h2>
  );
};

export default Heading;
