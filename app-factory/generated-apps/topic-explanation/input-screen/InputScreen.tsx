import React, { useEffect, useState } from 'react';
import { callCapability } from '../services/capabilityClient';

export interface InputScreenProps {
  onResult: (data: any) => void;
  initialQuery?: string | undefined;
}

export function InputScreen({ onResult, initialQuery }: InputScreenProps) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [language, setLanguage] = useState<string>('English');
  const [loading, setLoading] = useState(false);

  async function explain() {
    setLoading(true);
    try {
      const payload = {
        query,
        language,
      };
      const res = await callCapability('topic_explanation', payload);
      onResult(res);
    } catch (_err) {
      onResult({ success: false, error: 'invoke-failed' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // auto-submit when initialQuery is provided
    if (initialQuery && initialQuery.trim().length > 0) {
      explain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Explain a topic</h4>
      <div>
        <label>Topic query:</label>
        <div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter topic or question" style={{ width: '60%' }} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={explain} disabled={loading}>{loading ? 'Explaining...' : 'Get Explanation'}</button>
      </div>
    </div>
  );
}
