import React, { useState, useCallback } from 'react';
import { THEME, FONTS, FONTS_SANS, ART_DATA } from './data/constants';

// 导入拆分好的组件
import GlobeCanvas from './components/GlobeCanvas';
import CityPopup from './components/CityPopup';
import ArtPanel from './components/ArtPanel';
import ArtGallery from './components/ArtGallery';

export default function App() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [aiWhisper, setAiWhisper] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [userQ, setUserQ] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showCityPopup, setShowCityPopup] = useState(false);

  // ─── 语言检测 ───
  const detectLang = useCallback((text) => {
    const cjk = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
    if (cjk && cjk.length > text.length * 0.15) return 'zh';
    if (/^[a-zA-Z\s.,!?'"()-]+$/.test(text.trim())) return 'en';
    return 'auto'; 
  }, []);

  // ─── API 调用 ───
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
          isGreeting: isGreeting,
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
      // Fallback 逻辑保持原样
      try {
        const lang = detectLang(question);
        const langInstruction = lang === 'en' ? 'Respond entirely in English.' : lang === 'zh' ? '请完全用中文回答。' : 'Respond in the same language the user used.';
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

  // ─── 交互事件 ───
  const handleSelect = useCallback((art) => {
    setSelectedArt(art);
    setAiWhisper('');
    setUserQ('');
    setConversationHistory([]);
    setShowCityPopup(true);

    const greeting = `Greet me briefly as ${art.artist}. One sentence in Chinese, one in English. Mention "${art.title}" and your feeling when creating it. Keep it under 40 words total.`;
    setTimeout(() => askArtist(art, greeting, true), 400);

    // ✅ 修复截断的代码：5秒后自动隐藏城市弹窗
    setTimeout(() => setShowCityPopup(false), 5000); 
  }, [askArtist]);

  const handleAsk = useCallback(() => {
    if (!selectedArt || !userQ.trim()) return;
    askArtist(selectedArt, userQ);
    setUserQ('');
  }, [selectedArt, userQ, askArtist]);

  const handleClose = useCallback(() => {
    setSelectedArt(null);
    setAiWhisper('');
    setConversationHistory([]);
    setShowCityPopup(false);
  }, []);

  // ─── 渲染 ───
  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      background: THEME.bg, overflow: 'hidden',
      color: THEME.textMain, fontFamily: FONTS_SANS,
    }}>
      <style>{`
        @import url('https://gs.jurieo.com/gemini/fonts-googleapis/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes popIn { 0% { opacity: 0; transform: translate(-80%, -50%) scale(0.9); } 100% { opacity: 1; transform: translate(-80%, -60%) scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,149,108,0.25); border-radius: 4px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        div::-webkit-scrollbar { height: 0; width: 0; }
      `}</style>

      {/* 背景与地球 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: `radial-gradient(ellipse at 30% 30%, rgba(200,149,108,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(160,120,80,0.07) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(80,60,40,0.12) 0%, transparent 50%), linear-gradient(170deg, #1A1510 0%, #0F0D08 40%, #161210 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8956C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <GlobeCanvas artData={ART_DATA} onPointClick={handleSelect} selectedArt={selectedArt} showCityPopup={showCityPopup} />
      </div>

      {/* 头部 */}
      <div style={{ position: 'absolute', top: 28, left: 32, pointerEvents: 'none', zIndex: 10, animation: 'fadeUp 1s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentGold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 16px rgba(200,149,108,0.3)' }}>🎨</div>
          <div>
            <h1 style={{ fontFamily: FONTS, fontSize: 34, margin: 0, fontWeight: 600, letterSpacing: '0.5px', color: THEME.textMain }}>Art Globe</h1>
            <p style={{ fontFamily: FONTS_SANS, fontSize: 11, margin: '2px 0 0', color: THEME.textSec, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Converse with masters across time</p>
          </div>
        </div>
      </div>

      {!selectedArt && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none', textAlign: 'center', animation: 'fadeUp 1.5s ease 0.5s both' }}>
          <div style={{ fontFamily: FONTS, fontSize: 20, color: THEME.accentLight, opacity: 0.5, animation: 'float 3s ease-in-out infinite' }}>Click a golden point on the globe</div>
          <div style={{ fontFamily: FONTS_SANS, fontSize: 11, color: THEME.textSec, marginTop: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>or select a masterpiece below</div>
        </div>
      )}

      {/* 挂载各种组件 */}
      {showCityPopup && <CityPopup art={selectedArt} onClose={() => setShowCityPopup(false)} />}
      <ArtPanel art={selectedArt} onClose={handleClose} aiWhisper={aiWhisper} isFetching={isFetching} onAsk={handleAsk} userQ={userQ} setUserQ={setUserQ} />
      <ArtGallery artData={ART_DATA} onSelect={handleSelect} selectedId={selectedArt?.id} />

    </div>
  );
}