import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

/* ────────────────────────────────────────────────────
   ART GLOBE — 世界名画 × AI 艺术家灵魂对话
   ──────────────────────────────────────────────────── */

const THEME = {
  accent: '#D4A574',
  accentLight: '#E8C9A0',
  accentDim: 'rgba(212, 165, 116, 0.3)',
  bg: 'rgba(8, 6, 12, 0.92)',
  card: 'rgba(20, 18, 28, 0.85)',
  border: 'rgba(212, 165, 116, 0.15)',
  borderHover: 'rgba(212, 165, 116, 0.4)',
  textMain: '#F2EDE8',
  textSec: 'rgba(242, 237, 232, 0.6)',
  glow: '0 0 40px rgba(212, 165, 116, 0.15)',
};

const FONTS = `'Cormorant Garamond', 'Georgia', serif`;
const FONTS_SANS = `'DM Sans', 'Helvetica Neue', sans-serif`;

// ─── 画作数据 ───
const ART_DATA = [
  {
    id: 1, lat: 48.8566, lng: 2.3522, city: 'Paris', museum: 'Musée du Louvre',
    title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503–1519',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg&w=600&output=webp',
    desc: 'The most famous painting in the world, housed in the Louvre. A masterpiece of Renaissance sfumato technique and psychological depth.',
    color: '#8B7355',
  },
  {
    id: 2, lat: 40.7614, lng: -73.9776, city: 'New York', museum: 'MoMA',
    title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: 'Painted during Van Gogh\'s stay at Saint-Rémy asylum. The swirling night sky pulses with emotion and cosmic energy.',
    color: '#2B4F8C',
  },
  {
    id: 3, lat: 35.7150, lng: 139.7734, city: 'Tokyo', museum: 'Various Collections',
    title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg&w=600&output=webp',
    desc: 'The most iconic ukiyo-e woodblock print. Mount Fuji stands serene as towering waves crash with terrifying beauty.',
    color: '#1A5276',
  },
  {
    id: 4, lat: 52.0804, lng: 4.3143, city: 'The Hague', museum: 'Mauritshuis',
    title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg&w=600&output=webp',
    desc: 'Called the "Mona Lisa of the North." Vermeer\'s mastery of light culminates in the luminous pearl and the girl\'s enigmatic gaze.',
    color: '#2C3E50',
  },
  {
    id: 5, lat: 40.4083, lng: -3.6946, city: 'Madrid', museum: 'Museo Reina Sofía',
    title: 'Guernica', artist: 'Pablo Picasso', year: '1937',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg&w=600&output=webp',
    desc: 'A monumental anti-war statement. Picasso\'s Cubist language transforms the bombing of Guernica into a universal cry against violence.',
    color: '#4A4A4A',
  },
  {
    id: 6, lat: 55.7520, lng: 37.6175, city: 'Moscow', museum: 'Tretyakov Gallery',
    title: 'The Ninth Wave', artist: 'Ivan Aivazovsky', year: '1850',
    img: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg/1280px-Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg&w=600&output=webp',
    desc: 'A Romantic masterpiece depicting survivors clinging to wreckage as dawn breaks over monstrous waves. Hope persists amid catastrophe.',
    color: '#8B6914',
  },
];

// ─── Typing animation hook ───
function useTypingEffect(text, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { displayed, done };
}

// ─── Animated dots ───
function LoadingDots() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(iv);
  }, []);
  return <span>{dots}</span>;
}

