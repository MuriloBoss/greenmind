import { useState, useRef, useEffect } from "react";
import { askGemini } from "./services/gemini";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    return () => {
      messages.forEach(msg => {
        if (msg.image && msg.image.startsWith('blob:')) {
          URL.revokeObjectURL(msg.image);
        }
      });
    };
  }, [messages]);

  const suggestions = [
    "Quais plantas são fáceis de cuidar?",
    "Como regar corretamente a minha horta vertical?",
    "Como posso melhorar meus hábitos alimentares?",
    "Passo-a-passo para montar uma horta vertical no IFSUL Passo Fundo",
  ];

  const sendMessage = async (text, image = null) => {
    if (!text.trim() && !image) return;

    const userMessage = { 
      sender: "user", 
      text: text || "Analise esta imagem",
      image: image ? URL.createObjectURL(image) : null
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const prompt = image 
        ? `Analise esta imagem e identifique as plantas, dê dicas de cuidado: ${text || "O que você vê nesta imagem?"}`
        : text;
      
      const response = await askGemini(prompt, image);
      const botMessage = { sender: "bot", text: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ops! Algo deu errado. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, selectedImage);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">🌱 GreenMind</h1>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {msg.image && (
              <img src={msg.image} alt="Enviada" style={{maxWidth: '200px', borderRadius: '8px', marginBottom: '8px'}} />
            )}
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
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

      {selectedImage && (
        <div style={{padding: '10px', backgroundColor: '#f0f0f0', margin: '0 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
          <span style={{fontSize: '14px', flex: 1}}>{selectedImage.name}</span>
          <button onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{background: 'none', border: 'none', cursor: 'pointer'}}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{display: 'none'}}
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="image-button"
          title="Enviar foto"
        >
          📷
        </button>
        <input
          type="text"
          placeholder={selectedImage ? "Descreva o que quer saber sobre a imagem..." : "Digite sua pergunta..."}
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