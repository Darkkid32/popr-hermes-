import { useRef, useEffect } from 'react';
import { Card } from '../ui/Card';

interface TimeSeriesChartProps {
  title: string;
  points: { timestamp: string; value: number }[];
  color?: string;
  unit?: string;
  height?: number;
  showMinMax?: boolean;
}

export function TimeSeriesChart({ title, points, color = 'var(--color-brand-500)', unit, height = 200, showMinMax = true }: TimeSeriesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (height * dpr);
    ctx.scale(dpr, dpr);

    const values = points.map(p => p.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const w = rect.width;
    const h = height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Gradient area
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'color-mix(in oklab, ' + color + ' 20%, transparent)');
    gradient.addColorStop(1, 'transparent');

    // Path
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p.value - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    // Area fill
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p.value - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Min/Max markers
    if (showMinMax && points.length > 1) {
      const minIdx = values.indexOf(min);
      const maxIdx = values.indexOf(max);
      
      [minIdx, maxIdx].forEach(idx => {
        const x = (idx / (points.length - 1)) * w;
        const y = h - ((values[idx] - min) / range) * h;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }
  }, [points, color, height, unit, showMinMax]);

  return (
    <Card className="p-5">
      <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">
        {title}
      </h4>
      <canvas ref={canvasRef} width="400" height={height} className="w-full" aria-label={title} />
      {showMinMax && points.length > 0 && (
        <div className="flex items-center justify-between mt-3 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
          <span>Min: {Math.min(...points.map(p => p.value)).toLocaleString()}{unit ? ' ' + unit : ''}</span>
          <span>Max: {Math.max(...points.map(p => p.value)).toLocaleString()}{unit ? ' ' + unit : ''}</span>
        </div>
      )}
    </Card>
  );
}
