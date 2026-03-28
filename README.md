# 🌍 ART GLOBE: Echoes of Eternity

> *"Converse with masters across time, and hear the whispers behind the world's greatest masterpieces."*

## 💡 Inspiration
Art is often locked behind glass in silent museums. We wanted to shatter that glass. What if you could not just look at *The Starry Night* or Qi Baishi's *Shrimp*, but actually **ask the artist what they were feeling** at that exact moment? We built Art Globe to resurrect the souls of history's greatest creators through AI, turning passive observation into an immersive, cross-century dialogue.

## ✨ What it does
Art Globe is an interactive 3D WebGL experience. 
- **Explore:** Spin a beautifully rendered, museum-lit 3D earth to discover world-renowned masterpieces based on their real-world geographical locations.
- **Discover:** Click on golden glowing markers to pull up a cinematic gallery panel detailing the artwork's history.
- **Converse:** Powered by a customized LLM, the "Artist's Whisper" feature allows users to talk directly to artists like Van Gogh, Da Vinci, and Qi Baishi in real-time. They respond in-character, matching the user's language, offering poetic insights into their state of mind.

## 🛠️ How we built it
- **Frontend:** React.js, Vite
- **3D Rendering:** Three.js, Globe.gl (Customized with a warm, museum-aesthetic lighting and atmosphere)
- **Animations:** Framer Motion (For buttery-smooth UI transitions)
- **Backend & AI:** Vercel Serverless Functions + Zhipu AI / Anthropic API
- **Styling:** Custom CSS with global typography (`Cormorant Garamond` & `DM Sans`)

## 🚧 Challenges we ran into
Handling 3D canvas events alongside complex React state management was tricky. We also spent significant time tuning the AI prompt to ensure the artists didn't sound like robots, but rather poetic souls. Finally, managing CORS and API security forced us to quickly adapt and build a robust serverless backend.

## 🚀 How to run it locally
1. Clone the repo: `git clone [your-repo-link]`
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the root and add your API key: `ZHIPU_API_KEY=your_key_here`
4. Start the fullstack environment: `npx vercel dev`
5. Open `http://localhost:3000` and start exploring!

## 🤖 AI Usage
> **Claude 3.5 Sonnet**: Used for architecting the "Artist’s Whisper" prompt engine and generating initial bilingual artist personas.
> **GitHub Copilot**: Used as a coding assistant for boilerplate React components and complex Three.js shader logic.
> **ChatGPT**: Used for refining project documentation and brainstorming UI/UX layouts.
