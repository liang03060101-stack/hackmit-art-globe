import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { THEME, FONTS, FONTS_SANS } from '../data/constants';

export default function ArtGallery({ artData, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);
  const [viewState, setViewState] = useState('palette'); // 'palette' (收纳) 或 'carousel' (展开)
  const scrollRef = useRef(null);
  const paletteRef = useRef(null); // 左下角调色板锚点
  const itemRefs = useRef({}); // 存储每个 item 的 DOM 节点以计算动画
  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft);
  };

  const isPalette = viewState === 'palette';

  // --- FLIP 动画核心逻辑 ---
  useLayoutEffect(() => {
    if (!paletteRef.current || Object.keys(itemRefs.current).length === 0) return;

    // 获取“起飞/降落”点的位置
    const anchorRect = paletteRef.current.getBoundingClientRect();
    const anchorCenter = {
      x: anchorRect.left + anchorRect.width / 2,
      y: anchorRect.top + anchorRect.height / 2
    };

    artData.forEach((art) => {
      const el = itemRefs.current[art.id];
      if (!el) return;

      // 获取当前（Last）在轮盘中的位置
      const rect = el.getBoundingClientRect();
      const currentCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      // 计算与锚点的位移差 (Invert)
      const dx = anchorCenter.x - currentCenter.x;
      const dy = anchorCenter.y - currentCenter.y;

      if (isPalette) {
        // 关闭动画：从当前位置飞回角落并消失
        el.style.transition = 'none';
        el.style.transform = 'translate(0, 0) scale(1)';
        el.style.opacity = '1';

        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease-in';
          el.style.transform = `translate(${dx}px, ${dy}px) scale(0.3) rotate(-15deg)`;
          el.style.opacity = '0';
        });
      } else {
        // 展开动画：从角落飞向轮盘预定位置
        el.style.transition = 'none';
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
        el.style.opacity = '0';

        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.9s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.7s ease-out';
          el.style.transform = 'translate(0, 0) scale(1)';
          el.style.opacity = '1';
        });
      }
    });
  }, [viewState, artData]);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
      background: `linear-gradient(transparent, rgba(12,10,7,${isPalette ? 0 : 0.96}) 45%)`,
      padding: isPalette ? '0' : '50px 0 30px',
      overflow: isPalette ? 'visible' : 'hidden',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      
      {/* 1. 左下角：调色板收集器 (Collector) */}
      <div 
        ref={paletteRef}
        onClick={() => !isPalette && setViewState('palette')}
        onMouseEnter={() => !isPalette && setHovered('collector')}
        onMouseLeave={() => setHovered(null)}
        style={{
          position: 'absolute', bottom: 30, left: 30,
          width: 140, height: 100,
          borderRadius: 12,
          cursor: isPalette ? 'default' : 'pointer',
          // 优化点：在轮盘滚动时将收集器放在最高层级，避免被画作遮挡
          zIndex: isPalette ? 30 : 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isPalette ? 'transparent' : 'rgba(200, 149, 108, 0.05)',
          border: `1px solid ${isPalette ? 'transparent' : 'rgba(200, 149, 108, 0.2)'}`,
          backdropFilter: !isPalette && hovered === 'collector' ? 'blur(10px)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {!isPalette && (
          <div style={{
            fontFamily: FONTS_SANS, fontSize: 9, color: THEME.accent,
            textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
            opacity: hovered === 'collector' ? 1 : 0.6,
            textAlign: 'center'
          }}>
            ← Collect Works
          </div>
        )}
      </div>

      {/* 2. 调色板预览模式 (Palette View) */}
      {isPalette && (
        <button 
          onClick={() => setViewState('carousel')}
          onMouseEnter={() => setHovered('trigger')}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: 'absolute', bottom: 30, left: 30,
            width: 140, height: 100,
            background: 'transparent', border: 'none',
            cursor: 'pointer', zIndex: 35, // 确保在锚点之上
          }}
        >
          {artData.slice(0, 5).map((art, idx) => {
            const seed = idx * 23;
            const size = 64 + (seed % 16);
            const rotate = (seed % 30) - 15;
            return (
              <div key={`pal_${art.id}`} style={{
                position: 'absolute', width: size, height: size,
                bottom: `calc(50% + ${(seed % 20) - 10}px)`, 
                left: `calc(50% + ${(seed % 30) - 15}px)`,
                transform: `translate(-50%, 50%) rotate(${rotate}deg) ${hovered === 'trigger' ? 'scale(1.1) translateY(-5px)' : ''}`,
                borderRadius: 8, overflow: 'hidden',
                border: `1.5px solid ${THEME.border}`,
                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                zIndex: 10 - idx,
              }}>
                <img src={art.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })}
        </button>
      )}

      {/* 3. 轮盘展示模式 (Carousel View) */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex', gap: 28, 
          padding: '0 42vw',
          overflowX: isPalette ? 'hidden' : 'auto', 
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          alignItems: 'center',
          scrollSnapType: 'x proximity',
          visibility: isPalette ? 'hidden' : 'visible', 
          // 展开时的渐变动画
          opacity: isPalette ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        {artData.map(art => (
          <GalleryItem
            key={art.id}
            art={art}
            isActive={selectedId === art.id}
            isHovered={hovered === art.id}
            onSelect={() => onSelect(art)}
            onHover={setHovered}
            containerRef={scrollRef}
            scrollPos={scrollPos}
            viewState={viewState}
            // 绑定 Ref 以便父组件 FLIP 计算
            setRef={(el) => itemRefs.current[art.id] = el}
          />
        ))}
      </div>

      {/* 4. 版本号标注 */}
      <div style={{
        position: 'absolute', bottom: 12, right: 20,
        fontFamily: FONTS_SANS, fontSize: 8, color: THEME.accentDim,
        opacity: 0.35, letterSpacing: '0.8px', pointerEvents: 'none'
      }}>
        VERSION 1.0
      </div>
    </div>
  );
}

