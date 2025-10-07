// src/App.jsx
import { useState, useRef, useEffect } from "react";
import { askGemini } from "./services/gemini";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await askGemini(`Você é um assistente sobre hábitos saudáveis. Responda de forma simples e prática. Pergunta: ${input}`);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-green-700 text-center">🌿 GreenMind</h1>
      </header>

      {/* Mensagens */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-lg p-3 rounded-lg shadow ${
                msg.role === "user"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {/* A MÁGICA ESTÁ AQUI 👇 */}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && <p className="text-center text-gray-500">GreenMind está pensando...</p>}
        <div ref={chatEndRef} />
      </main>

      {/* Input */}
      <footer className="bg-white p-4">
        <div className="flex w-full max-w-lg mx-auto">
          <input
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte sobre alimentação ou cultivo..."
            disabled={isLoading}
          />
          <button
            className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 disabled:bg-green-400"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  );
}