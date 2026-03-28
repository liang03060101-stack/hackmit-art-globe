import React, { useState, useEffect, useRef } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';
import useTypingEffect from '../hooks/useTypingEffect';
import LoadingDots from './LoadingDots';

export default function PaintingView({ art, onBack, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 18);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef(null);
  const imgLoadedRef = useRef(false); // track without stale closure

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => setVisible(false);
  }, []);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    setSheetOpen(false);
    imgLoadedRef.current = false;
    // Only show error after 12s AND image still hasn't loaded
    const t = setTimeout(() => {
      if (!imgLoadedRef.current) setImgError(true);
    }, 12000);
    return () => clearTimeout(t);
  }, [art?.id]);

  // Auto-focus input when sheet opens
  useEffect(() => {
    if (sheetOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [sheetOpen]);

  if (!art) return null;

  const imgOk = imgLoaded && !imgError;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: '#0C0A07',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      display: 'grid',
      // Left narrow strip | Center painting | Right info strip
      gridTemplateColumns: '1fr auto 1fr',
      gridTemplateRows: '1fr',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeIn  { from { opacity:0; }               to { opacity:1; } }
        @keyframes riseIn  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(1.3);} }
        @keyframes sheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        .ask-input::placeholder { color: rgba(245,237,228,0.3); }
        .ask-input:focus { border-color: #C8956C !important; }
        .sheet-scroll::-webkit-scrollbar { width:3px; }
        .sheet-scroll::-webkit-scrollbar-thumb { background:rgba(200,149,108,0.25); border-radius:3px; }
      `}</style>

      {/* ── LEFT META COLUMN ── */}
      <div style={{
        gridColumn: '1', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'flex-end',
        padding: '0 36px 56px 24px',
        animation: visible ? 'riseIn 0.7s ease 0.3s both' : 'none',
      }}>
        {/* Back button */}
        <button onClick={onBack} style={{
          position: 'absolute', top: 24, left: 24,
          background: 'transparent',
          border: '1px solid rgba(200,149,108,0.25)',
          borderRadius: 8, padding: '7px 14px',
          color: 'rgba(226,189,148,0.7)', fontSize: 12,
          fontFamily: FONTS_SANS, fontWeight: 500,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          transition: 'all 0.2s',
          letterSpacing: '0.5px',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8956C'; e.currentTarget.style.color = '#E2BD94'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,149,108,0.25)'; e.currentTarget.style.color = 'rgba(226,189,148,0.7)'; }}
        >
          &#8592; Globe
        </button>

        {/* Rotated year label */}
        <div style={{
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontFamily: FONTS_SANS, fontSize: 10,
          color: 'rgba(245,237,228,0.2)', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: 16, userSelect: 'none',
        }}>{art.year}</div>

        {/* Museum tag */}
        <div style={{
          fontFamily: FONTS_SANS, fontSize: 10,
          color: 'rgba(200,149,108,0.5)', letterSpacing: '1.5px',
          textTransform: 'uppercase', textAlign: 'right',
          lineHeight: 1.8, marginBottom: 4,
        }}>
          {art.museum}<br />
          <span style={{ color: 'rgba(245,237,228,0.25)' }}>{art.city}</span>
        </div>
      </div>

      {/* ── CENTER: PAINTING ── */}
      <div style={{
        gridColumn: '2', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '64px 0 80px',
        position: 'relative',
        minWidth: 0,
      }}>
        {/* Glow behind painting */}
        <div style={{
          position: 'absolute', inset: '10% 5%',
          background: 'radial-gradient(ellipse at center, rgba(200,149,108,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Image */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: imgOk ? 'fadeIn 0.8s ease both' : 'none',
        }}>
          {!imgOk && !imgError && (
            <div style={{
              width: 240, height: 300,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(245,237,228,0.2)', fontFamily: FONTS_SANS,
              fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
            }}>
              Loading<LoadingDots />
            </div>
          )}
          {imgError && (
            <div style={{
              width: 240, height: 300,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(245,237,228,0.2)', fontFamily: FONTS_SANS,
              fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
              border: '1px solid rgba(200,149,108,0.1)', borderRadius: 4,
            }}>
              Image unavailable
            </div>
          )}
          <img
            src={art.img} alt={art.title}
            onLoad={() => { imgLoadedRef.current = true; setImgLoaded(true); setImgError(false); }}
            onError={() => { if (!imgLoadedRef.current) setImgError(true); }}
            style={{
              maxWidth: 'min(480px, 50vw)',
              maxHeight: '62vh',
              objectFit: 'contain',
              display: imgOk ? 'block' : 'none',
              filter: 'drop-shadow(0 20px 80px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(200,149,108,0.08))',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Title + artist — always visible below painting */}
        <div style={{
          marginTop: 28, textAlign: 'center', zIndex: 1,
          animation: visible ? 'riseIn 0.7s ease 0.4s both' : 'none',
        }}>
          <h2 style={{
            fontFamily: FONTS, fontSize: 24, fontWeight: 500,
            color: '#F5EDE4', letterSpacing: '0.2px',
            lineHeight: 1.2, margin: '0 0 6px',
          }}>{art.title}</h2>
          <p style={{
            fontFamily: FONTS_SANS, fontSize: 11.5,
            color: 'rgba(200,149,108,0.75)', margin: 0,
            letterSpacing: '0.8px', fontWeight: 500,
          }}>
            {art.artist}
          </p>
        </div>

        {/* Open sheet button */}
        <button
          onClick={() => setSheetOpen(true)}
          style={{
            marginTop: 20, zIndex: 1,
            background: 'transparent',
            border: '1px solid rgba(200,149,108,0.22)',
            borderRadius: 6, padding: '6px 18px',
            color: 'rgba(226,189,148,0.55)', fontSize: 10.5,
            fontFamily: FONTS_SANS, letterSpacing: '1.8px',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8956C'; e.currentTarget.style.color = '#E2BD94'; e.currentTarget.style.background = 'rgba(200,149,108,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,149,108,0.22)'; e.currentTarget.style.color = 'rgba(226,189,148,0.55)'; e.currentTarget.style.background = 'transparent'; }}
        >
          Explore · Ask the Artist
        </button>
      </div>

      {/* ── RIGHT: AI STATUS COLUMN ── */}
      <div style={{
        gridColumn: '3', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'flex-start',
        padding: '0 24px 56px 36px',
        animation: visible ? 'riseIn 0.7s ease 0.35s both' : 'none',
      }}>
        {/* Pulsing AI indicator (always visible when active) */}
        {(isFetching || aiWhisper) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: isFetching ? '#D4A54A' : '#7BAF5E',
              animation: isFetching ? 'pulse 1s infinite' : 'none',
              boxShadow: isFetching ? '0 0 8px #D4A54A' : '0 0 6px #7BAF5E66',
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 9, color: 'rgba(226,189,148,0.5)',
              letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {isFetching ? 'Channeling…' : 'Artist spoke'}
            </span>
          </div>
        )}
      </div>

      {/* ── BOTTOM SHEET: Description + AI ── */}
      {sheetOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setSheetOpen(false); }}
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="sheet-scroll"
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              maxHeight: '62vh',
              background: 'rgba(18,15,10,0.98)',
              borderTop: '1px solid rgba(200,149,108,0.15)',
              borderRadius: '16px 16px 0 0',
              padding: '0 0 32px',
              overflowY: 'auto',
              animation: 'sheetUp 0.38s cubic-bezier(0.32,0,0.67,0) both',
            }}
          >
            {/* Sheet handle + header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 28px 14px',
              borderBottom: '1px solid rgba(200,149,108,0.08)',
              position: 'sticky', top: 0,
              background: 'rgba(18,15,10,0.98)',
              backdropFilter: 'blur(8px)',
              zIndex: 2,
            }}>
              <div>
                <div style={{
                  fontFamily: FONTS_SANS, fontSize: 9.5, color: 'rgba(200,149,108,0.6)',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 2,
                }}>About this work</div>
                <div style={{
                  fontFamily: FONTS, fontSize: 17, color: '#F5EDE4', fontWeight: 500,
                }}>{art.title}</div>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  background: 'transparent', border: 'none',
                  color: 'rgba(245,237,228,0.3)', fontSize: 20,
                  cursor: 'pointer', padding: '4px 8px',
                  transition: 'color 0.2s', lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#E2BD94'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,228,0.3)'}
              >×</button>
            </div>

            {/* Sheet body */}
            <div style={{ padding: '20px 28px', maxWidth: 720, margin: '0 auto' }}>
              {/* Description */}
              <p style={{
                fontFamily: FONTS_SANS, fontSize: 13.5,
                color: 'rgba(245,237,228,0.55)', lineHeight: 1.9,
                marginBottom: 24, fontWeight: 400,
              }}>{art.desc}</p>

              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18,
              }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(200,149,108,0.1)' }} />
                <span style={{
                  fontFamily: FONTS_SANS, fontSize: 9, color: 'rgba(200,149,108,0.4)',
                  textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap',
                }}>Artist's Whisper</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(200,149,108,0.1)' }} />
              </div>

              {/* AI Whisper display */}
              <div style={{
                fontFamily: FONTS, fontSize: 16, lineHeight: 1.9,
                fontStyle: 'italic', color: '#E8D5BF',
                minHeight: 48, marginBottom: 20,
              }}>
                {isFetching ? (
                  <span style={{ color: 'rgba(245,237,228,0.3)', fontStyle: 'normal', fontSize: 13 }}>
                    Reaching across centuries<LoadingDots />
                  </span>
                ) : displayed ? (
                  <span>&ldquo;{displayed}{done ? '\u201D' : ''}</span>
                ) : (
                  <span style={{ color: 'rgba(245,237,228,0.25)', fontStyle: 'normal', fontSize: 12.5, letterSpacing: '0.5px' }}>
                    Send a question — the artist will answer from across time.
                  </span>
                )}
              </div>

              {/* Input row */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={inputRef}
                  className="ask-input"
                  value={userQ}
                  onChange={e => setUserQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
                  placeholder={`Ask ${art.artist.split(' ').pop()} a question…`}
                  style={{
                    flex: 1, padding: '11px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(200,149,108,0.18)',
                    borderRadius: 8, color: '#F5EDE4',
                    fontFamily: FONTS_SANS, fontSize: 14,
                    outline: 'none', transition: 'border 0.2s',
                  }}
                />
                <button
                  onClick={onAsk}
                  disabled={isFetching || !userQ.trim()}
                  style={{
                    padding: '11px 22px',
                    background: (!userQ.trim() || isFetching)
                      ? 'rgba(200,149,108,0.12)'
                      : 'linear-gradient(135deg, #C8956C, #D4A54A)',
                    border: 'none', borderRadius: 8,
                    color: (!userQ.trim() || isFetching) ? 'rgba(200,149,108,0.35)' : '#1A1510',
                    fontFamily: FONTS_SANS, fontSize: 13, fontWeight: 700,
                    cursor: isFetching ? 'wait' : (!userQ.trim() ? 'default' : 'pointer'),
                    transition: 'all 0.25s', whiteSpace: 'nowrap',
                  }}
                >Ask</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
