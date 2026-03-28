import React, { useState, useEffect, useRef } from 'react';
import { FONTS, FONTS_SANS } from '../data/constants';
import useTypingEffect from '../hooks/useTypingEffect';
import LoadingDots from './LoadingDots';

export default function PaintingView({ art, onBack, aiWhisper, isFetching, onAsk, userQ, setUserQ }) {
  const { displayed, done } = useTypingEffect(aiWhisper, 18);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgLoadedRef = useRef(false);

  // Physics refs for Butter-Smooth Lerp Animation
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const requestRef = useRef(null);
  const containerRef = useRef(null);

  // High-performance animation loop
  const animateParallax = () => {
    currentX.current += (targetX.current - currentX.current) * 0.08;
    currentY.current += (targetY.current - currentY.current) * 0.08;

    if (containerRef.current) {
      containerRef.current.style.setProperty('--mx', currentX.current.toFixed(4));
      containerRef.current.style.setProperty('--my', currentY.current.toFixed(4));
    }
    requestRef.current = requestAnimationFrame(animateParallax);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateParallax);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    
    return () => {
      setVisible(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    imgLoadedRef.current = false;
    const t = setTimeout(() => {
      if (!imgLoadedRef.current) setImgError(true);
    }, 12000);
    return () => clearTimeout(t);
  }, [art?.id]);

  const handleMouseMove = (e) => {
    targetX.current = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY.current = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  if (!art) return null;

  const imgOk = imgLoaded && !imgError;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: '#0C0A07',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 1fr) auto minmax(260px, 1fr)',
        gridTemplateRows: '1fr auto',
        overflow: 'hidden',
        '--mx': 0,
        '--my': 0,
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0; }               to { opacity:1; } }
        @keyframes riseIn  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(1.3);} }
        .ask-input::placeholder { color: rgba(245,237,228,0.32); }
        .ask-input { caret-color: transparent; }
        .ask-input:focus { border-color: #C8956C !important; }
        
        .parallax-layer {
          will-change: transform;
        }

        /* Updated Year Physics to maintain original movement feel */
        .parallax-year-container { transform: translate(calc(var(--mx) * -18px), calc(var(--my) * 18px)); }
        .parallax-location { transform: translate(calc(var(--mx) * 25px), calc(var(--my) * 25px)); }
        .parallax-glow { transform: scale(1.2) translate(calc(var(--mx) * -50px), calc(var(--my) * -50px)); }
        .parallax-about { transform: translate(calc(var(--mx) * 16px), calc(var(--my) * 16px)); }
        .parallax-whisper { transform: translate(calc(var(--mx) * 32px), calc(var(--my) * 32px)); }
      `}</style>

      {/* LEFT META COLUMN */}
      <div style={{
        gridColumn: '1', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'flex-end',
        padding: '0 28px 120px 24px',
        animation: visible ? 'riseIn 0.7s ease 0.3s both' : 'none',
      }}>
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

        {/* YEAR BLOCK: Now matches Location formatting */}
        <div 
          className="parallax-layer parallax-year-container"
          style={{
            width: '100%',
            maxWidth: 260,
            border: 'none',
            borderRadius: 10,
            padding: '10px 10px 8px',
            background: 'rgba(200,149,108,0.015)',
            marginBottom: 12,
          }}
        >
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 9.5,
            color: 'rgba(200,149,108,0.42)', letterSpacing: '1.6px',
            textTransform: 'uppercase', textAlign: 'right', marginBottom: 6,
          }}>
            Year
          </div>
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 12.5,
            color: 'rgba(245,237,228,0.55)', textAlign: 'right',
            letterSpacing: '1px',
          }}>
            {art.year}
          </div>
        </div>

        {/* LOCATION BLOCK */}
        <div 
          className="parallax-layer parallax-location"
          style={{
            width: '100%',
            maxWidth: 260,
            border: 'none',
            borderRadius: 10,
            padding: '10px 10px 8px',
            background: 'rgba(200,149,108,0.015)',
          }}
        >
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 9.5,
            color: 'rgba(200,149,108,0.42)', letterSpacing: '1.6px',
            textTransform: 'uppercase', textAlign: 'right', marginBottom: 6,
          }}>
            Location
          </div>
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 12.5,
            color: 'rgba(231,201,170,0.72)', textAlign: 'right', marginBottom: 2,
          }}>{art.museum}</div>
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 12,
            color: 'rgba(245,237,228,0.55)', textAlign: 'right',
          }}>{art.city}</div>
        </div>
      </div>

      {/* CENTER: PAINTING */}
      <div style={{
        gridColumn: '2', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '64px 0 120px',
        position: 'relative',
        minWidth: 0,
      }}>
        <div 
          className="parallax-layer parallax-glow"
          style={{
            position: 'absolute', inset: '10% 5%',
            background: 'radial-gradient(ellipse at center, rgba(200,149,108,0.06) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} 
        />

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
            crossOrigin="anonymous"
            onLoad={() => { imgLoadedRef.current = true; setImgLoaded(true); setImgError(false); }}
            onError={(e) => { 
                if (!imgLoadedRef.current) setImgError(true); 
            }}
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
      </div>

      {/* RIGHT: DETAILS + AI */}
      <div style={{
        gridColumn: '3', gridRow: '1',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'flex-start',
        padding: '0 24px 120px 30px',
        animation: visible ? 'riseIn 0.7s ease 0.35s both' : 'none',
        minWidth: 0,
      }}>
        <div 
          className="parallax-layer parallax-about"
          style={{
            width: '100%', maxWidth: 360,
            border: '1px solid rgba(200,149,108,0.07)',
            borderRadius: 12, padding: '15px 16px',
            background: 'rgba(200,149,108,0.015)',
            marginBottom: 14,
          }}
        >
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 9.5,
            color: 'rgba(200,149,108,0.42)', textTransform: 'uppercase',
            letterSpacing: '1.8px', marginBottom: 8,
          }}>About this work</div>
          <div
            style={{
              fontFamily: FONTS_SANS, fontSize: 12.5, lineHeight: 1.75,
              color: 'rgba(245,237,228,0.65)',
            }}
          >
            {art.desc}
          </div>
        </div>

        <div 
          className="parallax-layer parallax-whisper"
          style={{
            width: '100%', maxWidth: 360,
            border: 'none',
            borderRadius: 12, padding: '14px 16px',
            background: 'rgba(200,149,108,0.015)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: isFetching ? '#D4A54A' : (aiWhisper ? '#7BAF5E' : 'rgba(226,189,148,0.5)'),
              animation: isFetching ? 'pulse 1s infinite' : 'none',
              boxShadow: isFetching ? '0 0 8px #D4A54A' : 'none',
            }} />
            <span style={{
              fontFamily: FONTS_SANS, fontSize: 9, color: 'rgba(226,189,148,0.42)',
              letterSpacing: '1.6px', textTransform: 'uppercase',
            }}>
              {isFetching ? 'Channeling…' : "Artist's Whisper"}
            </span>
          </div>
          <div style={{
            fontFamily: FONTS, fontSize: 15.5, lineHeight: 1.8,
            fontStyle: 'italic', 
            color: 'rgba(232,213,191,0.65)', 
            minHeight: 44,
          }}>
            {isFetching ? (
              <span style={{ color: 'rgba(245,237,228,0.3)', fontStyle: 'normal', fontSize: 13 }}>
                Reaching across centuries<LoadingDots />
              </span>
            ) : displayed ? (
              <span>&ldquo;{displayed}{done ? '\u201D' : ''}</span>
            ) : (
              <span style={{ color: 'rgba(245,237,228,0.28)', fontStyle: 'normal', fontSize: 12.5 }}>
                Ask a question below and the artist will answer.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM INPUT BAR */}
      <div style={{
        gridColumn: '1 / 4',
        gridRow: '2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px 26px',
        zIndex: 5,
      }}>
        <div style={{
          width: 'min(760px, 90vw)',
          display: 'flex',
          gap: 8,
          border: 'none',
          background: 'rgba(16,13,9,0.45)',
          borderRadius: 12,
          padding: 7,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}>
          <input
            className="ask-input"
            value={userQ}
            onChange={e => setUserQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isFetching && userQ.trim() && onAsk()}
            placeholder={`Ask ${art.artist.split(' ').pop()} anything about this work...`}
            style={{
              flex: 1,
              padding: '9px 12px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(200,149,108,0.1)',
              borderRadius: 9,
              color: 'rgba(245,237,228,0.84)',
              fontFamily: FONTS_SANS,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={onAsk}
            disabled={isFetching || !userQ.trim()}
            style={{
              padding: '0 16px',
              border: 'none',
              borderRadius: 9,
              background: (!userQ.trim() || isFetching)
                ? 'rgba(200,149,108,0.13)'
                : 'linear-gradient(135deg, #C8956C, #D4A54A)',
              color: (!userQ.trim() || isFetching) ? 'rgba(200,149,108,0.35)' : '#1A1510',
              fontFamily: FONTS_SANS,
              fontWeight: 700,
              fontSize: 12,
              cursor: isFetching ? 'wait' : (!userQ.trim() ? 'default' : 'pointer'),
            }}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
