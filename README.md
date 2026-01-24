# Assistente de Plantas com IA

Chatbot inteligente que ajuda no cuidado de plantas hortas verticais e hábitos saudáveis usando a API Gemini do Google.

## Pré-requisitos

- Node.js (v20 ou acima)
- npm
- Chave de API do Google Gemini ([obtenha aqui](https://aistudio.google.com/app/apikey))

## Como criar este projeto do zero

### 1. Criar o projeto React + Vite

```bash
npm create vite@latest chat_ia_aula -- --template react
cd chat_ia_aula
npm install
```

### 2. Instalar dependências

```bash
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configurar Tailwind CSS

Edite `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Criar arquivo de variáveis de ambiente

Crie `.env` na raiz do projeto:

```
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

### 5. Criar estrutura de pastas

```bash
mkdir src\services
```

### 6. Criar arquivo do serviço Gemini

Crie `src/services/gemini.js` com o código de integração da API.

### 7. Atualizar arquivos principais

- `src/index.css` - Estilos globais com Tailwind
- `src/App.css` - Estilos do chat
- `src/App.jsx` - Componente principal do chat
- `src/main.jsx` - Ponto de entrada

### 8. Executar o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173`

## Estrutura do Projeto

```
greenmind/
├── src/
│   ├── services/
│   │   └── gemini.js      # Integração com API Gemini
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos do chat
│   ├── index.css          # Estilos globais
│   └── main.jsx           # Entry point
├── .env                   # Variáveis de ambiente
├── package.json
└── vite.config.js
```

## Funcionalidades

- Chat interativo com IA
- Análise de imagens de plantas
- Dicas de cuidados com plantas
- Orientações sobre hábitos saudáveis

## Configuração da API Key

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crie uma nova API Key
3. Adicione no arquivo `.env`
4. Adicione `.env` no `.gitignore` para não expor sua chave

## Scripts

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build p produção
```

## 🛠️ Tecnologias Utilizadas

- React
- Vite
- Axios
- Google Gemini API
- Tailwind CSS
