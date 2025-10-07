import { useState } from "react";
import { askGemini } from "./services/gemini";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages([...messages, newMessage]);

    const reply = await askGemini(`
      Você é um assistente sobre hábitos saudáveis e hortas.
      Responda de forma simpática, educativa e prática.
      Pergunta do usuário: ${input}
    `);

    setMessages((msgs) => [...msgs, newMessage, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-800">🌿 GreenMind - Seu guia saudável</h1>

      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-4 overflow-y-auto flex-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-green-100 text-right"
                : "bg-green-200 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-lg mt-4">
        <input
          className="flex-1 border border-green-300 rounded-l-lg p-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre alimentação ou cultivo..."
        />
        <button
          className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
