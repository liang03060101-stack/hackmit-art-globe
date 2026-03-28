import React, { useState, useEffect } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';
import useTypingEffect from '../hooks/useTypingEffect';
import LoadingDots from './LoadingDots';

export default function PaintingView({ art, onBack, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 18);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => setVisible(false);
  }, []);

  useEffect(() => { setImgLoaded(false); }, [art?.id]);

  if (!art) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'rgba(15, 13, 8, 0.94)',
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
      overflowY: 'auto', overflowX: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <style>{`
        @keyframes paintFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} style={{
        position: 'fixed', top: 20, left: 20, zIndex: 40,
        background: 'rgba(28,24,18,0.85)',
        border: `1px solid ${THEME.borderLight}`,
        borderRadius: 10, padding: '8px 16px',
        color: THEME.accentLight, fontSize: 13,
        fontFamily: FONTS_SANS, fontWeight: 500,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.25s',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = THEME.accentDim; e.currentTarget.style.transform = 'scale(1.03)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(28,24,18,0.85)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>&#8592;</span> Globe
      </button>

      {/* Main content */}
      <div style={{
        maxWidth: 680, width: '100%', padding: '72px 28px 48px',
        animation: visible ? 'paintFadeUp 0.7s ease 0.15s both' : 'none',
      }}>
        {/* Painting image */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          marginBottom: 36,
          minHeight: 200,
        }}>
          <img
            src={art.img} alt={art.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              maxWidth: '100%', maxHeight: '56vh', objectFit: 'contain',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease',
              filter: 'drop-shadow(0 8px 48px rgba(0,0,0,0.5))',
              borderRadius: 3,
            }}
          />
        </div>

        {/* Location badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: THEME.accentDim,
          border: `1px solid ${THEME.border}`,
          borderRadius: 20, padding: '5px 14px',
          fontSize: 10.5, color: THEME.accentLight,
          letterSpacing: '0.5px',
          fontFamily: FONTS_SANS, textTransform: 'uppercase', fontWeight: 500,
          marginBottom: 16,
        }}>
          {art.city} &middot; {art.museum}
        </div>

        {/* Title block */}
        <h2 style={{
          fontFamily: FONTS, fontSize: 34, margin: '0 0 6px',
          fontWeight: 600, lineHeight: 1.15, color: THEME.textMain,
        }}>{art.title}</h2>

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.accent, fontSize: 14,
          margin: '0 0 20px', fontWeight: 500,
        }}>
          {art.artist}
          <span style={{ opacity: 0.5, fontWeight: 400 }}> &middot; {art.year}</span>
        </p>

        <div style={{
          width: 48, height: 2, marginBottom: 18,
          background: `linear-gradient(90deg, ${THEME.accentGold}, transparent)`,
        }} />

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.textSec, fontSize: 14.5,
          lineHeight: 1.85, margin: '0 0 36px',
        }}>{art.desc}</p>

        {/* AI Whisper section */}
        <div style={{
          background: 'rgba(200, 149, 108, 0.05)',
          border: `1px solid ${THEME.border}`,
          borderRadius: 14, padding: '20px 22px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isFetching
                ? `radial-gradient(${THEME.accentGold}, ${THEME.accent})`
                : (aiWhisper ? '#7BAF5E' : THEME.accent),
              animation: isFetching ? 'pulse 1s infinite' : 'none',
              boxShadow: isFetching ? `0 0 10px ${THEME.accent}` : 'none',
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accentLight,
              textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
            }}>
              {isFetching ? 'Channeling the artist...' : "Artist's whisper"}
            </span>
          </div>
          <div style={{
            fontFamily: FONTS, fontSize: 16, lineHeight: 1.85,
            fontStyle: 'italic', color: THEME.textWarm, minHeight: 44,
          }}>
            {isFetching ? (
              <span style={{ color: THEME.textSec }}>Reaching across centuries<LoadingDots /></span>
            ) : (
              displayed
                ? <span>&ldquo;{displayed}{done ? '\u201D' : ''}</span>
                : <span style={{ color: THEME.textSec, fontStyle: 'normal', fontSize: 13 }}>
                    Ask the artist a question below...
                  </span>
            )}
          </div>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={userQ}
            onChange={e => setUserQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
            placeholder={`Ask ${art.artist.split(' ').pop()} something...`}
            style={{
              flex: 1, padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${THEME.border}`,
              borderRadius: 10, color: THEME.textMain,
              fontFamily: FONTS_SANS, fontSize: 14,
              outline: 'none', transition: 'border 0.25s',
            }}
            onFocus={e => e.target.style.borderColor = THEME.accent}
            onBlur={e => e.target.style.borderColor = THEME.border}
          />
          <button
            onClick={onAsk}
            disabled={isFetching || !userQ.trim()}
            style={{
              padding: '12px 22px',
              background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentGold})`,
              border: 'none', borderRadius: 10, color: '#1A1510',
              fontFamily: FONTS_SANS, fontSize: 13, fontWeight: 700,
              cursor: isFetching ? 'wait' : 'pointer',
              opacity: (!userQ.trim() || isFetching) ? 0.4 : 1,
              transition: 'all 0.25s', whiteSpace: 'nowrap',
              boxShadow: (!userQ.trim() || isFetching) ? 'none' : '0 4px 16px rgba(200,149,108,0.25)',
            }}
          >Ask</button>
        </div>
      </div>
    </div>
  );
}
