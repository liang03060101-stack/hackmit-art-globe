import React, { useState, useEffect } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';
import useTypingEffect from '../hooks/useTypingEffect';
import LoadingDots from './LoadingDots';

export default function ArtPanel({ art, onClose, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 18);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setImgLoaded(false); }, [art?.id]);

  if (!art) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '440px', maxWidth: '100vw', height: '100%',
      background: THEME.bgPanel,
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      borderLeft: `1px solid ${THEME.border}`,
      zIndex: 20, display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 80px rgba(0,0,0,0.7)',
      animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      <button onClick={onClose} style={{
        position: 'sticky', top: 12, marginLeft: 'auto', marginRight: 12,
        background: 'rgba(28,24,18,0.8)', border: `1px solid ${THEME.borderLight}`,
        borderRadius: '50%', width: 36, height: 36,
        color: THEME.accentLight, fontSize: 16, cursor: 'pointer', zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s', flexShrink: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = THEME.accentDim; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(28,24,18,0.8)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >✕</button>

      {/* Art Image */}
      <div style={{
        position: 'relative', marginTop: -36, flexShrink: 0,
        background: '#0F0D08',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '38vh', maxHeight: '44vh', overflow: 'hidden',
        borderBottom: `1px solid ${THEME.border}`,
      }}>
        <img
          src={art.img} alt={art.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            maxWidth: '94%', maxHeight: '42vh', objectFit: 'contain',
            padding: 12, opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
            filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }} />
      </div>

      {/* Info */}
      <div style={{ padding: '18px 24px 24px', flexShrink: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: THEME.accentDim, border: `1px solid ${THEME.border}`,
          borderRadius: 16, padding: '4px 12px', fontSize: 10.5,
          color: THEME.accentLight, letterSpacing: '0.5px', marginBottom: 12,
          fontFamily: FONTS_SANS, textTransform: 'uppercase', fontWeight: 500,
        }}>
          <span style={{ fontSize: 12 }}>📍</span> {art.city} · {art.museum}
        </div>

        <h2 style={{
          fontFamily: FONTS, fontSize: 28, margin: '0 0 4px',
          fontWeight: 600, lineHeight: 1.15, color: THEME.textMain,
        }}>{art.title}</h2>
        <p style={{
          fontFamily: FONTS_SANS, color: THEME.accent, fontSize: 13,
          margin: '0 0 14px', fontWeight: 500,
        }}>
          {art.artist}<span style={{ opacity: 0.5, fontWeight: 400 }}> · {art.year}</span>
        </p>

        <div style={{
          width: 48, height: 2, marginBottom: 12,
          background: `linear-gradient(90deg, ${THEME.accentGold}, transparent)`,
        }} />

        <p style={{
          fontFamily: FONTS_SANS, color: THEME.textSec, fontSize: 12.5,
          lineHeight: 1.7, margin: '0 0 18px',
        }}>{art.desc}</p>

        {/* AI Whisper */}
        <div style={{
          background: 'rgba(200, 149, 108, 0.06)',
          border: `1px solid ${THEME.border}`,
          borderRadius: 12, padding: 18, marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 50, height: 50,
            background: 'linear-gradient(135deg, rgba(200,149,108,0.08), transparent)',
            borderRadius: '0 12px 0 0',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isFetching ? `radial-gradient(${THEME.accentGold}, ${THEME.accent})` : (aiWhisper ? '#7BAF5E' : THEME.accent),
              animation: isFetching ? 'pulse 1s infinite' : 'none',
              boxShadow: isFetching ? `0 0 10px ${THEME.accent}` : 'none',
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accentLight,
              textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
            }}>
              {isFetching ? 'Channeling the artist...' : "Artist's Whisper"}
            </span>
          </div>
          <div style={{
            fontFamily: FONTS, fontSize: 15, lineHeight: 1.7,
            fontStyle: 'italic', color: THEME.textWarm, minHeight: 40,
          }}>
            {isFetching ? (
              <span style={{ color: THEME.textSec }}>Reaching across centuries<LoadingDots /></span>
            ) : (
              displayed
                ? <span>&ldquo;{displayed}{done ? '\u201D' : ''}</span>
                : <span style={{ color: THEME.textSec, fontStyle: 'normal', fontSize: 12.5 }}>Ask the artist a question below...</span>
            )}
          </div>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={userQ} onChange={e => setUserQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
            placeholder={`Ask ${art.artist.split(' ').pop()} something...`}
            style={{
              flex: 1, padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`,
              borderRadius: 10, color: THEME.textMain,
              fontFamily: FONTS_SANS, fontSize: 13, outline: 'none', transition: 'border 0.25s',
            }}
            onFocus={e => e.target.style.borderColor = THEME.accent}
            onBlur={e => e.target.style.borderColor = THEME.border}
          />
          <button onClick={onAsk} disabled={isFetching || !userQ.trim()} style={{
            padding: '10px 18px',
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentGold})`,
            border: 'none', borderRadius: 10, color: '#1A1510',
            fontFamily: FONTS_SANS, fontSize: 12.5, fontWeight: 700,
            cursor: isFetching ? 'wait' : 'pointer', transition: 'all 0.25s',
            opacity: (!userQ.trim() || isFetching) ? 0.4 : 1, whiteSpace: 'nowrap',
            boxShadow: (!userQ.trim() || isFetching) ? 'none' : '0 4px 16px rgba(200,149,108,0.3)',
          }}>Ask</button>
        </div>
      </div>
    </div>
  );
}