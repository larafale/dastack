import React from 'react';

type DebugProps = {
  children?: React.ReactNode;
  className?: string;
};

export const DebugBox: React.FC<DebugProps> = (props) => {
  const { children } = props;

  return (
    <div className="absolute bottom-10 right-10 m-2 grid gap-2 rounded border p-5 text-sm shadow">
      {children && children}
    </div>
  );
};
