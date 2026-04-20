"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';

// --- Component กระดานวาดรูป ---
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; 

    // ตั้งค่าขนาดและ Scale
    const displayWidth = window.innerWidth * 0.8;
    const displayHeight = window.innerHeight * 0.6;
    
    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // สำคัญ: เทพื้นหลังสีขาวตอนเริ่มต้น เพื่อให้เวลา Export รูปไม่โปร่งใส
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
  }, []);

  // Effect สำหรับอัปเดตคุณสมบัติของ Context ตามเครื่องมือที่เลือก
  useEffect(() => {
    if (!contextRef.current) return;
    const ctx = contextRef.current;
    
    ctx.lineWidth = brushSize;
    if (tool === 'eraser') {
      // โหมดยางลบ: ลบสิ่งที่วาดออก (กลายเป็นโปร่งใส หรือเจาะทะลุไปถึงพื้นหลัง)
      // แต่เนื่องจากเราต้องการให้พื้นหลังเป็นสีขาว จึงใช้การวาดทับด้วยสีขาวแทน
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'white';
    } else if (tool === 'pen') {
      // โหมดปากกาปกติ
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
  }, [color, brushSize, tool]);

  // --- ระบบถังสี (Flood Fill Algorithm) ---
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    // ต้องคูณ 2 เพราะเราใช้ context.scale(2, 2)
    const x = Math.floor(startX * 2);
    const y = Math.floor(startY * 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // แปลงรหัสสี Hex (เช่น #000000) เป็น RGBA
    const r = parseInt(fillColor.slice(1, 3), 16);
    const g = parseInt(fillColor.slice(3, 5), 16);
    const b = parseInt(fillColor.slice(5, 7), 16);

    const targetColor = getPixel(data, x, y, canvas.width);
    
    // ถ้าสีตรงกับสีที่จะเทอยู่แล้ว ไม่ต้องทำอะไร
    if (colorMatch(targetColor, [r, g, b, 255])) return;

    // ใช้ Stack (Iterative) แทน Recursion เพื่อป้องกัน Call Stack Exceeded
    const pixelsToCheck = [[x, y]];
    while (pixelsToCheck.length > 0) {
      const [curX, curY] = pixelsToCheck.pop()!;
      const currentColor = getPixel(data, curX, curY, canvas.width);

      if (colorMatch(currentColor, targetColor)) {
        setPixel(data, curX, curY, canvas.width, [r, g, b, 255]);
        // ดันพิกเซลรอบข้างลง Stack
        if (curX + 1 < canvas.width) pixelsToCheck.push([curX + 1, curY]);
        if (curX - 1 >= 0) pixelsToCheck.push([curX - 1, curY]);
        if (curY + 1 < canvas.height) pixelsToCheck.push([curX, curY + 1]);
        if (curY - 1 >= 0) pixelsToCheck.push([curX, curY - 1]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  // Helper functions สำหรับถังสี
  const getPixel = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i+1], data[i+2], data[i+3]];
  };

  const setPixel = (data: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const i = (y * width + x) * 4;
    data[i] = color[0]; data[i+1] = color[1]; data[i+2] = color[2]; data[i+3] = color[3];
  };

  const colorMatch = (c1: number[], c2: number[]) => {
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
  };

  // --- จัดการ Event เมาส์ ---
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (tool === 'fill') {
      floodFill(offsetX, offsetY, color);
    } else {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || tool === 'fill') return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  // --- ล้างกระดานและดาวน์โหลด ---
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // แปลง Canvas เป็น Data URL รูปแบบ PNG
    const dataUrl = canvas.toDataURL('image/png');
    
    // สร้างลิงก์ชั่วคราวเพื่อสั่งดาวน์โหลด
    const link = document.createElement('a');
    link.download = 'my-masterpiece.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      
      {/* แถบเครื่องมือ (Toolbox) */}
      <div style={{ 
        display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px', 
        padding: '10px 20px', backgroundColor: 'white', borderRadius: '10px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexWrap: 'wrap', justifyContent: 'center'
      }}>
        
        {/* เลือกสี */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>สี:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={tool === 'eraser'}
            style={{ cursor: tool === 'eraser' ? 'not-allowed' : 'pointer', width: '35px', height: '35px', border: 'none' }}
          />
        </div>

        {/* ปรับขนาดแปรง */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>ขนาด: {brushSize}</label>
          <input 
            type="range" min="1" max="50" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* ปุ่มเลือกเครื่องมือ */}
        <div style={{ display: 'flex', gap: '5px', borderLeft: '2px solid #eee', paddingLeft: '20px' }}>
          <button onClick={() => setTool('pen')} style={getToolButtonStyle(tool === 'pen')}>
            🖌️ ปากกา
          </button>
          <button onClick={() => setTool('eraser')} style={getToolButtonStyle(tool === 'eraser')}>
            🧽 ยางลบ
          </button>
          <button onClick={() => setTool('fill')} style={getToolButtonStyle(tool === 'fill')}>
            🪣 ถังสี
          </button>
        </div>

        {/* ปุ่มจัดการระบบ */}
        <div style={{ display: 'flex', gap: '10px', borderLeft: '2px solid #eee', paddingLeft: '20px' }}>
          <button onClick={clearCanvas} style={getActionButtonStyle('#ff4d4f')}>
            🗑️ ลบกระดาน
          </button>
          <button onClick={exportImage} style={getActionButtonStyle('#52c41a')}>
            💾 บันทึกรูป
          </button>
        </div>
      </div>

      {/* กระดานวาดรูป */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        style={{ 
          border: '2px solid #ddd', 
          borderRadius: '10px', 
          backgroundColor: '#ffffff', 
          cursor: tool === 'fill' ? 'cell' : 'crosshair',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          maxWidth: '90vw'
        }}
      />
    </div>
  );
};

// --- Styles Helpers ---
const getToolButtonStyle = (isActive: boolean) => ({
  padding: '8px 15px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#1890ff' : '#f0f0f0',
  color: isActive ? 'white' : '#333',
  border: '1px solid #d9d9d9',
  borderRadius: '5px',
  fontWeight: 'bold' as const,
  transition: 'all 0.2s ease'
});

const getActionButtonStyle = (bgColor: string) => ({
  padding: '8px 15px',
  cursor: 'pointer',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold' as const,
  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
});

// --- Main App ---
export default function App() {
  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '40px' }}>
      <h1 style={{ textAlign: 'center', paddingTop: '30px', margin: '0', color: '#333' }}>
        React Drawing Studio 🎨
      </h1>
      <p style={{ textAlign: 'center', color: '#777', marginTop: '5px' }}>
        วาด ลบ เทสี และบันทึกผลงานของคุณได้เลย!
      </p>
      
      <DrawingCanvas />
    </div>
  );
}