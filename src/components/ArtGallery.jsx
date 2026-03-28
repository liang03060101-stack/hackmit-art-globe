import React, { useState } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';

export default function ArtGallery({ artData, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
      background: 'linear-gradient(transparent, rgba(20,17,12,0.88) 35%)',
      padding: '36px 0 14px',
    }}>
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        justifyContent: 'center',
      }}>
        {artData.map(art => {
          const isActive = selectedId === art.id;
          const isHover = hovered === art.id;
          return (
            <button
              key={art.id}
              onClick={() => onSelect(art)}
              onMouseEnter={() => setHovered(art.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flexShrink: 0, width: 116, padding: 0,
                background: isActive ? THEME.bgCard : 'rgba(30, 26, 20, 0.6)',
                border: isActive
                  ? `1.5px solid ${THEME.accent}`
                  : `1px solid ${isHover ? THEME.borderLight : THEME.border}`,
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: isActive ? 'translateY(-4px)' : (isHover ? 'translateY(-2px)' : 'none'),
                opacity: selectedId && !isActive ? 0.45 : 1,
                textAlign: 'left',
              }}
            >
              <div style={{
                width: '100%', height: 68, overflow: 'hidden',
                borderBottom: `1px solid ${THEME.border}`,
              }}>
                <img src={art.img} alt={art.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.4s',
                  transform: isHover ? 'scale(1.08)' : 'scale(1)',
                }} />
              </div>
              <div style={{ padding: '5px 8px 6px' }}>
                <div style={{
                  fontFamily: FONTS, fontSize: 11, fontWeight: 600,
                  color: isActive ? THEME.textMain : THEME.textWarm,
                  lineHeight: 1.2, marginBottom: 1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.title}</div>
                <div style={{
                  fontFamily: FONTS_SANS, fontSize: 9, color: THEME.textSec,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{art.artist}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
