import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export async function askGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";
  } catch (error) {
    console.error("Erro ao acessar Gemini:", error);
    return "Ocorreu um erro ao gerar a resposta.";
  }
}
