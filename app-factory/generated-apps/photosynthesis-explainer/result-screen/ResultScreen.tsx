import React from 'react';

export interface ResultScreenProps {
  data: any;
  onBack?: () => void;
}

export function ResultScreen({ data, onBack }: ResultScreenProps) {
  if (!data) return null;

  if (!data.success) {
    return (
      <div>
        <h4>Failed</h4>
        <p>{data.error || 'Unknown error'}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  const payload = data.payload || data;

  return (
    <div>
      <h4>Explanation</h4>
      <div>
        <strong>Summary:</strong>
        <p>{payload.summary || payload.explanation || 'No summary available'}</p>
      </div>
      {payload.examples && (
        <div>
          <strong>Examples:</strong>
          <ul>
            {payload.examples.map((ex: any, idx: number) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
