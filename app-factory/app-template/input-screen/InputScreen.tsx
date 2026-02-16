import React, { useState } from 'react';
import { callCapability } from '../services/capabilityClient';

/* TEMPLATE PLACEHOLDER: The generator will replace this commented block with a concrete
   relative import pointing to the app's config in the central app-config folder.

   Example replacement for a generated app located at
   app-factory/generated-apps/<slug>/input-screen/InputScreen.tsx would be:

   import config from '../../../app-config/${APP_NAME}.json';

   Keep this block present so the generator can reliably patch it.
*/

export interface InputScreenProps {
  onResult: (data: any) => void;
}

export function InputScreen({ onResult }: InputScreenProps) {
  const [capability, setCapability] = useState('study_planning');
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const parsed = payload ? JSON.parse(payload) : {};
      const res = await callCapability(capability, parsed);
      onResult(res);
    } catch (err) {
      onResult({ success: false, error: 'invalid payload' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Micro-app Input</h3>
      <div>
        <label>Capability: </label>
        <select value={capability} onChange={(e) => setCapability(e.target.value)}>
          <option value="study_planning">study_planning</option>
          <option value="doubt_solving">doubt_solving</option>
          <option value="revision_strategy">revision_strategy</option>
          <option value="topic_explanation">topic_explanation</option>
        </select>
      </div>
      <div>
        <label>Payload (JSON):</label>
        <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={6} cols={60} />
      </div>
      <div>
        <button onClick={submit} disabled={loading}>{loading ? 'Calling...' : 'Call Capability'}</button>
      </div>
    </div>
  );
}

export default InputScreen;
