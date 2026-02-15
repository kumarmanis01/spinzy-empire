import React from 'react';

export function Progress({ step, total }: { step: number; total?: number }) {
  return (
    <div style={{ marginTop: 8 }}>
      Step {step}{total ? ` / ${total}` : ''}
    </div>
  );
}

export default Progress;
