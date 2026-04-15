import { IGameState } from './constants';

export class Explosion {
  x: number; y: number; timer: number; radius: number;
  constructor(x: number, y: number) { this.x = x; this.y = y; this.timer = 0; this.radius = 0; }
  update() { this.timer++; this.radius += 8; }
  draw(state: IGameState) {
    const { ctx } = state;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - this.timer / 20);
    ctx.fillStyle = '#ff4500'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffff00'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export class SunDrop {
  x: number; y: number; radius: number; value: number; lifeTimer: number;
  constructor(x: number, y: number) { this.x = x; this.y = y; this.radius = 18; this.value = 25; this.lifeTimer = 0; }
  update() { this.lifeTimer++; }
  draw(state: IGameState) {
    const { ctx, frame } = state;
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(frame * 0.02);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.5)'; ctx.beginPath(); ctx.arc(0, 0, this.radius + 5 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffdf00'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffa500'; ctx.beginPath(); ctx.arc(0, 0, this.radius - 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export class Projectile {
  x: number; y: number; width: number; height: number;
  type: number; speed: number; power: number;
  hitEnemies: any[];

  // 1. เพิ่ม damageMult: number = 1 เข้ามาเป็นตัวที่ 4
  constructor(x: number, y: number, type: number, damageMult: number = 1) { 
    this.x = x; this.y = y; this.type = type;
    this.width = 10; this.height = 10;
    this.hitEnemies = [];
    
    // ตั้งค่าความเร็วและดาเมจพื้นฐาน (อ้างอิงตามที่คุณมีอยู่เดิม)
    if (this.type === 1) { this.speed = 7; this.power = 20; }
    else if (this.type === 2) { this.speed = 10; this.power = 40; }
    else if (this.type === 3) { this.speed = 5; this.power = 20; }
    else if (this.type === 4) { this.speed = 12; this.power = 100; }
    else if (this.type === 5) { this.speed = 6; this.power = 15; } // กระสุนน้ำแข็ง
    else { this.speed = 5; this.power = 20; }
    
    // 2. นำดาเมจที่ได้มาคูณกับตัวคูณบัพ (ถ้าไม่มีบัพ damageMult จะเป็น 1)
    this.power *= damageMult;
  }
  
  update() { this.x += this.speed; }
  
  draw(state: IGameState) {
    const { ctx } = state;
    ctx.save();
    if (this.type === 0) {
      ctx.fillStyle = '#a1ff8a'; ctx.beginPath(); ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#228b22'; ctx.stroke();
    } else if (this.type === 1) { 
      ctx.fillStyle = 'rgba(255,0,0,0.8)';
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 20); ctx.lineTo(this.x + 10, this.y); ctx.lineTo(this.x, this.y + 20); ctx.lineTo(this.x - 5, this.y); ctx.fill();
    } else if (this.type === 2) { 
      ctx.fillStyle = '#ff0000'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff0000';
      ctx.beginPath(); ctx.arc(this.x, this.y, 10, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    } else if (this.type === 3) { 
      ctx.fillStyle = '#0000ff'; ctx.shadowBlur = 10; ctx.shadowColor = '#0000ff';
      ctx.beginPath(); ctx.arc(this.x, this.y, 10, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#87ceeb'; ctx.beginPath(); ctx.arc(this.x, this.y, 4, 0, Math.PI*2); ctx.fill();
    } else if (this.type === 4) { 
      ctx.fillStyle = '#8a2be2'; ctx.shadowBlur = 30; ctx.shadowColor = '#8a2be2';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.width/2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(this.x + 10, this.y - 10, 10, 0, Math.PI*2); ctx.fill();
    }
    else if (this.type === 5) { //กระสุนน้ำแข็ง โว้ยยยยย
      ctx.fillStyle = '#00ffff'; // เปลี่ยนเป็นสีฟ้า Cyan ให้สว่างขึ้น
      ctx.shadowBlur = 15; 
      ctx.shadowColor = '#00ffff';
      ctx.beginPath(); 
      ctx.arc(this.x, this.y, this.width / 2 + 4, 0, Math.PI * 2); // เพิ่มขนาดกระสุนให้เห็นชัดขึ้น
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; // ใส่ขอบสีขาว
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
}