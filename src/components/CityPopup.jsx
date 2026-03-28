import React from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';

export default function CityPopup({ art, onClose }) {
  if (!art?.cityInfo) return null;
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-80%, -60%)',
      zIndex: 18, width: 280,
      background: THEME.bgPanel,
      backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      border: `1px solid ${THEME.borderLight}`,
      borderRadius: 16, padding: '18px 20px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
      animation: 'popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          fontFamily: FONTS, fontSize: 18, fontWeight: 600, color: THEME.accentLight,
        }}>📍 {art.city}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accent,
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600,
        }}>Museums</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {art.cityInfo.museums.map((m, i) => (
            <span key={i} style={{
              fontFamily: FONTS_SANS, fontSize: 11, color: THEME.textWarm,
              background: 'rgba(200,149,108,0.1)', border: `1px solid ${THEME.border}`,
              borderRadius: 6, padding: '3px 8px',
            }}>{m}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONTS_SANS, fontSize: 10, color: THEME.accent,
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600,
        }}>Other Masterpieces Here</div>
        {art.cityInfo.otherWorks.map((w, i) => (
          <div key={i} style={{
            fontFamily: FONTS, fontSize: 13, color: THEME.textMain,
            padding: '3px 0', fontStyle: 'italic', opacity: 0.85,
          }}>• {w}</div>
        ))}
      </div>

      <div style={{
        fontFamily: FONTS_SANS, fontSize: 11.5, color: THEME.textSec,
        lineHeight: 1.6, fontStyle: 'italic',
        borderTop: `1px solid ${THEME.border}`, paddingTop: 10,
      }}>{art.cityInfo.artFact}</div>
    </div>
  );
}