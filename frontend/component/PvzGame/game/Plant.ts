import { CELL_SIZE, CELL_GAP, TOP_BAR_HEIGHT, IGameState } from './constants';
import { Projectile, Explosion, SunDrop } from './Misc';

export class Plant {
  x: number; y: number; width: number; height: number;
  type: number; health: number; timer: number; maxHealth: number; purpleCooldown: number;
  slotStatus: 'idle' | 'spinning' | 'won' | 'lost' = 'idle';
  danceOffset: number = 0;
  
  constructor(x: number, y: number, type: number) {
    this.x = x; this.y = y; this.type = type;
    this.width = CELL_SIZE - CELL_GAP * 2; this.height = CELL_SIZE - CELL_GAP * 2;
    
    // ตั้งค่า HP เริ่มต้น
    this.health = (type >= 3 && type <= 5) ? 99999 : 100;
    
    // --- ตั้งค่าสำหรับ Cactus Tank (10) และ Train (11) ---
    if (this.type === 10) {
      this.health = 8000; // Cactus ถึกเป็นพิเศษ
    } else if (this.type === 11) {
      this.health = 500;
    }
    
    this.maxHealth = this.health;
    this.timer = 0; this.purpleCooldown = 0;
  }
  
  update(state: IGameState) {
    this.timer++;

    // --- ระบบ Jackpot Buff สำหรับพืชทุกตัว ---
    if (state.jackpotTimer > 0) {
      // 1. อัตราฟื้นฟู 100% (ฮีลตัวเอง)
      if (this.timer % 60 === 0) {
        this.health = Math.min(this.maxHealth, this.health + 10);
      }
    }

    // --- ตรรกะของ Train (Type 11) รถไฟวิ่งชน ---
    if (this.type === 11) {
      this.x += 10; // ให้รถไฟวิ่งไปข้างหน้าเรื่อยๆ
      return; // ไม่ต้องไปรันตรรกะยิงกระสุนด้านล่าง
    }

    // --- ตรรกะเฉพาะของ Hakari 888 (เปลี่ยนเป็น Type 9) ---
    if (this.type === 9) {
      if (this.slotStatus === 'idle') {
        this.slotStatus = 'spinning';
        this.timer = 0;
      }

      if (this.slotStatus === 'spinning') {
        if (this.timer >= 120) { // หมุน 2 วินาที
          if (Math.random() < 0.1) { // โอกาส 10%
            this.slotStatus = 'won';
            state.jackpotTimer = 466; // 7.77 วินาที (60fps * 7.77)
          } else {
            this.slotStatus = 'lost';
            this.health = 0; // หายไปทันทีถ้าไม่ได้ Jackpot
          }
        }
      }

      if (this.slotStatus === 'won') {
        // เต้นตอนได้ Jackpot
        this.danceOffset = Math.sin(this.timer * 0.2) * 10;
        if (state.jackpotTimer <= 0) this.health = 0; // หมดเวลาแล้วหายไป
      }
      return; // Hakari ไม่ยิงกระสุน
    }

    // --- ระบบยิง (บัพความเร็ว 50%) ---
    let shootSpeed = 100; 
    if (state.jackpotTimer > 0) shootSpeed = 50; // ยิงเร็วขึ้น (Cooldown ลดลง)

    // เช็คว่ามีบอสอยู่ในสนามหรือไม่
    const isBossAlive = state.enemies.some(e => e.type === 100 && e.isSpawned);
    // พืชจะยิงก็ต่อเมื่อ "มีศัตรูอยู่ในเลนของตัวเอง" หรือ "บอสยังมีชีวิตอยู่"
    const hasTarget = state.enemyPositions.includes(this.y) || isBossAlive;

    if (this.type === 0 && this.timer % shootSpeed === 0) {
       // ส่งบัพดาเมจ 50% ไปกับกระสุน
       const damageMult = state.jackpotTimer > 0 ? 1.5 : 1;
       if (hasTarget) {
           state.projectiles.push(new Projectile(this.x + 70, this.y + 35, 0, damageMult));
       }
    }

    // --- ตรรกะของพืชอื่นๆ ---
    if (this.type === 1) {
      if (this.timer % 400 === 0) state.sunDrops.push(new SunDrop(this.x + Math.random() * 40, this.y + Math.random() * 40));
    } else if (this.type === 2) {
      if (this.timer >= 60) {
        state.explosions.push(new Explosion(this.x + this.width/2, this.y + this.height/2));
        state.enemies.forEach(en => {
          if (Math.abs(en.x - this.x) <= CELL_SIZE * 1.5 && Math.abs(en.y - this.y) <= CELL_SIZE * 1.5) en.health -= 500;
        });
        this.health = 0;
      }
    } else if (this.type >= 3 && this.type <= 5) {
      const T_RISE = 180; const T_WAIT = 300; const T_ATTACK = 600; const T_FADE = 120;
      const T_TOTAL = T_RISE + T_WAIT + T_ATTACK + T_FADE; 
      if (this.timer >= T_TOTAL) {
        this.health = 0; 
        if (this.type === 5) state.enemies.forEach(en => { en.movement = en.speed; });
      } else if (this.timer >= T_RISE && this.timer < (T_RISE + T_WAIT + T_ATTACK)) {
        if (this.type === 3 && this.timer >= (T_RISE + T_WAIT)) { 
          state.enemies.forEach(en => {
            if (en.type === 99 && en.isAdapted) return; 
            en.health -= 0.5;
          });
        } 
        else if (this.type === 4 && this.timer === (T_RISE + T_WAIT)) { 
          state.enemies.forEach(en => {
            if (en.type === 99 && en.isAdapted) return;
            en.health -= 9999;
          });
        }
        else if (this.type === 5) { 
          state.enemies.forEach(en => {
            if (en.type === 99 && en.isAdapted) { en.movement = en.speed; return; }
            en.movement = 0; en.health -= 0.1;
          });
        }
      }
    } else if (this.type === 6) {
      if (hasTarget && this.timer % 120 === 0) state.projectiles.push(new Projectile(this.x + 70, this.y + 35, 1));
    } else if (this.type === 7) {
      if (this.purpleCooldown > 0) this.purpleCooldown--;
      if (hasTarget && this.timer % 150 === 0) {
        let isRed = Math.random() > 0.5;
        state.projectiles.push(new Projectile(this.x + 70, this.y + 35, isRed ? 2 : 3));
      }
    }
    else if (this.type === 8) {
      if (hasTarget && this.timer % 120 === 0) {
         state.projectiles.push(new Projectile(this.x + 70, this.y + 35, 5));
      }
    }
  }

