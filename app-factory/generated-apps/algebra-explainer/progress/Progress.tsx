import React from 'react';

export function Progress({ step = 0 }: { step?: number }) {
  return (
    <div>
      <small>Progress: Step {step}</small>
    </div>
  );
}
