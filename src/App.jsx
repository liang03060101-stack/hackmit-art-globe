import React, { useState, useCallback } from 'react';
import { THEME, FONTS, FONTS_SANS, ART_DATA } from './data/constants';
import GlobeCanvas from './components/GlobeCanvas';
import ArtGallery from './components/ArtGallery';
import PaintingView from './components/PaintingView';

export default function App() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [showPainting, setShowPainting] = useState(false);
  const [aiWhisper, setAiWhisper] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [userQ, setUserQ] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  // ─── Language detection ───
  const detectLang = useCallback((text) => {
    const cjk = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
    if (cjk && cjk.length > text.length * 0.15) return 'zh';
    if (/^[a-zA-Z\s.,!?'"()-]+$/.test(text.trim())) return 'en';
    return 'auto';
  }, []);

  // ─── API call ───
  const askArtist = useCallback(async (art, question, isGreeting = false) => {
    if (!question.trim()) return;
    setIsFetching(true);
    setAiWhisper('');

    const newHistory = [...conversationHistory, { role: 'user', content: question }];

    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paintingTitle: art.title,
          artistName: art.artist,
          userQuestion: question,
          isGreeting,
          maxLength: isGreeting ? 'short' : 'normal',
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const reply = data.whisper || '...';
      setAiWhisper(reply);
      setConversationHistory([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('API Error:', err);
      // Fallback to Anthropic API
      try {
        const lang = detectLang(question);
        const langInstruction = lang === 'en'
          ? 'Respond entirely in English.'
          : lang === 'zh'
          ? '请完全用中文回答。'
          : 'Respond in the same language the user used.';

        const sysPrompt = isGreeting
          ? `You are ${art.artist}, speaking from across time about your work "${art.title}". Give a SHORT bilingual greeting (2-3 sentences total, one line Chinese, one line English). Be poetic but concise. Do NOT write a long monologue.`
          : `You are ${art.artist}, speaking from across time about your work "${art.title}". ${langInstruction} Keep responses concise (2-4 sentences). Be poetic, personal, and insightful.`;

        const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: isGreeting ? 150 : 300,
            system: sysPrompt,
            messages: [{ role: 'user', content: question }],
          }),
        });
        const apiData = await apiRes.json();
        const reply = apiData.content?.map(c => c.text || '').join('') || '...';
        setAiWhisper(reply);
        setConversationHistory([...newHistory, { role: 'assistant', content: reply }]);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setAiWhisper('The signal across time is faint… please try again.\n时空信号微弱…请再试一次。');
      }
    } finally {
      setIsFetching(false);
    }
  }, [conversationHistory, detectLang]);

  // ─── Select a painting: globe navigates, then painting view opens ───
  const handleSelect = useCallback((art) => {
    setSelectedArt(art);
    setAiWhisper('');
    setUserQ('');
    setConversationHistory([]);

    // Let the globe animate to the location first, then show painting view
    setTimeout(() => {
      setShowPainting(true);
      const greeting = `Greet me briefly as ${art.artist}. One sentence in Chinese, one in English. Mention "${art.title}" and your feeling when creating it. Keep it under 40 words total.`;
      askArtist(art, greeting, true);
    }, 700);
  }, [askArtist]);

  // ─── Back to globe ───
  const handleBack = useCallback(() => {
    setShowPainting(false);
    // Wait for fade-out, then reset selection so globe zooms back out
    setTimeout(() => {
      setSelectedArt(null);
      setAiWhisper('');
      setConversationHistory([]);
    }, 500);
  }, []);

  const handleAsk = useCallback(() => {
    if (!selectedArt || !userQ.trim()) return;
    askArtist(selectedArt, userQ);
    setUserQ('');
  }, [selectedArt, userQ, askArtist]);

  // ─── Render ───
  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      background: THEME.bg, overflow: 'hidden',
      color: THEME.textMain, fontFamily: FONTS_SANS,
    }}>
      <style>{`
        @import url('https://gs.jurieo.com/gemini/fonts-googleapis/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,149,108,0.25); border-radius: 4px; }
      `}</style>

      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse at 30% 30%, rgba(200,149,108,0.1) 0%, transparent 50%),
                     radial-gradient(ellipse at 70% 60%, rgba(160,120,80,0.07) 0%, transparent 45%),
                     linear-gradient(170deg, #1A1510 0%, #0F0D08 40%, #161210 100%)`,
      }} />

      {/* Globe (always mounted, plays behind painting view) */}
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <GlobeCanvas artData={ART_DATA} onPointClick={handleSelect} selectedArt={selectedArt} />
      </div>

      {/* Header — hidden when painting view is open */}
      {!showPainting && (
        <div style={{
          position: 'absolute', top: 24, left: 28,
          pointerEvents: 'none', zIndex: 10,
          animation: 'fadeUp 1s ease',
        }}>
          <h1 style={{
            fontFamily: FONTS, fontSize: 30, fontWeight: 600,
            color: THEME.textMain, letterSpacing: '0.5px',
          }}>Art Globe</h1>
          <p style={{
            fontFamily: FONTS_SANS, fontSize: 10.5,
            color: THEME.textSec, letterSpacing: '2.5px',
            textTransform: 'uppercase', marginTop: 2,
          }}>Converse with masters across time</p>
        </div>
      )}

      {/* Top-right instruction hint */}
      {!selectedArt && (
        <div style={{
          position: 'absolute', top: 28, right: 28,
          zIndex: 10, pointerEvents: 'none', textAlign: 'right',
          animation: 'fadeUp 1.2s ease 0.4s both',
        }}>
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 11,
            color: THEME.textSec, letterSpacing: '1.8px',
            textTransform: 'uppercase', lineHeight: 1.7,
          }}>
            <span style={{
              display: 'inline-block',
              color: THEME.accentLight, opacity: 0.75,
              animation: 'float 3s ease-in-out infinite',
            }}>✦</span>
            {' '}Tap a glowing point to explore
            <br />
            <span style={{ opacity: 0.55 }}>or browse the gallery below</span>
          </div>
        </div>
      )}

      {/* Bottom gallery — hidden when painting view is open */}
      {!showPainting && (
        <ArtGallery artData={ART_DATA} onSelect={handleSelect} selectedId={selectedArt?.id} />
      )}

      {/* Painting view overlay */}
      {showPainting && selectedArt && (
        <PaintingView
          art={selectedArt}
          onBack={handleBack}
          aiWhisper={aiWhisper}
          isFetching={isFetching}
          onAsk={handleAsk}
          userQ={userQ}
          setUserQ={setUserQ}
        />
      )}
    </div>
  );
}
