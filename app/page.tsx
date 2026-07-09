"use client";

import { useRef, useState } from "react";

type BrowserSpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: {
    transcript: string;
  };
};

type BrowserSpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
};

type BrowserSpeechRecognitionErrorEvent = {
  error: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const finalTranscriptRef = useRef("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  function startListening() {
    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(false);
      setTranscript(
        "Speech recognition is not supported in this browser. Try Chrome or Edge.",
      );
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        finalTranscriptRef.current += finalText;
      }

      setTranscript(`${finalTranscriptRef.current}${interimText}`);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setTranscript((current) =>
        current
          ? `${current}\nSpeech recognition error: ${event.error}.`
          : `Speech recognition error: ${event.error}.`,
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setTranscript("Speech recognition could not be started.");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function clearAll() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    finalTranscriptRef.current = "";
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
