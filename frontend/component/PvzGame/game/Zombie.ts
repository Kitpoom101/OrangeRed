import { CELL_SIZE, CELL_GAP, TOP_BAR_HEIGHT, IGameState } from './constants';

export class Zombie {
  x: number; y: number; width: number; height: number;
  speed: number; movement: number; health: number; maxHealth: number; type: number;
  abilityTimer: number; isAdapted: boolean; adaptTimer: number; slashTimer: number;
  rctTimer: number; pushTimer: number; stunTimer: number; slowTimer: number;

  // สถานะใหม่สำหรับสกิล Mystery Shadow
  isEating: boolean;
  eatTimer: number;
  isBuffed: boolean;
  
  // สถานะใหม่สำหรับ Jane Juliet
  isShootingBeam: boolean;
  beamTimer: number;

  // ตัวแปรสำหรับ The Roaring Knight (Type 100)
  isSpawned?: boolean;
  targetX?: number;
  moveDirection?: number;
  returnTimer?: number;   
  isReturning?: boolean;  
  baseTargetX?: number;   
  activeSkill?: number;
  skillTimer?: number;
  dashTargetY?: number;
  dashOriginY?: number;
  skill2Targets?: {x: number, y: number}[];
  afterimages?: {x: number, y: number, alpha: number}[];
  
  // [✅ เพิ่มใหม่] สถานะสำหรับจัดการการมึนงงและฉากตาย
  isDying: boolean;
  deathTimer: number;

  constructor(verticalPosition: number, type: number, canvasWidth: number) {
    this.x = canvasWidth; this.y = verticalPosition;
    this.width = CELL_SIZE - CELL_GAP * 2; this.height = CELL_SIZE - CELL_GAP * 2;
    this.type = type;
    this.abilityTimer = 0; this.isAdapted = false; this.adaptTimer = 0;
    this.slashTimer = 0; this.rctTimer = 0; this.pushTimer = 0; this.stunTimer = 0; this.slowTimer = 0;
    
    this.isEating = false;
    this.eatTimer = 0;
    this.isBuffed = false;
    
    this.isShootingBeam = false;
    this.beamTimer = 0;

    // ตั้งค่าตัวแปรจัดการฉากตาย
    this.isDying = false;
    this.deathTimer = 0;
    
    // ตั้งค่าตัวแปรสกิลใหม่ของบอส
    this.activeSkill = 0;
    this.skillTimer = 0;
    this.afterimages = [];
    this.skill2Targets = [];
    
    if (this.type === 1) { this.health = 300; this.speed = Math.random() * 0.1 + 0.1; } 
    else if (this.type === 2) { this.health = 100; this.speed = Math.random() * 0.2 + 0.25; } 
    else if (this.type === 3) { this.health = 600; this.speed = Math.random() * 0.05 + 0.08; } 
    else if (this.type === 4) { this.health = 250; this.speed = Math.random() * 0.1 + 0.15; }
    else if (this.type === 5) { this.health = 400; this.speed = 0.1; } 
    // [✅ เพิ่มใหม่] Spinosaurus Zombie
    else if (this.type === 10) { this.health = 500; this.speed = Math.random() * 0.1 + 0.15; } 
    else if (this.type === 100) { 
      this.health = 8000; this.speed = 0; 
      this.width = CELL_SIZE; this.height = CELL_SIZE;
      this.isSpawned = false; 
      this.targetX = CELL_SIZE * 5; 
      this.baseTargetX = CELL_SIZE * 5; 
      this.moveDirection = 1; 
      this.returnTimer = 0;
      this.isReturning = false;
    }
    else if (this.type === 101) {
      this.health = 300; this.speed = 0.2; 
    }
    else if (this.type === 102) { 
      this.health = 15000; // เลือดบอสสูงสุด
      this.speed = 0.03; 
      this.width = CELL_SIZE * 1.2; 
      this.height = CELL_SIZE * 1.2;
      this.activeSkill = 0;
      this.skillTimer = 0;
      this.abilityTimer = 0;
    }
    else if (this.type === 99) {
      this.health = 5000; this.speed = 0.05; 
      this.width = CELL_SIZE; this.height = CELL_SIZE;
    } 
    else { this.health = 100; this.speed = Math.random() * 0.15 + 0.15; }
    
    this.maxHealth = this.health;
    this.movement = this.speed;
  }
  
