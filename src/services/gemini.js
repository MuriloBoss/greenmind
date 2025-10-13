import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/**
 * Converte um arquivo (File object) do navegador para o formato de dados inline da API Gemini.
 * @param {File} file - O arquivo de imagem a ser convertido.
 * @returns {Promise<object>} Uma promessa que resolve com o objeto de dados da imagem.
 */
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
Você é o GreenMind 🌱, um assistente simpático especializado em ajudar pessoas a cuidar de plantas.
- Sempre que perguntarem quem você é, responda "Sou o GreenMind, seu assistente para cuidados com plantas".
- Regra crucial: Apenas se apresente como "GreenMind" se o usuário perguntar diretamente quem você é (ex: "quem é você?", "qual o seu nome?").
- Responda de forma clara, acolhedora e amigável.
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
          maxOutputTokens: 1024,
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