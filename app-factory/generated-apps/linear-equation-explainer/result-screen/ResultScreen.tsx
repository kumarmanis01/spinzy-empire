import React from 'react';

export interface ResultScreenProps {
  result: any;
}

export function ResultScreen({ result }: ResultScreenProps) {
  return (
    <div>
      <h3>Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