function GalleryItem({ art, isActive, isHovered, onSelect, onHover, containerRef, scrollPos, viewState, setRef }) {
  const itemRef = useRef(null);
  const [rotaryStyle, setRotaryStyle] = useState({ scale: 0.85, opacity: 0.5, ty: 0 });

  useEffect(() => {
    // 轮盘视差逻辑仅在展开模式下激活
    if (!itemRef.current || !containerRef.current || viewState === 'palette') return;

    const update = () => {
      const cRect = containerRef.current.getBoundingClientRect();
      const iRect = itemRef.current.getBoundingClientRect();
      const cCenter = cRect.left + cRect.width / 2;
      const iCenter = iRect.left + iRect.width / 2;
      const dist = Math.abs(cCenter - iCenter);
      const threshold = cRect.width / 2;
      const progress = Math.min(dist / threshold, 1);

      // 轮盘logic: 1.18 center, 0.8 periphery
      const scale = 1.18 - (progress * 0.38);
      const opacity = 1 - (progress * 0.7);
      const translateY = progress * 12; // 稍微向下弯曲增加深度感

      setRotaryStyle({
        scale: 1.18 - (progress * 0.38),
        opacity: 1 - (progress * 0.7),
        ty: progress * 12
      });
    };
    update();
  }, [scrollPos, viewState]);

  return (
    <button
      ref={(el) => { itemRef.current = el; setRef(el); }}
      onClick={onSelect}
      onMouseEnter={() => onHover(art.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        flexShrink: 0, width: 140, padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer',
        outline: 'none',
        // 注意：外层 transform 由父组件 FLIP 控制，这里控制内部视差
      }}
    >
      <div style={{
        width: '100%', height: 90, borderRadius: 10, overflow: 'hidden',
        border: isActive ? `2.5px solid ${THEME.accentGold}` : `1px solid ${isHovered ? THEME.borderLight : 'rgba(200,149,108,0.2)'}`,
        boxShadow: isActive ? `0 0 25px ${THEME.accent}55` : '0 10px 30px rgba(0,0,0,0.4)',
        background: '#15120F',
        transform: viewState === 'carousel' 
          ? `scale(${rotaryStyle.scale}) translateY(${rotaryStyle.ty}px)` 
          : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s',
      }}>
        <img src={art.img} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.5s',
        }} />
      </div>

      {/* 元数据标签：现在在轮盘模式下始终可见 */}
      <div style={{ 
        marginTop: 15, textAlign: 'center',
        // 优化点：在轮盘模式下始终可见，但根据距离动态调整文本亮度
        opacity: viewState === 'carousel' 
          ? Math.max(0.35, 1 - Math.abs(rotaryStyle.scale - 1.18) * 2.5) // 中心100%亮度，最边缘保持35%亮度确保可读
          : 0,
        transition: 'opacity 0.2s ease', // 亮度过渡更顺滑
        pointerEvents: 'none'
      }}>
        <div style={{ fontFamily: FONTS, fontSize: 11.5, color: THEME.textMain, marginBottom: 2 }}>{art.title}</div>
        <div style={{ fontFamily: FONTS_SANS, fontSize: 9, color: THEME.accent, textTransform: 'uppercase' }}>{art.artist}</div>
      </div>
    </button>
  );
}
