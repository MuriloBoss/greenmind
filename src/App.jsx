import { useState } from "react";
import { askGemini } from "./services/gemini";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Quais plantas são fáceis de cuidar?",
    "Como regar corretamente minhas plantas?",
    "Qual é a melhor iluminação para plantas de interior?",
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askGemini(text);
      const botMessage = { sender: "bot", text: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ops! Algo deu errado. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">🌱 GreenMind</h1>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="loading">🤖 A IA está pensando...</div>}
      </div>

      <div className="suggestions">
        {suggestions.map((s, idx) => (
          <button key={idx} onClick={() => sendMessage(s)}>
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="send-button">
          ➤
        </button>
      </form>
    </div>
  );
}

export default App;
