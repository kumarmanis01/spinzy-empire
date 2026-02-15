"use client";

import { useState } from "react";

export default function GenerateAppPage() {
  const [topic, setTopic] = useState("");
  const [capability, setCapability] = useState("topic_explanation");
  const [status, setStatus] = useState("");

  async function handleGenerate() {
    setStatus("Generating...");

    try {
      const res = await fetch("/api/admin/generate-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, capability }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus(`App created: ${data.slug}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err?.message ?? 'network error'}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Generate Micro App</h1>

      <select
        value={capability}
        onChange={(e) => setCapability(e.target.value)}
        className="border p-2 mb-3 w-full"
      >
        <option value="topic_explanation">Topic Explanation</option>
        <option value="doubt_solving">Doubt Solving</option>
        <option value="study_planning">Study Planning</option>
        <option value="revision_strategy">Revision Strategy</option>
      </select>

      <input
        type="text"
        placeholder="Enter topic (e.g., Linear Equations)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 mb-3 w-full"
      />

      <button onClick={handleGenerate} className="bg-black text-white px-4 py-2">
        Generate
      </button>

      <div className="mt-4">{status}</div>
    </div>
  );
}
