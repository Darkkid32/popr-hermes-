import { useRef, useEffect } from 'react';
import { Card } from '../ui/Card';

interface GaugeCardProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  thresholds?: { warning: number; critical: number };
  size?: number;
}

export function GaugeCard({ label, value, min = 0, max = 100, unit = '%', thresholds = { warning: 70, critical: 90 }, size = 140 }: GaugeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas 2D context not available (likely in test environment)');
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const s = size * dpr;
    canvas.width = s;
    canvas.height = s;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const radius = center - 10;
    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;
    const totalAngle = endAngle - startAngle;
    const progress = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const currentAngle = startAngle + totalAngle * progress;

    // Background arc
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = 'var(--color-surface-tertiary)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress arc
    const progressColor = value >= thresholds.critical 
      ? 'var(--color-status-error)' 
      : value >= thresholds.warning 
        ? 'var(--color-status-warning)' 
        : 'var(--color-status-success)';
    
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, currentAngle);
    ctx.strokeStyle = progressColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = 'var(--color-text-primary)';
    ctx.font = `bold ${size * 0.18}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}${unit}`, center, center - 4);

    ctx.fillStyle = 'var(--color-text-tertiary)';
    ctx.font = `${size * 0.07}px system-ui, sans-serif`;
    ctx.fillText(label, center, center + size * 0.15);
  }, [value, min, max, unit, thresholds, size, label]);

  return (
    <Card className="p-5 flex flex-col items-center">
      <canvas ref={canvasRef} width={size} height={size} aria-label={`${label}: ${value}${unit}`} />
    </Card>
  );
}
