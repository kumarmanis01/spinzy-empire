"use client";

import { useState, useEffect } from "react";

export default function GenerateAppPage() {
  const [topic, setTopic] = useState("");
  const [capability, setCapability] = useState("topic_explanation");
  const [status, setStatus] = useState("");
  const [suggested, setSuggested] = useState<any[]>([]);

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

  async function handleGenerateFromIdea(idea: any) {
    const topic = idea.name.replace(" Explainer", "");
    await fetch("/api/admin/generate-app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        capability: idea.requiredCapability,
      }),
    });
  }

  useEffect(() => {
    fetch("/api/admin/suggested-apps")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuggested(data.ideas);
        }
      })
      .catch(() => {});
  }, []);

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

      <h2 className="mt-8 text-lg font-semibold">
        Suggested Apps To Generate
      </h2>

      <div className="mt-4 space-y-4">
        {suggested.map((idea, idx) => (
          <div key={idx} className="border p-4">
            <div className="font-medium">{idea.name}</div>
            <div className="text-sm text-gray-600">
              Capability: {idea.requiredCapability}
            </div>
            <div className="text-sm">Impact Score: {idea.impactScore}</div>

            <button
              onClick={() => handleGenerateFromIdea(idea)}
              className="mt-2 bg-black text-white px-3 py-1"
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
