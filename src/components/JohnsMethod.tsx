import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export const JohnsMethod: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [homeTeamLines, setHomeTeamLines] = useState(0);
  const [awayTeamLines, setAwayTeamLines] = useState(0);
  const { homeTeam, awayTeam } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        redrawCanvas(ctx, rect.width, rect.height);
      }
      setContext(ctx);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const redrawCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#1e40af20';
    ctx.fillRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    const rowHeight = height / 5;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, rowHeight * i);
      ctx.lineTo(width, rowHeight * i);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellWidth = rect.width / 2;
    const cellHeight = rect.height / 5;
    const columnIndex = Math.floor(x / cellWidth);
    const rowIndex = Math.floor(y / cellHeight);
    
    const cellStartY = rowIndex * cellHeight;
    const cellEndY = (rowIndex + 1) * cellHeight;

    context.beginPath();
    context.moveTo(x, cellStartY);
    context.lineTo(x, cellEndY);
    context.stroke();

    if (columnIndex === 0) {
      setHomeTeamLines(prev => prev + 1);
    } else {
      setAwayTeamLines(prev => prev + 1);
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    redrawCanvas(context, rect.width, rect.height);
    setHomeTeamLines(0);
    setAwayTeamLines(0);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="glass-effect rounded-xl shadow-lg p-6 bg-black/90">
          <div className="mb-8 text-center">
            <div className="flex justify-between items-center px-8">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-orange-400">{homeTeam.name}</div>
                <div className="text-3xl font-bold text-white">{homeTeamLines}</div>
              </div>
              <div className="text-2xl font-bold text-white">vs</div>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-orange-400">{awayTeam.name}</div>
                <div className="text-3xl font-bold text-white">{awayTeamLines}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg hover-lift transition-all"
            >
              Back
            </button>
            <button
              onClick={clearCanvas}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg hover-lift transition-all"
            >
              Clear Drawing
            </button>
          </div>

          <div className="relative w-full border-2 border-blue-900/30 rounded-lg overflow-hidden" 
               style={{ height: 'calc(100vh - 300px)' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};