  draw(state: IGameState) {
    const { ctx, canvas, mouse, selectedPlant } = state;
    const cx = this.x + this.width / 2; const cy = this.y + this.height / 2;
    const isHovered = mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;

    if (this.type === 0) {
      ctx.fillStyle = '#228b22'; ctx.fillRect(cx - 5, cy, 10, 30);
      ctx.fillStyle = '#32cd32'; ctx.beginPath(); ctx.arc(cx, cy - 10, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#006400'; ctx.fillRect(cx + 10, cy - 20, 20, 20);
    } else if (this.type === 1) {
      ctx.save(); ctx.translate(cx, cy);
      if (isHovered) ctx.scale(1.15, 1.15);
      ctx.fillStyle = '#228b22'; ctx.fillRect(-5, 0, 10, 30);
      ctx.fillStyle = isHovered ? '#ffeb73' : '#ffd700';
      for(let i=0; i<8; i++){
        ctx.beginPath(); ctx.ellipse(Math.cos(i * Math.PI/4)*15, -15 + Math.sin(i * Math.PI/4)*15, 10, 5, i * Math.PI/4, 0, Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = isHovered ? '#a0522d' : '#8b4513'; 
      ctx.beginPath(); ctx.arc(0, -15, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (this.type === 2) {
      const swell = (this.timer / 60) * 5; 
      ctx.fillStyle = '#ff2400';
      ctx.beginPath(); ctx.arc(cx - 10 - swell, cy, 15 + swell, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 10 + swell, cy, 15 + swell, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#228b22'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy - 25 - swell); ctx.lineTo(cx - 10, cy - 10 - swell); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 25 - swell); ctx.lineTo(cx + 10, cy - 10 - swell); ctx.stroke();
    } else if (this.type >= 3 && this.type <= 5) {
      ctx.save();
      const T_RISE = 180; const T_WAIT = 300; const T_ATTACK = 600; const T_FADE = 120;
      const T1 = T_RISE; const T2 = T1 + T_WAIT; const T3 = T2 + T_ATTACK; const T4 = T3 + T_FADE;
      let opacity = 1; let yPos = canvas.height / 2 + 50; let bgOpacity = 0;

      if (this.timer < T1) {
        let progress = this.timer / T1;
        opacity = progress; yPos = canvas.height + 150 - (Math.pow(progress, 2)) * (canvas.height / 2 + 100);
        bgOpacity = progress * 0.7;
      } else if (this.timer < T2) {
        bgOpacity = 0.7 + (Math.sin(this.timer * 0.05) * 0.1);
        if (this.timer % 40 < 5) bgOpacity = 0.95; 
      } else if (this.timer < T3) { bgOpacity = 0.8; } 
      else if (this.timer < T4) {
        let progress = (this.timer - T3) / T_FADE;
        opacity = 1 - progress; yPos = canvas.height / 2 + 50 + progress * (canvas.height / 2 + 100);
        bgOpacity = (1 - progress) * 0.8;
      }

      if (this.type === 3) ctx.fillStyle = `rgba(30, 0, 0, ${bgOpacity})`; 
      else if (this.type === 4) ctx.fillStyle = `rgba(20, 0, 40, ${bgOpacity})`; 
      else if (this.type === 5) ctx.fillStyle = `rgba(0, 0, 20, ${bgOpacity})`; 
      ctx.fillRect(0, TOP_BAR_HEIGHT, canvas.width, canvas.height - TOP_BAR_HEIGHT);

      ctx.globalAlpha = opacity; const scx = canvas.width / 2; const scy = yPos;

      if (this.type === 3) {
        // --- Sukuna: Malevolent Shrine ---
        ctx.save(); ctx.translate(scx, scy);
        const pulse = Math.sin(this.timer * 0.1) * 10;
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + Math.sin(this.timer * 0.2) * 0.2})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, -30, 100 + pulse, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#1a0000'; ctx.fillRect(-180, 50, 360, 40);
        ctx.fillStyle = '#000'; ctx.fillRect(-190, 80, 380, 10); 

        const skullCount = 12;
        for (let i = 0; i < skullCount; i++) {
          ctx.save();
          const sx = -160 + (i * 28) + (Math.sin(i * 45) * 10); 
          const sy = 60 + (Math.cos(i * 10) * 15);
          ctx.translate(sx, sy);
          ctx.fillStyle = '#e0e0d1'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(-4, 2, 8, 6);
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-2, 0, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(2, 0, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(-0.5, 2, 1, 1);
          ctx.strokeStyle = '#000'; ctx.lineWidth = 0.5;
          for(let j = -3; j <= 3; j+=2) { ctx.beginPath(); ctx.moveTo(j, 4); ctx.lineTo(j, 8); ctx.stroke(); }
          ctx.restore();
        }

        ctx.fillStyle = '#4a0000';
        const pillarPositions = [-120, -40, 25, 100];
        pillarPositions.forEach(posX => {
          ctx.fillRect(posX, -60, 15, 110);
          ctx.fillStyle = '#f5f5dc'; ctx.beginPath();
          ctx.arc(posX + 7.5, -20 + Math.sin(this.timer * 0.05 + posX) * 5, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#4a0000';
        });

        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.moveTo(-200, -50); ctx.quadraticCurveTo(0, -120, 200, -50);
        ctx.lineTo(160, -110); ctx.quadraticCurveTo(0, -160, -160, -110); ctx.closePath(); ctx.fill();

        const laughIntensity = Math.abs(Math.sin(this.timer * 0.25)); 
        const mouthOpen = 15 + laughIntensity * 20; 
        const mouthGlow = laughIntensity * 20;
        ctx.shadowBlur = mouthGlow; ctx.shadowColor = '#ff0000';
        ctx.fillStyle = '#110000';
        ctx.beginPath(); ctx.ellipse(0, -25, 45, mouthOpen, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = '#8b0000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(0, -25, 45, mouthOpen, 0, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = '#f5f5dc';
        for (let x = -35; x <= 35; x += 12) {
          const yOffset = -25 - mouthOpen + 2; 
          ctx.beginPath(); ctx.moveTo(x - 5, yOffset); ctx.lineTo(x + 5, yOffset); ctx.lineTo(x, yOffset + (Math.abs(x) < 20 ? 15 : 10)); ctx.fill();
        }
        for (let x = -35; x <= 35; x += 12) {
          const yOffset = -25 + mouthOpen - 2; 
          ctx.beginPath(); ctx.moveTo(x - 5, yOffset); ctx.lineTo(x + 5, yOffset); ctx.lineTo(x, yOffset - (Math.abs(x) < 20 ? 15 : 10)); ctx.fill();
        }

        if (this.timer >= (180 + 300)) { 
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
          for(let i=0; i<5; i++) {
            const rx = (Math.random() - 0.5) * 600; const ry = (Math.random() - 0.5) * 400;
            ctx.beginPath(); ctx.moveTo(rx - 50, ry - 50); ctx.lineTo(rx + 50, ry + 50); ctx.stroke();
          }
          ctx.translate((Math.random()-0.5)*5, (Math.random()-0.5)*5);
        }
        ctx.restore();
      } 
      else if (this.type === 4) {
        // --- Mahito Domain Expansion ---
        ctx.save();
        const skinColor = '#8fa3b5'; const detailColor = '#2c3e50';

        if (this.timer < T_RISE) {
          ctx.translate(scx, scy); 
          const spinAngle = this.timer * 0.15; ctx.rotate(spinAngle);
          for (let i = 0; i < 4; i++) {
              ctx.save(); ctx.rotate((Math.PI * 2 / 4) * i); ctx.translate(0, -30); 
              ctx.fillStyle = skinColor; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = detailColor; ctx.fillRect(-15, -8, 30, 3); ctx.fillRect(-18, 0, 36, 3); ctx.fillRect(-15, 8, 30, 3);
              ctx.restore();
          }
        } else {
          ctx.translate(scx, scy - 30);
          const attackSpinAngle = (this.timer - T_RISE) * 0.05; ctx.rotate(attackSpinAngle);

          for (let i = 0; i < 5; i++) {
              ctx.save(); ctx.rotate((Math.PI * 2 / 5) * i); ctx.translate(0, -120); 
              ctx.fillStyle = skinColor; ctx.beginPath(); ctx.arc(0, 0, 25, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-25, -15, 50, 35);
              for (let f = 0; f < 5; f++) {
                  ctx.save(); ctx.translate(-20 + (f * 10), -25); 
                  let fingerLen = 30;
                  if (f === 0 || f === 4) fingerLen = 20; 
                  if (f === 2) fingerLen = 35; 
                  ctx.rotate((f - 2) * 0.1); 
                  ctx.fillStyle = skinColor; ctx.fillRect(-4, -fingerLen, 8, fingerLen); ctx.restore();
              }
              ctx.restore();
          }
          if (this.timer % 10 === 0) {
            ctx.fillStyle = 'rgba(138, 43, 226, 0.4)'; 
            ctx.beginPath(); ctx.arc(0, 0, Math.random() * 60 + 40, 0, Math.PI*2); ctx.fill();
          }
        }
        ctx.restore();
      }
      else if (this.type === 5) {
        ctx.shadowBlur = 30; ctx.shadowColor = '#ffffff'; ctx.fillStyle = '#000000';
        const radius = 60 + Math.sin(this.timer * 0.05) * 10;
        ctx.beginPath(); ctx.arc(scx, scy - 30, radius, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(scx, scy - 30, radius*0.8, radius*0.3, 0, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = '#00bfff'; ctx.beginPath(); ctx.arc(scx, scy - 30, radius*0.2, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    } else if (this.type === 6) {
      ctx.fillStyle = '#8b0000'; ctx.fillRect(cx - 15, cy - 10, 30, 40);
      ctx.fillStyle = '#f5deb3'; ctx.beginPath(); ctx.arc(cx, cy - 20, 15, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 10, cy - 25); ctx.lineTo(cx + 10, cy - 25); ctx.stroke();
    } else if (this.type === 7) {
      ctx.fillStyle = '#111'; ctx.fillRect(cx - 15, cy - 10, 30, 40);
      ctx.fillStyle = '#f5deb3'; ctx.beginPath(); ctx.arc(cx, cy - 20, 15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.fillRect(cx - 15, cy - 28, 30, 10);
      if (this.purpleCooldown <= 0 && isHovered && selectedPlant !== 99) {
        ctx.shadowBlur = 15; ctx.shadowColor = '#8a2be2'; ctx.strokeStyle = '#8a2be2'; ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height); ctx.shadowBlur = 0;
      } else if (this.purpleCooldown > 0) {
         ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(this.x, this.y, this.width, this.height * (this.purpleCooldown / 900));
      }
    }
    else if (this.type === 8) {
      // พืช Gojo (น้ำแข็ง)
      ctx.fillStyle = '#4682b4'; ctx.fillRect(cx - 5, cy, 10, 30); // ก้านสีน้ำเงิน
      ctx.fillStyle = '#87ceeb'; ctx.beginPath(); ctx.arc(cx, cy - 10, 20, 0, Math.PI * 2); ctx.fill(); // หัวสีฟ้า
      ctx.fillStyle = '#e0ffff'; ctx.fillRect(cx + 10, cy - 20, 20, 20); // ปากกระบอก
    }
    
    // --- [✅ เพิ่มใหม่] วาด Cactus Tank (Type 10) ---
    else if (this.type === 10) {
      ctx.fillStyle = '#228B22'; // สีเขียวเข้ม
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#006400';
      ctx.lineWidth = 3;
      ctx.stroke();

      // หนามรอบตัว
      ctx.fillStyle = '#ADFF2F';
      for(let i=0; i<8; i++) {
          let angle = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle)*35, cy + Math.sin(angle)*35);
          ctx.lineTo(cx + Math.cos(angle)*45, cy + Math.sin(angle)*45);
          ctx.lineTo(cx + Math.cos(angle + 0.2)*35, cy + Math.sin(angle + 0.2)*35);
          ctx.fill();
      }
      // ดอกไม้เล็กๆ บนหัว
      ctx.fillStyle = '#FF69B4'; // สีชมพู
      ctx.beginPath(); ctx.arc(cx, cy - 35, 12, 0, Math.PI*2); ctx.fill();
    }

    // --- [✅ เพิ่มใหม่] วาด Train (Type 11) ---
    else if (this.type === 11) {
      // Train Plant 🚂
      ctx.fillStyle = '#333'; // หัวรถจักร
      ctx.fillRect(this.x, this.y + 20, 70, 50);
      ctx.fillStyle = '#B22222'; // ห้องคนขับ
      ctx.fillRect(this.x, this.y, 40, 40);

      // กันชนพุ่งชนซอมบี้ (Cowcatcher) สีทอง
      ctx.fillStyle = '#FFD700'; 
      ctx.beginPath();
      ctx.moveTo(this.x + 70, this.y + 40);
      ctx.lineTo(this.x + 90, this.y + 70);
      ctx.lineTo(this.x + 70, this.y + 70);
      ctx.fill();

      // ล้อ
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(this.x + 20, this.y + 70, 10, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(this.x + 50, this.y + 70, 10, 0, Math.PI*2); ctx.fill();
    }

    // --- หลอดเลือดสำหรับพืชทั่วไป ---
    if (this.type < 3 || this.type > 5) {
      ctx.fillStyle = 'red'; ctx.fillRect(this.x, this.y + 80, this.width, 5);
      ctx.fillStyle = 'green'; ctx.fillRect(this.x, this.y + 80, (this.health / this.maxHealth) * this.width, 5);
    }

    // วาดเอฟเฟกต์ไฟเขียวตอน Jackpot (ยกเว้น Hakari Type 9 ไม่ต้องเรืองแสงเขียว)
    if (state.jackpotTimer > 0 && this.type !== 9) {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff00';
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
      ctx.restore();
    }

    // --- วาด Hakari 888 (Type 9) ---
    if (this.type === 9) {
      // ใช้จุดศูนย์กลางจากความกว้างและความสูงจริงของ Cell
      const cx2 = this.x + this.width / 2;
      const cy2 = this.y + this.height / 2 + this.danceOffset;
      
      // ตัวเครื่อง Slot
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(cx2 - 20, cy2 - 30, 40, 60);
      
      // หน้าจอ Slot
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx2 - 15, cy2 - 20, 30, 20);
      
      if (this.slotStatus === 'spinning') {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText("777", cx2 - 10, cy2 - 5); // อนิเมชั่นหมุนแบบง่าย
      } else if (this.slotStatus === 'won') {
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 16px Arial';
        ctx.fillText("JACKPOT!", cx2 - 35, cy2 - 40);
      }
    }
  }
}