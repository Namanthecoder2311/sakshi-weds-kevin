import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spinSpeed: number;
  color: string;
  type: 'rose' | 'marigold' | 'sparkle';
  opacity: number;
}

export const PetalParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = window.innerWidth < 768 ? 22 : 45;
    const colors = {
      rose: ['#e11d48', '#be123c', '#fda4af', '#f43f5e'],
      marigold: ['#f59e0b', '#fbbf24', '#d97706', '#fcd34d'],
      sparkle: ['#ffd700', '#fef08a', '#ffffff']
    };

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const type: 'rose' | 'marigold' | 'sparkle' = 
        typeRand < 0.5 ? 'rose' : typeRand < 0.85 ? 'marigold' : 'sparkle';
      
      const palette = colors[type];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'sparkle' ? Math.random() * 3 + 1 : Math.random() * 8 + 6,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.03,
        color: palette[Math.floor(Math.random() * palette.length)],
        type,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      if (p.type === 'sparkle') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Petal shape using bezier curves
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.5, p.size * 0.5, p.size * 0.5);
        ctx.quadraticCurveTo(0, p.size, -p.size * 0.5, p.size * 0.5);
        ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.5, 0, -p.size);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.4 + p.speedX;
        p.angle += p.spinSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};
