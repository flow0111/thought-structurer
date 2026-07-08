"use client";

import { useState } from "react";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  function startListening() {
    setIsListening(true);
    setTranscript("Listening started. Speech recognition will be added next.");
  }

  function stopListening() {
    setIsListening(false);
    setTranscript((current) => current + "\nListening stopped.");
  }

  function clearAll() {
    setIsListening(false);
    setTranscript("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Thought Structurer
        </h1>

        <p className="mb-6 text-gray-600">
          Status: {isListening ? "Listening" : "Not listening"}
        </p>

        <div className="mb-4 flex gap-3">
          <button
            onClick={startListening}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Start Listening
          </button>

          <button
            onClick={stopListening}
            className="rounded bg-gray-600 px-4 py-2 text-white"
          >
            Stop Listening
          </button>

          <button
            onClick={clearAll}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <section className="min-h-[500px] rounded bg-white p-4 shadow">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Transcript
            </h2>
            <pre className="whitespace-pre-wrap text-gray-700">
              {transcript || "Your spoken text will appear here."}
            </pre>
          </section>

          <section className="min-h-[500px] rounded bg-white p-4 shadow">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Outline
            </h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Ideas will be organized here.</li>
              <li>Questions will be separated later.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}