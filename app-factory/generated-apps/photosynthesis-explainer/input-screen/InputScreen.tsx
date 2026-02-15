import React, { useState } from 'react';
import { callCapability } from '../services/capabilityClient';
import config from '@/app-factory/app-config/photosynthesis-explainer.json';

export interface InputScreenProps {
  onResult: (data: any) => void;
}

export function InputScreen({ onResult }: InputScreenProps) {
  const [language, setLanguage] = useState<string>(config.languageOptions[0]);
  const [loading, setLoading] = useState(false);

  async function explain() {
    setLoading(true);
    try {
      // Use the standardized capability contract: { question, context }
      const payload = {
        question: config.defaultTopic,
        context: {
          language,
        },
      };
      const res = await callCapability(config.capability, payload);
      onResult(res);
    } catch (_err) {
      onResult({ success: false, error: 'invoke-failed' })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Explain: {config.defaultTopic}</h4>
      <div>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {config.languageOptions.map((l: string) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={explain} disabled={loading}>{loading ? 'Explaining...' : 'Get Explanation'}</button>
      </div>
    </div>
  );
}
