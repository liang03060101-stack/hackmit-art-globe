import React, { useState } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';

export default function ArtGallery({ artData, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
      background: 'linear-gradient(transparent, rgba(20,17,12,0.85) 30%, rgba(20,17,12,0.96))',
      padding: '28px 0 12px',
    }}>
      <div style={{
        display: 'flex', gap: 10, padding: '0 16px',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        justifyContent: 'center',
      }}>
        {artData.map(art => {
          const isSelected = selectedId === art.id;
          const isHover = hovered === art.id;
          return (
            <button key={art.id} onClick={() => onSelect(art)}
              onMouseEnter={() => setHovered(art.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flexShrink: 0, width: 144, padding: 0,
                background: isSelected ? THEME.bgCard : 'rgba(30, 26, 20, 0.7)',
                border: isSelected ? `2px solid ${THEME.accent}` : `1px solid ${isHover ? THEME.borderLight : THEME.border}`,
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                transform: isSelected ? 'translateY(-6px) scale(1.03)' : (isHover ? 'translateY(-3px)' : 'translateY(0)'),
                boxShadow: isSelected
                  ? `0 6px 24px rgba(200,149,108,0.3), inset 0 0 0 1px ${THEME.accentDim}`
                  : (isHover ? '0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'),
                opacity: selectedId && !isSelected ? 0.55 : 1, textAlign: 'left',
              }}
            >
              <div style={{
                width: '100%', height: 84, overflow: 'hidden',
                borderBottom: `1px solid ${THEME.border}`, position: 'relative',
              }}>
                <img src={art.img} alt={art.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.4s', transform: isHover ? 'scale(1.08)' : 'scale(1)',
                }} />
                {isSelected && <div style={{
                  position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%',
                  background: THEME.accentGold, boxShadow: `0 0 8px ${THEME.accentGold}`,
                }} />}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{
                  fontFamily: FONTS, fontSize: 12.5, fontWeight: 600,
                  color: isSelected ? THEME.textMain : THEME.textWarm,
                  lineHeight: 1.25, marginBottom: 3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.title}</div>
                <div style={{
                  fontFamily: FONTS_SANS, fontSize: 10, color: THEME.textSec,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.artist} · {art.city}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}