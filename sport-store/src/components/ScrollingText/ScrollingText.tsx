'use client';

import { useEffect, useRef } from 'react';

const ScrollingText = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: import('pixi.js').Application | null = null;
    let text: import('pixi.js').Text | null = null;
    const container = canvasRef.current;

    const runPixi = async () => {
      const PIXI = await import('pixi.js');
      const { GlowFilter } = await import('@pixi/filter-glow');
      if (!container) return;

      app = new PIXI.Application();
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
      });

      container.appendChild(app.canvas as HTMLCanvasElement);

      // Tạo hiệu ứng glow (phát sáng)
      const glowFilter = new GlowFilter({
        distance: 20,
        outerStrength: 4,
        innerStrength: 1,
        color: 0xffff00, // Màu vàng nổi bật
        quality: 0.5,
      });

      // Tạo text với font đậm, gần giống GTA
      text = new PIXI.Text('Grand Theft Auto', {
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: 80,
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 8,
        align: 'center',
      } as Partial<import('pixi.js').TextStyle>);

      text.filters = [glowFilter] as unknown as import('pixi.js').Filter[];
      text.y = window.innerHeight / 2 - text.height / 2;
      text.x = window.innerWidth;
      app.stage.addChild(text);

      app.ticker.add(() => {
        if (!text) return;
        // Giữ chữ luôn ở giữa màn hình
        text.x = window.innerWidth / 2 - text.width / 2;
        text.y = window.innerHeight / 2 - text.height / 2;
      });
    };

    runPixi();

    // Hiệu ứng zoom và mờ dần khi scroll
    const handleScroll = () => {
      if (!text) return;
      // Tính phần trăm scroll (0 ở top, 1 ở cuối trang)
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const percent = Math.min(scrollY / (maxScroll || 1), 1);
      // Scale từ 1 đến 2.5, alpha từ 1 đến 0
      text.scale.set(1 + percent * 1.5);
      text.alpha = 1 - percent;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (app) {
        app.destroy(true, true);
      }
      if (container) container.innerHTML = '';
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100vh',
        background: 'black',
        overflow: 'hidden',
      }}
    />
  );
};

export default ScrollingText;