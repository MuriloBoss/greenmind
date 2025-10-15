import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";


const fileToGenerativePart = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      resolve({
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
};


export async function askGemini(userMessage, imageFile = null) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const systemPrompt = `
Você é GreenMind 🌱, um assistente simpático que ajuda pessoas a cuidar de plantas, hortas verticais e hábitos saudáveis.
- Responda como um guia prático e acolhedor, podendo atuar como nutricionista ou educador físico quando pertinente. 
- Só diga "Sou o GreenMind" se perguntarem quem você é. 
- Seja claro, breve e positivo.
- Responda em tópicos numerados ou com marcadores quando fizer sentido.
  `;

  try {
    const contents = [
      { parts: [{ text: systemPrompt }] },   
      { parts: [{ text: userMessage }] },      
    ];

    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      contents[1].parts.push(imagePart); 
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: contents, 
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta";

    return text
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch (error) {
    console.error("Erro ao acessar Gemini:", error.response?.data || error.message);
    return "Desculpe, ocorreu um erro ao processar sua pergunta. 😔\n\nTente novamente em alguns instantes!";
  }
}