// ─── Globe Component (vanilla JS via ref) ───
function GlobeView({ artData, onPointClick, globeRef }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    let Globe;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/globe.gl@2.32.0/dist/globe.gl.min.js';
    script.onload = () => {
      Globe = window.Globe;
      if (!Globe || !containerRef.current) return;

      const world = Globe()(containerRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor(THEME.accent)
        .atmosphereAltitude(0.18)
        .pointsData(artData)
        .pointColor(() => THEME.accent)
        .pointAltitude(0.06)
        .pointRadius(0.7)
        .pointsMerge(false)
        .onPointClick((point) => {
          world.pointOfView({ lat: point.lat, lng: point.lng - 12, altitude: 1.4 }, 1200);
          onPointClick(point);
        });

      world.pointOfView({ lat: 30, lng: 10, altitude: 2.2 }, 0);
      world.controls().autoRotate = true;
      world.controls().autoRotateSpeed = 0.4;
      world.controls().enableZoom = true;

      instanceRef.current = world;
      if (globeRef) globeRef.current = world;
    };
    document.head.appendChild(script);

    return () => {
      if (instanceRef.current && instanceRef.current._destructor) {
        instanceRef.current._destructor();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ─── Side Panel ───
function ArtPanel({ art, onClose, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 25);

  if (!art) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '420px', maxWidth: '100vw', height: '100%',
      background: THEME.bg,
      backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      borderLeft: `1px solid ${THEME.border}`,
      zIndex: 20,
      display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
      animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'sticky', top: 12, marginLeft: 'auto', marginRight: 12,
        background: 'rgba(0,0,0,0.5)', border: `1px solid ${THEME.border}`,
        borderRadius: '50%', width: 36, height: 36,
        color: THEME.textMain, fontSize: 16, cursor: 'pointer', zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
        onMouseEnter={e => { e.target.style.background = THEME.accentDim; e.target.style.borderColor = THEME.accent; }}
        onMouseLeave={e => { e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.borderColor = THEME.border; }}
      >✕</button>

      {/* Image */}
      <div style={{ position: 'relative', marginTop: -36, flexShrink: 0 }}>
        <img src={art.img} alt={art.title} style={{
          width: '100%', height: '240px', objectFit: 'cover',
          borderBottom: `1px solid ${THEME.border}`,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: `linear-gradient(transparent, ${THEME.bg.replace('0.92', '1')})`,
        }} />
      </div>

      {/* Info */}
      <div style={{ padding: '0 28px 28px', flexShrink: 0 }}>
        {/* City tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: THEME.accentDim, border: `1px solid ${THEME.border}`,
          borderRadius: 20, padding: '4px 14px', fontSize: 11,
          color: THEME.accent, letterSpacing: '0.5px', marginBottom: 16,
          fontFamily: FONTS_SANS, textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: 14 }}>📍</span> {art.city} · {art.museum}
        </div>

        <h2 style={{
          fontFamily: FONTS, fontSize: 30, margin: '0 0 4px',
          fontWeight: 600, lineHeight: 1.2, color: THEME.textMain,
          letterSpacing: '-0.5px',
        }}>{art.title}</h2>

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.accent, fontSize: 14,
          margin: '0 0 20px', fontWeight: 500,
        }}>
          {art.artist} <span style={{ opacity: 0.5, fontWeight: 400 }}>· {art.year}</span>
        </p>

        {/* Divider */}
        <div style={{
          width: 50, height: 2,
          background: `linear-gradient(90deg, ${THEME.accent}, transparent)`,
          marginBottom: 20,
        }} />

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.textSec, fontSize: 13,
          lineHeight: 1.7, margin: '0 0 24px',
        }}>{art.desc}</p>

        {/* ═══ AI Whisper Section ═══ */}
        <div style={{
          background: 'rgba(212, 165, 116, 0.04)',
          border: `1px solid ${THEME.border}`,
          borderRadius: 12, padding: '20px', marginBottom: 16,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isFetching ? THEME.accent : (aiWhisper ? '#5cb85c' : THEME.accent),
              animation: isFetching ? 'pulse 1.2s infinite' : 'none',
              boxShadow: `0 0 8px ${isFetching ? THEME.accent : 'transparent'}`,
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 11, color: THEME.accent,
              textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
            }}>
              {isFetching ? 'Channeling the artist' : "Artist's Whisper"}
            </span>
          </div>

          <div style={{
            fontFamily: FONTS, fontSize: 15, lineHeight: 1.7,
            fontStyle: 'italic', color: THEME.textMain,
            minHeight: 50,
          }}>
            {isFetching ? (
              <span style={{ color: THEME.textSec }}>
                Reaching across time<LoadingDots />
              </span>
            ) : (
              displayed ? `"${displayed}${done ? '"' : ''}`
                : <span style={{ color: THEME.textSec, fontStyle: 'normal', fontSize: 13 }}>Ask the artist a question below...</span>
            )}
          </div>
        </div>

        {/* User input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={userQ}
            onChange={e => setUserQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
            placeholder={`Ask ${art.artist.split(' ').pop()} something...`}
            style={{
              flex: 1, padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${THEME.border}`,
              borderRadius: 8, color: THEME.textMain,
              fontFamily: FONTS_SANS, fontSize: 13,
              outline: 'none', transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = THEME.accent}
            onBlur={e => e.target.style.borderColor = THEME.border}
          />
          <button
            onClick={onAsk}
            disabled={isFetching || !userQ.trim()}
            style={{
              padding: '10px 18px',
              background: isFetching ? THEME.accentDim : THEME.accent,
              border: 'none', borderRadius: 8,
              color: '#0a0a0f', fontFamily: FONTS_SANS,
              fontSize: 13, fontWeight: 600, cursor: isFetching ? 'wait' : 'pointer',
              transition: 'all 0.2s', opacity: (!userQ.trim() || isFetching) ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >Ask</button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom mini cards ───
function ArtTicker({ artData, onSelect, selectedId }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 10, zIndex: 15,
      padding: '10px 16px',
      background: 'rgba(8, 6, 12, 0.7)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 16, border: `1px solid ${THEME.border}`,
    }}>
      {artData.map(art => (
        <button key={art.id} onClick={() => onSelect(art)} style={{
          width: 52, height: 52, borderRadius: 10, overflow: 'hidden',
          border: selectedId === art.id ? `2px solid ${THEME.accent}` : `2px solid transparent`,
          cursor: 'pointer', padding: 0, transition: 'all 0.3s',
          transform: selectedId === art.id ? 'scale(1.1)' : 'scale(1)',
          boxShadow: selectedId === art.id ? THEME.glow : 'none',
          opacity: selectedId && selectedId !== art.id ? 0.5 : 1,
        }}>
          <img src={art.img} alt={art.title} style={{
            width: '100%', height: '100%', objectFit: 'cover',
          }} />
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const globeRef = useRef(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [aiWhisper, setAiWhisper] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [userQ, setUserQ] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  // ─── Call Anthropic API ───
  const askArtist = useCallback(async (art, question) => {
    if (!question.trim()) return;
    setIsFetching(true);
    setAiWhisper('');

    const systemPrompt = `You are ${art.artist}, the famous artist, speaking from beyond time. You created "${art.title}" in ${art.year}. Respond in first person as the artist. Be poetic, insightful, and share your artistic philosophy. Keep responses to 2-3 sentences. Respond in the same language the user speaks. If they write Chinese, respond in Chinese. If English, respond in English.`;

    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: question }
    ];

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory,
        }),
      });

      const data = await response.json();
      const reply = data.content
        ?.filter(b => b.type === 'text')
        .map(b => b.text)
        .join('') || 'The artist remains silent...';

      setAiWhisper(reply);
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: reply },
      ]);
    } catch (err) {
      console.error('API Error:', err);
      setAiWhisper('The connection across time has faded... Please try again.');
    } finally {
      setIsFetching(false);
    }
  }, [conversationHistory]);

  // ─── Select a painting ───
  const handleSelect = useCallback((art) => {
    setSelectedArt(art);
    setAiWhisper('');
    setUserQ('');
    setConversationHistory([]);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: art.lat, lng: art.lng - 12, altitude: 1.4 }, 1200);
    }
    // Auto-greet
    const greeting = `Hello, ${art.artist}. Tell me about the moment you conceived "${art.title}."`;
    setUserQ('');
    setTimeout(() => {
      askArtist(art, greeting);
    }, 600);
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
    if (globeRef.current) {
      globeRef.current.pointOfView({ altitude: 2.2 }, 1000);
      globeRef.current.controls().autoRotate = true;
    }
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      backgroundColor: '#05040a', overflow: 'hidden',
      color: THEME.textMain, fontFamily: FONTS_SANS,
    }}>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${THEME.accentDim}; border-radius: 4px; }
        
        * { box-sizing: border-box; }
      `}</style>

      {/* Ambient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(212,165,116,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(100,80,160,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(30,60,100,0.04) 0%, transparent 50%)
        `,
        zIndex: 0,
      }} />

      {/* Globe */}
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <GlobeView artData={ART_DATA} onPointClick={handleSelect} globeRef={globeRef} />
      </div>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 28, left: 32,
        pointerEvents: 'none', zIndex: 10,
        animation: 'fadeUp 1s ease',
      }}>
        <h1 style={{
          fontFamily: FONTS, fontSize: 38, margin: 0,
          fontWeight: 600, letterSpacing: '1px',
          background: `linear-gradient(135deg, ${THEME.textMain}, ${THEME.accent})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Art Globe
        </h1>
        <p style={{
          fontFamily: FONTS_SANS, fontSize: 12, margin: '4px 0 0',
          color: THEME.textSec, letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          Converse with masters across time
        </p>
      </div>

      {/* Side Panel */}
      <ArtPanel
        art={selectedArt}
        onClose={handleClose}
        aiWhisper={aiWhisper}
        isFetching={isFetching}
        onAsk={handleAsk}
        userQ={userQ}
        setUserQ={setUserQ}
      />

      {/* Bottom ticker */}
      <ArtTicker artData={ART_DATA} onSelect={handleSelect} selectedId={selectedArt?.id} />
    </div>
  );
}