  update(state: IGameState) { 
    if (this.slowTimer > 0) this.slowTimer--;
    if (this.stunTimer > 0) this.stunTimer--;
    if (this.pushTimer > 0) this.pushTimer--;

    let currentSpeed = this.movement;
    if (this.slowTimer > 0) currentSpeed *= 0.5;
    
    // --- ระบบสกิล Mystery Shadow ---
    if (this.type === 4) {
      if (this.health > 0 && this.health <= this.maxHealth * 0.51 && !this.isEating && !this.isBuffed) {
        this.isEating = true;
        this.eatTimer = 120;
      }

      if (this.isEating) {
        this.eatTimer--;
        if (this.eatTimer <= 0) {
          this.isEating = false;
          this.isBuffed = true;
          this.speed *= 2;
          this.movement = this.speed;
        }
      }
      
      if (this.isEating || this.isBuffed) {
        this.stunTimer = 0;
        this.slowTimer = 0;
        this.pushTimer = 0;
      }

      let shadowSpeed = this.speed;
      if (this.isBuffed) {
        shadowSpeed = this.speed * 1.5;
      } else if (this.slowTimer > 0) {
        shadowSpeed = this.speed * 0.5;
      }

      if (this.stunTimer <= 0 && !this.isEating) {
        if (this.pushTimer > 0) this.x += 1.5;
        else this.x -= shadowSpeed;
      }
    }
    
    // --- ระบบของ Jane Juliet ---
    else if (this.type === 5) {
      this.abilityTimer++;
      if (this.abilityTimer >= 900 && !this.isShootingBeam) {
        this.isShootingBeam = true;
        this.beamTimer = 60; 
      }
      
      if (this.isShootingBeam) {
        this.beamTimer--;
        if (this.beamTimer === 30) {
          state.defenders.forEach(d => {
            if (d.y === this.y) {
               d.health -= d.maxHealth * 0.10; 
            }
          });
        }
        if (this.beamTimer <= 0) {
          this.isShootingBeam = false;
          this.abilityTimer = 0;
        }
      } else {
        if (this.stunTimer <= 0) {
          if (this.pushTimer > 0) this.x += 1.5;
          else this.x -= currentSpeed;
        }
      }
    }

    // --- ระบบสกิลมโหรากา ---
    else if (this.type === 99) {
      this.abilityTimer++;
      if (this.isAdapted) {
        this.adaptTimer--;
        if (this.adaptTimer <= 0) this.isAdapted = false;
      }
      if (this.rctTimer > 0) this.rctTimer--;

      if (this.abilityTimer >= 900) {
        this.abilityTimer = 0;
        const eventType = Math.floor(Math.random() * 3);
        if (eventType === 0) {
          this.slashTimer = 45; 
          state.defenders.forEach(d => {
            if (d.y === this.y && (d.type < 3 || d.type > 5)) d.health -= d.maxHealth * 0.9; 
          });
        } else if (eventType === 1) {
          this.isAdapted = true; this.adaptTimer = 180; 
        } else if (eventType === 2) {
          this.health = Math.min(this.maxHealth, this.health + 1500);
          state.projectiles.length = 0; 
          this.rctTimer = 60; 
        }
      }

      if (this.stunTimer <= 0) {
        if (this.pushTimer > 0) {
            this.x += 1.5;
        } else if (this.slashTimer <= 0) {
            this.x -= currentSpeed;
        }
      }
    }

    // --- ระบบบอส Heian Sukuna (Type 102) ---
    else if (this.type === 102) {
      if (this.activeSkill && this.activeSkill > 0) {
        this.skillTimer!++;
        if (this.activeSkill === 1) {
          if (this.skillTimer! === 30) {
            const lanes = [this.y - CELL_SIZE, this.y, this.y + CELL_SIZE];
            state.defenders.forEach(d => {
              if (lanes.includes(d.y) && d.x < this.x) d.health -= 50; 
            });
          }
          if (this.skillTimer! >= 60) this.activeSkill = 0;
        }
        else if (this.activeSkill === 2) {
          if (this.skillTimer! === 40) {
            let targets = state.defenders.filter(d => d.y === this.y && d.x < this.x);
            if (targets.length > 0) {
              let closest = targets.sort((a, b) => b.x - a.x)[0];
              closest.health -= closest.maxHealth * 0.8;
            }
          }
          if (this.skillTimer! >= 70) this.activeSkill = 0;
        }
        else if (this.activeSkill === 3) {
          if (this.skillTimer! === 100) {
            state.defenders.forEach(d => { if (d.y === this.y) d.health -= 500; });
            state.projectiles = state.projectiles.filter(p => p.y !== this.y);
          }
          if (this.skillTimer! >= 150) this.activeSkill = 0;
        }
      } else {
        if (this.stunTimer <= 0) this.x -= currentSpeed;
        this.abilityTimer++;
        if (this.abilityTimer >= 600) {
          this.abilityTimer = 0;
          this.activeSkill = Math.floor(Math.random() * 3) + 1;
          this.skillTimer = 0;
        }
      }
    }

    // --- ระบบของ The Roaring Knight (Type 100) แบบอัปเกรดใหม่ ---
    else if (this.type === 100) {
      if (!this.afterimages) this.afterimages = [];
      
      // [⚡ OPTIMIZED] เก็บ Afterimage แค่ทุกๆ 5 เฟรม และลดเหลือ 3 ร่าง
      if (state.frame % 5 === 0) {
        this.afterimages.unshift({ x: this.x, y: this.y, alpha: 0.4 });
        if (this.afterimages.length > 3) this.afterimages.pop();
      }
      this.afterimages.forEach(img => img.alpha -= 0.05);

      if (!this.isSpawned) {
        if (this.x > this.targetX!) this.x -= 2;
        else this.isSpawned = true;
      } else {
        if (this.activeSkill && this.activeSkill > 0) {
          if (this.activeSkill === 1) {
            if (this.skillTimer === 0) {
              let spawnCount = Math.floor(Math.random() * 4) + 2;
              for(let i = 0; i < spawnCount; i++) {
                let randomY = Math.floor(Math.random() * 5) * CELL_SIZE + TOP_BAR_HEIGHT + CELL_GAP;
                let minion = new Zombie(randomY, 101, this.x); 
                state.enemies.push(minion);
              }
              this.skillTimer = 60; 
            }
            this.skillTimer!--;
            if (this.skillTimer! <= 0) this.activeSkill = 0; 
          } 
          else if (this.activeSkill === 2) {
            if (this.skillTimer === 0) {
              this.skill2Targets = [];
              if (state.defenders.length > 0) {
                let targetIndex = Math.floor(Math.random() * state.defenders.length);
                let target = state.defenders[targetIndex];
                state.defenders.forEach(d => {
                  if (d.y === target.y && Math.abs(d.x - target.x) <= CELL_SIZE) {
                    let damage = d.maxHealth * 0.25;
                    d.health -= damage;
                    if (d.health <= d.maxHealth * 0.25) d.health = 0; 
                    this.skill2Targets!.push({x: d.x, y: d.y});
                  }
                });
              }
              this.skillTimer = 60; 
            }
            this.skillTimer!--;
            if (this.skillTimer! <= 0) {
              this.activeSkill = 0;
              this.skill2Targets = [];
            }
          }
          else if (this.activeSkill === 3) {
            if (this.skillTimer === 0) {
               this.dashOriginY = this.y;
               let lanes = [0, 1, 2, 3, 4].map(i => i * CELL_SIZE + TOP_BAR_HEIGHT + CELL_GAP);
               this.dashTargetY = lanes[Math.floor(Math.random() * lanes.length)];
            }
            if (this.skillTimer! < 60) {
               this.x += 2;
               if (this.x > state.canvas.width - this.width) this.x = state.canvas.width - this.width;
               this.y += (this.dashTargetY! - this.y) * 0.1; 
            } else if (this.skillTimer! >= 60 && this.skillTimer! < 90) {
               this.x += (Math.random() - 0.5) * 6;
               this.y += (Math.random() - 0.5) * 6;
            } else if (this.skillTimer! === 90) {
               state.defenders.forEach(d => {
                  if (d.y === this.dashTargetY!) d.health -= d.maxHealth * 0.5; 
               });
               this.x -= 800; 
            } else if (this.skillTimer! > 120) {
               this.x += 10;
               this.y += (this.dashOriginY! - this.y) * 0.1;
               if (this.x >= this.baseTargetX!) {
                  this.x = this.baseTargetX!;
                  this.y = this.dashOriginY!;
                  this.activeSkill = 0; 
               }
            }
            this.skillTimer!++;
          }
        } 
        else {
          this.y += this.moveDirection! * 1;
          if (this.y < TOP_BAR_HEIGHT) {
            this.y = TOP_BAR_HEIGHT;
            this.moveDirection = 1;
          } else if (this.y > TOP_BAR_HEIGHT + CELL_SIZE * 4) {
            this.y = TOP_BAR_HEIGHT + CELL_SIZE * 4;
            this.moveDirection = -1;
          }

          if (this.isReturning) {
            this.pushTimer = 0; 
            this.x -= 2; 
            if (this.x <= this.baseTargetX!) {
              this.x = this.baseTargetX!;
              this.isReturning = false;
            }
          } else {
            if (this.pushTimer > 0) {
              this.x += 1.5; 
              if (this.x > state.canvas.width - this.width) this.x = state.canvas.width - this.width;
              this.returnTimer = 90; 
            } else {
              if (this.returnTimer! > 0) {
                this.returnTimer!--;
                if (this.returnTimer! <= 0) this.isReturning = true; 
              } else if (this.x > this.baseTargetX!) {
                this.isReturning = true; 
              }
            }
          }

          this.abilityTimer++;
          if (this.abilityTimer >= 900) {
            this.abilityTimer = 0;
            this.activeSkill = Math.floor(Math.random() * 3) + 1; 
            this.skillTimer = 0;
          }
        }
      }
    }

    // --- อัศวินดำ (Type 101) และซอมบี้ทั่วไป ---
    else {
      if (this.stunTimer <= 0) {
        if (this.pushTimer > 0) this.x += 1.5;
        else this.x -= currentSpeed;
      }
    }
  }

  
  draw(state: IGameState) {
    const { ctx, frame, mysteryShadowImg, canvas } = state;
    
    // --- Type 99: มโหรากา ---
    if (this.type === 99) {
      if (this.isAdapted) { ctx.shadowBlur = 20; ctx.shadowColor = '#d4af37'; }
      if (this.rctTimer > 0) {
        ctx.fillStyle = `rgba(50, 205, 50, ${this.rctTimer/60})`;
        ctx.beginPath(); ctx.arc(this.x + 45, this.y + 40, 150 - this.rctTimer*2, 0, Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = '#f0f0f0'; ctx.fillRect(this.x + 10, this.y + 10, 70, 80);
      ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(this.x + 30, this.y + 30, 5, 0, Math.PI*2); ctx.fill();
      if (this.slashTimer > 0) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.fillRect(0, this.y + 30, canvas.width, 40);
        this.slashTimer--;
      }
      ctx.shadowBlur = 0; 
      ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 4;
      const wheelCenterY = this.y - 10; const wheelCenterX = this.x + 45;
      ctx.beginPath(); ctx.arc(wheelCenterX, wheelCenterY, 20, 0, Math.PI * 2); ctx.stroke();
      for(let i=0; i<8; i++) {
        ctx.beginPath(); ctx.moveTo(wheelCenterX, wheelCenterY);
        ctx.lineTo(wheelCenterX + Math.cos((i * Math.PI/4) + frame*0.01)*25, wheelCenterY + Math.sin((i * Math.PI/4) + frame*0.01)*25);
        ctx.stroke();
      }
    } 
    // --- Type 4: Mystery Shadow ---
    else if (this.type === 4) {
      if (mysteryShadowImg.complete && mysteryShadowImg.naturalWidth !== 0) {
        ctx.drawImage(mysteryShadowImg, this.x + 10, this.y + 5, 70, 80);
      } else {
        ctx.fillStyle = '#111'; ctx.fillRect(this.x + 20, this.y + 30, 40, 60);
        ctx.fillStyle = '#8a2be2'; ctx.font = '20px Arial'; ctx.fillText('?', this.x + 35, this.y + 65);
      }

      if (this.isEating) {
        const progress = 1 - (this.eatTimer / 120); 
        const throwHeight = Math.sin(progress * Math.PI) * 80;
        const chickenY = this.y + 20 - throwHeight;
        ctx.save();
        ctx.translate(this.x + 35, chickenY);
        ctx.rotate(progress * Math.PI * 4); 
        ctx.fillStyle = '#d2691e'; 
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 15, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f5deb3'; ctx.fillRect(-4, 10, 8, 15);
        ctx.restore();
      }

      if (this.isBuffed) {
        ctx.shadowBlur = 15; ctx.shadowColor = 'red';
        ctx.strokeStyle = 'red'; ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 10, this.y + 5, 70, 80);
        ctx.shadowBlur = 0;
      }
    }
    // --- [✅ เพิ่มใหม่] Type 10: Spinosaurus ---
    else if (this.type === 10) {
      ctx.save();
      // ลำตัว
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(this.x + 40, this.y + 50, 35, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // ครีบหลัง (Sail)
      ctx.fillStyle = '#CD5C5C';
      ctx.beginPath();
      ctx.moveTo(this.x + 15, this.y + 40);
      ctx.lineTo(this.x + 40, this.y + 5);
      ctx.lineTo(this.x + 65, this.y + 40);
      ctx.fill();
      // หัวและขากรรไกรยาว
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.x - 15, this.y + 25, 35, 18);
      // ฟันแหลม
      ctx.fillStyle = '#FFF';
      for(let i=0; i<4; i++) {
          ctx.beginPath();
          ctx.moveTo(this.x - 15 + i*8, this.y + 43);
          ctx.lineTo(this.x - 11 + i*8, this.y + 50);
          ctx.lineTo(this.x - 7 + i*8, this.y + 43);
          ctx.fill();
      }
      // หางยาว
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(this.x + 65, this.y + 45);
      ctx.lineTo(this.x + 100, this.y + 50);
      ctx.lineTo(this.x + 65, this.y + 55);
      ctx.fill();
      // ขาหลัง และ แขน
      ctx.fillStyle = '#5C4033';
      ctx.fillRect(this.x + 20, this.y + 65, 10, 15);
      ctx.fillRect(this.x + 50, this.y + 65, 10, 15);
      ctx.fillRect(this.x + 5, this.y + 50, 5, 10);
      ctx.restore();
    }
    // --- Type 100: บอส THE ROARING KNIGHT ---
    else if (this.type === 100) {
      // [✅ เพิ่มใหม่] เอฟเฟกต์ฉากตายของบอส
      if (this.isDying) {
          ctx.save();
          let shakeX = (Math.random() - 0.5) * 15;
          let shakeY = (Math.random() - 0.5) * 15;
          ctx.translate(this.x + shakeX, this.y + shakeY);
          
          ctx.globalAlpha = Math.max(0, this.deathTimer / 180); 
          ctx.shadowBlur = 40; ctx.shadowColor = '#ff0000';
          ctx.fillStyle = '#000000';
          
          this.drawKnightSilhouette(ctx, 0, 0); 

          ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(40, 20); ctx.lineTo(30, 40); ctx.lineTo(55, 55); ctx.lineTo(20, 75);
          ctx.stroke();
          ctx.restore();
          return; // คืนค่าออกไป ไม่ต้องวาดร่างปกติ
      }

      // วาด Afterimage Trail 
      if (this.afterimages && this.isSpawned) {
         ctx.save();
         ctx.shadowBlur = 0; // [⚡ OPTIMIZED] ปิดเงาทั้งหมดของร่างแยก
         this.afterimages.forEach((img) => {
            if (img.alpha > 0.05) { // [⚡ OPTIMIZED] ถ้าร่างเริ่มจางมากแล้วไม่ต้องวาดเลย ลดภาระ GPU
               ctx.globalAlpha = img.alpha;
               ctx.fillStyle = '#6b21a8'; // ใช้สีทึบธรรมดา
               this.drawKnightSilhouette(ctx, img.x, img.y);
            }
         });
         ctx.restore();
      }

      if (!this.isSpawned) {
         ctx.fillStyle = '#2c3e50'; 
         ctx.shadowBlur = 10; ctx.shadowColor = '#8a2be2'; // [⚡ OPTIMIZED] ลดจาก 30 เหลือ 10
         ctx.beginPath(); ctx.arc(this.x + 40, this.y + 40, 30, 0, Math.PI * 2); ctx.fill();
         ctx.shadowBlur = 0;
      } else {
         if (this.activeSkill === 3 && this.skillTimer! >= 60 && this.skillTimer! < 90) {
             ctx.save();
             ctx.beginPath();
             ctx.arc(this.x + 45, this.y + 45, 70 - (this.skillTimer!-60)*1.8, 0, Math.PI*2);
             ctx.strokeStyle = `rgba(138, 43, 226, ${(this.skillTimer!-60)/30})`;
             ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
         }

         // วาดตัวเกราะหลักแบบอัปเกรด
         ctx.save();
         ctx.shadowBlur = 10; ctx.shadowColor = '#4a00e0'; // [⚡ OPTIMIZED] ลดเงาตัวหลักจาก 20 เหลือ 10
         ctx.fillStyle = '#0f0f1b'; 
         
         this.drawKnightSilhouette(ctx, this.x, this.y);
         
         ctx.shadowBlur = 5; ctx.shadowColor = '#ff0055'; // [⚡ OPTIMIZED] ลดเงาตาจาก 15 เหลือ 5
         ctx.fillStyle = '#ff0055'; 
         ctx.beginPath();
         ctx.moveTo(this.x + 35, this.y + 25); ctx.lineTo(this.x + 50, this.y + 22);
         ctx.lineTo(this.x + 42, this.y + 28); ctx.fill();
         
         ctx.shadowBlur = 0; // [⚡ OPTIMIZED] ปิดเงาดาบ
         ctx.strokeStyle = '#8a2be2'; ctx.lineWidth = 2;
         ctx.beginPath(); ctx.moveTo(this.x + 30, this.y + 50); ctx.lineTo(this.x - 55, this.y + 50);
         ctx.stroke(); ctx.restore();

         if (this.activeSkill === 2 && this.skill2Targets && this.skillTimer! > 0) {
             this.skill2Targets.forEach(pos => {
                 ctx.save();
                 ctx.translate(pos.x + CELL_SIZE/2, pos.y + CELL_SIZE/2);
                 ctx.rotate(Math.PI / 4); 
                 ctx.fillStyle = `rgba(255, 0, 85, ${this.skillTimer! / 60})`;
                 ctx.shadowBlur = 20; ctx.shadowColor = '#ff0055';
                 ctx.fillRect(-50, -8, 100, 16); ctx.fillRect(-8, -50, 16, 100);
                 ctx.restore();
             });
         }

         if (this.activeSkill === 3 && this.skillTimer! >= 90 && this.skillTimer! < 110) {
             ctx.save();
             let alpha = 1 - (this.skillTimer! - 90)/20;
             ctx.fillStyle = `rgba(138, 43, 226, ${alpha})`;
             ctx.shadowBlur = 20; ctx.shadowColor = '#8a2be2';
             ctx.fillRect(0, this.dashTargetY! + 30, canvas.width, 40);
             ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
             ctx.fillRect(0, this.dashTargetY! + 45, canvas.width, 10);
             ctx.restore();
         }

         if (this.activeSkill && this.activeSkill > 0) {
             ctx.save();
             ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center';
             ctx.shadowBlur = 4; ctx.shadowColor = 'black';
             let skillName = "";
             if (this.activeSkill === 1) { skillName = "💀 Shadows Arise!"; ctx.fillStyle = '#a855f7'; } 
             else if (this.activeSkill === 2) { skillName = "⚔️ Dark Cleave!"; ctx.fillStyle = '#fb7185'; } 
             else if (this.activeSkill === 3) { skillName = "🚀 Phantom Dash!"; ctx.fillStyle = '#2dd4bf'; }
             ctx.fillText(skillName, this.x + 35, this.y - 15);
             ctx.restore();
         }
      }
    }
    // --- Type 101: อัศวินดำลูกน้อง ---
    else if (this.type === 101) {
      ctx.fillStyle = '#34495e'; ctx.fillRect(this.x + 20, this.y + 25, 50, 50);
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x + 30, this.y + 35, 8, 8);
    } 
    // --- Type 102: Heian Sukuna ---
    else if (this.type === 102) {
      ctx.fillStyle = '#4a0404'; ctx.fillRect(this.x + 5, this.y + 5, 90, 90);
      ctx.fillStyle = '#000'; ctx.fillRect(this.x + 20, this.y + 20, 10, 5); ctx.fillRect(this.x + 60, this.y + 20, 10, 5);
      if (this.activeSkill === 1 && this.skillTimer! > 25) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        for(let i=0; i<3; i++) {
          ctx.beginPath(); ctx.moveTo(this.x, this.y + 20 + (i*30)); ctx.lineTo(this.x - 200, this.y + (i*30)); ctx.stroke();
        }
      }
      if (this.activeSkill === 3) {
        ctx.fillStyle = `rgba(255, 100, 0, ${this.skillTimer! / 100})`;
        ctx.beginPath(); ctx.arc(this.x, this.y + 50, 40, 0, Math.PI*2); ctx.fill();
        if (this.skillTimer! > 100) {
          ctx.fillStyle = '#ff4500'; ctx.fillRect(0, this.y + 40, this.x, 20);
        }
      }
      if (this.activeSkill! > 0) {
        ctx.fillStyle = 'white'; ctx.font = 'bold 16px Arial';
        const names = ["", "解 (Dismantle)", "捌 (Cleave)", "■ (Fuga)"];
        ctx.fillText(names[this.activeSkill!], this.x, this.y - 20);
      }
    }
    // --- Zombie ทั่วไป ---
    else {
      ctx.fillStyle = '#556b2f'; ctx.fillRect(this.x + 20, this.y + 30, 40, 60); 
      ctx.fillStyle = '#a9a9a9'; ctx.fillRect(this.x, this.y + 40, 30, 15); 
      ctx.fillStyle = '#8fbc8f'; ctx.fillRect(this.x + 25, this.y + 5, 30, 30); 
      ctx.fillStyle = 'red'; ctx.fillRect(this.x + 30, this.y + 15, 5, 5); 
      
      if (this.type === 1) { 
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath(); ctx.moveTo(this.x + 40, this.y - 20); ctx.lineTo(this.x + 20, this.y + 5); ctx.lineTo(this.x + 60, this.y + 5); ctx.fill();
      } else if (this.type === 2) {
        ctx.fillStyle = '#ff0000'; ctx.fillRect(this.x + 25, this.y + 10, 30, 5);
      } else if (this.type === 3) {
        ctx.fillStyle = '#778899'; ctx.fillRect(this.x + 20, this.y - 10, 40, 18);
      } else if (this.type === 5) {
        ctx.fillStyle = '#101010'; ctx.fillRect(this.x + 20, this.y + 0, 50, 20); 
        ctx.fillStyle = '#30292c'; ctx.fillRect(this.x + 20, this.y + 30, 40, 60); 
        ctx.fillStyle = '#fff4d7'; ctx.fillRect(this.x, this.y + 40, 30, 15); 
        ctx.fillStyle = '#ffe3c6'; ctx.fillRect(this.x + 25, this.y + 5, 30, 30); 
        if (this.isShootingBeam) {
           ctx.fillStyle = 'rgba(20, 200, 255, 0.7)'; 
           ctx.fillRect(0, this.y + 20, this.x + 20, 15); 
        }
      }
    }
    
    // UI สถานะผิดปกติและหลอดเลือด
    if (this.stunTimer > 0) {
      ctx.fillStyle = 'rgba(0,0,255,0.3)'; ctx.fillRect(this.x, this.y, this.width, this.height);
    } else if (this.slowTimer > 0) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'; ctx.fillRect(this.x, this.y, this.width, this.height); 
    }
    
    ctx.fillStyle = 'red'; ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = 'yellow'; ctx.fillRect(this.x, this.y - 10, (Math.max(0, this.health) / this.maxHealth) * this.width, 5);
  }

  // [⚡ OPTIMIZED] ลดจำนวนจุด Vector ของ Model ให้เหลือน้อยที่สุด ลดภาระ CPU/GPU
  private drawKnightSilhouette(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    ctx.beginPath();
    // ยุบรวมจุดที่ไม่จำเป็นออก
    ctx.moveTo(cx + 40, cy + 10); 
    ctx.lineTo(cx + 25, cy + 25); 
    ctx.lineTo(cx + 20, cy + 50); 
    ctx.lineTo(cx + 30, cy + 80); 
    ctx.lineTo(cx + 50, cy + 80); 
    ctx.lineTo(cx + 60, cy + 50); 
    ctx.lineTo(cx + 55, cy + 25); 
    ctx.closePath(); 
    ctx.fill();

    // ส่วนดาบและโกร่งดาบ (ใช้สี่เหลี่ยม fillRect ประมวลผลเร็วกว่าเส้น Path)
    ctx.fillRect(cx - 50, cy + 47, 90, 6); // ตัวใบดาบ
    ctx.fillRect(cx + 35, cy + 35, 5, 30); // โกร่งดาบ
  }
}