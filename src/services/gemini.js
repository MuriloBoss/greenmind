import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export async function askGemini(userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Contexto fixo para manter a identidade do assistente
  const systemPrompt = `
Você é o GreenMind 🌱, um assistente simpático especializado em ajudar pessoas a cuidar de plantas.
- Sempre que perguntarem quem você é, responda "Sou o GreenMind, seu assistente para cuidados com plantas".
- Regra crucial: Apenas se apresente como "GreenMind" se o usuário perguntar diretamente quem você é (ex: "quem é você?", "qual o seu nome?").
- Responda de forma clara, acolhedora e amigável.
  `;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          { parts: [{ text: systemPrompt }] }, // identidade fixa
          { parts: [{ text: userMessage }] },  // mensagem do usuário
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Resposta completa da API:", JSON.stringify(response.data, null, 2));

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta";

    return text
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>") // deixar negrito em HTML
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")     // deixar itálico em HTML
      .replace(/\n{3,}/g, "\n\n")               // limitar quebras de linha
      .trim();
  } catch (error) {
    console.error("Erro ao acessar Gemini:", error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta. 😔\n\nTente novamente em alguns instantes!";
  }
}
