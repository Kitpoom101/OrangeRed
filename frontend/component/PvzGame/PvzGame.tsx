'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  CELL_SIZE, CELL_GAP, TOP_BAR_HEIGHT, PREP_TIME_FRAMES, 
  VISIBLE_UI_WIDTH, ALL_ITEMS, IGameState, ItemCard 
} from './game/constants';
import { Plant } from './game/Plant';
import { Zombie } from './game/Zombie';
import { Projectile, Explosion, SunDrop } from './game/Misc';

export default function PvzGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- Debug Menu States ---
  const [showDebug, setShowDebug] = useState(false);
  const debugAPI = useRef<any>({});

  // States สำหรับทำเมนูให้ลากได้
  const [menuPos, setMenuPos] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // State สำหรับเลือกซอมบี้ที่ต้องการเสก
  const [customZombieType, setCustomZombieType] = useState(0);

  // กำหนดตำแหน่งเริ่มต้นของเมนูให้อยู่มุมขวาบนเมื่อโหลดหน้าจอ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMenuPos({ x: window.innerWidth - 260, y: 20 });
    }
  }, []);

  // Effect สำหรับจับการลากเมาส์ (Drag)
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMenuPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - menuPos.x,
      y: e.clientY - menuPos.y
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mysteryShadowImg = new Image();
    mysteryShadowImg.src = '/mysteryshadow.png'; 

    const gameState: IGameState = {
      ctx, canvas, frame: 0, sun: 800, score: 0,
      defenders: [], enemies: [], projectiles: [],
      sunDrops: [], explosions: [], enemyPositions: [],
      mouse: { x: -100, y: -100, clicked: false },
      selectedPlant: 0,
      mysteryShadowImg,
      jackpotTimer: 0
    };

    let gameOver = false;
    let isPaused = false; 
    let animationId: number;
    let uiScroll = 0;
    
    let keySequence = '';
    const secretCode = '44256';
    let roaringAudio: HTMLAudioElement | null = null; 

    debugAPI.current = {
      addSun: (amount: number) => { gameState.sun += amount; },
      skipPrepTime: () => { 
        if (gameState.frame < PREP_TIME_FRAMES) gameState.frame = PREP_TIME_FRAMES; 
      },
      spawnZombie: (type: number) => {
        let verticalPosition = Math.floor(Math.random() * 5) * CELL_SIZE + TOP_BAR_HEIGHT + CELL_GAP;
        const z = new Zombie(verticalPosition, type, canvas.width);
        if (type === 100) {
            z.x = canvas.width + 100;
        }
        gameState.enemies.push(z);
        gameState.enemyPositions.push(verticalPosition);
      },
      triggerJackpot: () => { 
        gameState.jackpotTimer = 1800; 
      },
      killAllZombies: () => {
        gameState.enemies.forEach(e => {
            gameState.explosions.push(new Explosion(e.x + e.width/2, e.y + e.height/2));
        });
        gameState.enemies.length = 0;
        gameState.enemyPositions.length = 0;
        if (roaringAudio) { roaringAudio.pause(); roaringAudio.currentTime = 0; }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // เช็คด้วย e.code เพื่อแก้ปัญหาพิมพ์ภาษาไทยแล้วกดไม่ติด
      if (e.code === 'Quote') {
          setShowDebug(prev => !prev);
      }

      keySequence += e.key;
      if (keySequence.length > 5) keySequence = keySequence.substring(1);
      
      if (keySequence === secretCode) {
        debugAPI.current.spawnZombie(99);
        keySequence = ''; 
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      if (keySequence.includes('1237')) {
        debugAPI.current.spawnZombie(100);
        keySequence = '';
        if (!roaringAudio) {
            roaringAudio = new Audio('/theroaring.mp3');
            roaringAudio.loop = true;
        }
        roaringAudio.currentTime = 0;
        roaringAudio.play();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const maxScroll = Math.min(0, VISIBLE_UI_WIDTH - (ALL_ITEMS.length * 80));
    let canvasPosition = canvas.getBoundingClientRect();

    const updateMousePos = (e: MouseEvent) => {
      gameState.mouse.x = e.clientX - canvasPosition.left;
      gameState.mouse.y = e.clientY - canvasPosition.top;
    };
    const clearMousePos = () => { gameState.mouse.x = -100; gameState.mouse.y = -100; };
    const handleResize = () => { canvasPosition = canvas.getBoundingClientRect(); };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', updateMousePos);
    canvas.addEventListener('mouseleave', clearMousePos);

    function resetGame() {
      if (roaringAudio) {
         roaringAudio.pause();
         roaringAudio.currentTime = 0;
      }
      gameState.sun = 800; gameState.score = 0; gameState.frame = 0;
      gameOver = false; isPaused = false;
      gameState.defenders.length = 0; gameState.enemies.length = 0;
      gameState.projectiles.length = 0; gameState.sunDrops.length = 0;
      gameState.explosions.length = 0; gameState.enemyPositions.length = 0;
      gameState.selectedPlant = 0; keySequence = ''; uiScroll = 0;
      gameState.jackpotTimer = 0; 
      animate(); 
    }

    function drawGrid() {
      for (let y = TOP_BAR_HEIGHT; y < canvas!.height; y += CELL_SIZE) {
        for (let x = 0; x < canvas!.width; x += CELL_SIZE) {
          ctx!.fillStyle = ((x / CELL_SIZE + y / CELL_SIZE) % 2 === 0) ? '#a2d149' : '#aad751';
          ctx!.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    function drawHoverEffect() {
      if (gameState.mouse.x > 0 && gameState.mouse.x < canvas!.width && gameState.mouse.y > TOP_BAR_HEIGHT && gameState.mouse.y < canvas!.height) {
        const gridX = gameState.mouse.x - (gameState.mouse.x % CELL_SIZE);
        const gridY = gameState.mouse.y - (gameState.mouse.y % CELL_SIZE);
        const opacity = (Math.sin(gameState.frame * 0.1) + 1) * 0.15 + 0.1; 
        ctx!.fillStyle = gameState.selectedPlant === 99 ? `rgba(255, 0, 0, ${opacity + 0.1})` : `rgba(255, 255, 255, ${opacity})`;
        ctx!.fillRect(gridX, gridY, CELL_SIZE, CELL_SIZE);
      }
    }

    function collision(first: any, second: any) {
      return !(first.x > second.x + second.width || first.x + first.width < second.x ||
               first.y > second.y + second.height || first.y + first.height < second.y);
    }

    function applyDamage(proj: Projectile, enemy: Zombie) {
        let dmg = proj.power;
        if (enemy.type === 99) { dmg *= 0.5; if (enemy.isAdapted) dmg *= 0.2; }
        
        if (enemy.type === 4) {
           if (enemy.isEating) { dmg *= 0.1; } else if (enemy.isBuffed) { dmg *= 1.5; }
        }
        
        enemy.health -= dmg;

        if (!enemy.isBuffed && !enemy.isEating) {
            if (proj.type === 2) enemy.pushTimer = 30; 
            if (proj.type === 3) enemy.slowTimer = 60; 
            if (proj.type === 5) enemy.slowTimer = 120; 
        }
    }

    function handleEntities() {
      // --- วนลูปการทำงานของพืช ---
      for (let i = 0; i < gameState.defenders.length; i++) {
        let d = gameState.defenders[i];
        d.draw(gameState); d.update(gameState);

        // [✅ NEW] ทำลายรถไฟถ้ารถไฟวิ่งทะลุขอบจอไปแล้ว
        if (d.type === 11 && d.x > canvas!.width) {
           d.health = 0;
        }

        // --- เช็คการชนระหว่างพืชและซอมบี้ ---
        for (let j = 0; j < gameState.enemies.length; j++) {
          let e = gameState.enemies[j];
          
          // [✅ NEW] เช็ค !e.isDying ด้วย เพื่อให้ซอมบี้ที่ตายไปแล้วไม่ทำดาเมจและไม่โดนชน
          if (collision(d, e) && !e.isDying) {
            
            // เอฟเฟกต์ Mystery Shadow กินพืช
            if (e.type === 4 && e.isBuffed) {
               e.health = 0; 
               gameState.explosions.push(new Explosion(d.x + d.width/2, d.y + d.height/2));
               gameState.defenders.forEach(def => {
                   if (Math.abs(def.x - d.x) <= CELL_SIZE * 1.5 && Math.abs(def.y - d.y) <= CELL_SIZE * 1.5) def.health = 0;
               });
               continue; 
            }

            // [✅ NEW] ถ้านี่คือรถไฟ (Type 11) ให้พุ่งชนซอมบี้
            if (d.type === 11) {
                e.x += 150; // กระเด็นถอยหลัง Knockback
                e.stunTimer = 120; // ติดมึนงง Stun 2 วิ (120 เฟรม)
                d.health = 0; // ทำลายรถไฟ
            } 
            // พืชทั่วไปโดนซอมบี้กัด
            else if (d.type < 3 || d.type > 5) {
              e.movement = 0; 
              let damage = e.type === 99 ? 1.0 : 0.2;
              if (d.type !== 2) {
                  d.health -= damage;
                  // [✅ NEW] ถ้าเป็น Cactus Tank (Type 10) สะท้อนดาเมจ 50% กลับไปหาซอมบี้
                  if (d.type === 10) {
                      e.health -= damage * 0.5;
                  }
              } 
            }
          }
        }
        
        // ถ้าพืชตาย (เลือดหมด)
        if (d.health <= 0) {
          gameState.enemies.forEach((en: Zombie) => { if(collision(d, en)) en.movement = en.speed; });
          gameState.defenders.splice(i, 1); i--;
        }
      }

      // --- วนลูปกระสุนปืน ---
      for (let i = 0; i < gameState.projectiles.length; i++) {
        let p = gameState.projectiles[i];
        p.update(); p.draw(gameState);
        let hitSomething = false;
        
        for (let j = 0; j < gameState.enemies.length; j++) {
          let e = gameState.enemies[j];
          // [✅ NEW] เช็ค !e.isDying ไม่ยิงใส่บอสที่ติดอนิเมชั่นตายอยู่
          if (collision(p, e) && !e.isDying) {
            if (p.type === 1 || p.type === 4) {
               if (!p.hitEnemies.includes(e)) { p.hitEnemies.push(e); applyDamage(p, e); }
            } else {
               applyDamage(p, e); hitSomething = true; break;
            }
          }
        }
        if (hitSomething || p.x > canvas!.width) { gameState.projectiles.splice(i, 1); i--; }
      }

      // --- วนลูปซอมบี้ ---
      for (let i = 0; i < gameState.enemies.length; i++) {
        let e = gameState.enemies[i];
        e.update(gameState); e.draw(gameState);
        
        if (e.x < 0 && !(e.type === 100 && e.activeSkill === 3)) gameOver = true;
        
        // [✅ NEW] ระบบจัดการฉากตายบอส
        if (e.health <= 0) {
          if (e.type === 100 && !e.isDying) {
             e.isDying = true;
             e.deathTimer = 180; // แสดงฉากตาย 3 วินาที
             e.health = 1; // ล็อคเลือดให้รอดไปก่อนจนกว่าจะจบฉาก
             e.speed = 0;
             e.movement = 0;
          }
        }

        // นับเวลาถอยหลังตอนตาย
        if (e.isDying) {
          e.deathTimer--;
          if (e.deathTimer <= 0) {
             e.health = 0; // หมดเวลายอมให้ตายจริง
             e.isDying = false; // 🛑 [เพิ่มบรรทัดนี้] ปลดล็อกสถานะกำลังตาย เพื่อให้ไปเข้าเงื่อนไขลบตัวละครด้านล่าง
          } else {
             e.health = 1; // บังคับให้รอดระหว่างนับเวลา
          }
        }

        // เงื่อนไขลบซอมบี้ออกจากเกม (ตายจริง)
        if (e.health <= 0 && !e.isDying) { 
          if (e.type === 100 && roaringAudio) {
             roaringAudio.pause(); roaringAudio.currentTime = 0;
          }
          gameState.score += e.type === 99 ? 1000 : (e.type === 100 ? 5000 : e.type * 10 + 10);
          const index = gameState.enemyPositions.indexOf(e.y);
          if(index > -1) gameState.enemyPositions.splice(index, 1);
          gameState.enemies.splice(i, 1); 
          i--;
        }
      }
      
      // การเกิดแบบสุ่มของซอมบี้ปกติเมื่อพ้น Prep time
      if (gameState.frame > PREP_TIME_FRAMES && gameState.frame % 300 === 0) {
        let verticalPosition = Math.floor(Math.random() * 5) * CELL_SIZE + TOP_BAR_HEIGHT + CELL_GAP;
        let rand = Math.random();
        let zombieType = rand < 0.10 ? 5 : rand < 0.25 ? 4 : rand < 0.40 ? 3 : rand < 0.60 ? 2 : rand < 0.80 ? 1 : 0;
        gameState.enemies.push(new Zombie(verticalPosition, zombieType, canvas!.width));
        gameState.enemyPositions.push(verticalPosition);
      }

      for (let i = 0; i < gameState.explosions.length; i++) {
        gameState.explosions[i].update(); gameState.explosions[i].draw(gameState);
        if (gameState.explosions[i].timer > 20) { gameState.explosions.splice(i, 1); i--; }
      }
      for (let i = 0; i < gameState.sunDrops.length; i++) {
        gameState.sunDrops[i].update(); gameState.sunDrops[i].draw(gameState);
        if (gameState.sunDrops[i].lifeTimer > 600) { gameState.sunDrops.splice(i, 1); i--; }
      }
      if (gameState.frame % 500 === 0) gameState.sunDrops.push(new SunDrop(Math.random() * (canvas!.width - 50) + 25, TOP_BAR_HEIGHT + 50));
    }

    function drawDomainEffects() {
      gameState.defenders.forEach((d: Plant) => {
        const T_RISE = 180; const T_WAIT = 300; const T_ATTACK = 600;
        if (d.timer >= (T_RISE + T_WAIT) && d.timer < (T_RISE + T_WAIT + T_ATTACK)) {
          if (d.type === 3) {
            for(let i=0; i<8; i++){
                ctx!.beginPath(); ctx!.moveTo(Math.random() * canvas!.width, Math.random() * canvas!.height + TOP_BAR_HEIGHT);
                ctx!.lineTo(Math.random() * canvas!.width, Math.random() * canvas!.height + TOP_BAR_HEIGHT);
                ctx!.strokeStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 0, 0, 0.8)';
                ctx!.lineWidth = Math.random() * 3 + 1; ctx!.stroke();
            }
          } else if (d.type === 5 && gameState.frame % 15 === 0) {
            ctx!.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx!.fillRect(0, TOP_BAR_HEIGHT, canvas!.width, canvas!.height - TOP_BAR_HEIGHT);
          }
        }
      });
    }

    function drawUI() {
      ctx!.fillStyle = '#4a2f1d'; ctx!.fillRect(0, 0, canvas!.width, TOP_BAR_HEIGHT);
      ctx!.fillStyle = '#ffd700'; ctx!.font = 'bold 24px Arial'; ctx!.textAlign = 'left'; 
      ctx!.fillText(`☀️ ${Math.floor(gameState.sun)}`, 20, 55);
      ctx!.fillStyle = 'white'; ctx!.font = '18px Arial'; ctx!.fillText(`Score: ${Math.floor(gameState.score)}`, 20, 85);

      if (gameState.frame < PREP_TIME_FRAMES) {
        ctx!.fillStyle = '#ff4500'; ctx!.font = 'bold 20px Arial';
        ctx!.fillText(`Zombies in: ${Math.ceil((PREP_TIME_FRAMES - gameState.frame) / 60)}s`, canvas!.width - 320, 55);
      } else {
        ctx!.fillStyle = 'red'; ctx!.font = 'bold 20px Arial'; ctx!.fillText(`Zombies are coming!`, canvas!.width - 320, 55);
      }

      ctx!.fillStyle = isPaused ? '#32cd32' : '#ff4500'; ctx!.fillRect(canvas!.width - 100, 30, 80, 40);
      ctx!.fillStyle = 'white'; ctx!.font = 'bold 14px Arial'; ctx!.textAlign = 'center'; ctx!.fillText(isPaused ? 'RESUME' : 'PAUSE', canvas!.width - 60, 55); ctx!.textAlign = 'left'; 

      ctx!.fillStyle = '#666'; ctx!.fillRect(105, 25, 20, 50); ctx!.fillRect(715, 25, 20, 50);
      ctx!.fillStyle = 'white'; ctx!.fillText('<', 110, 55); ctx!.fillText('>', 720, 55);

      ctx!.save();
      ctx!.beginPath(); ctx!.rect(130, 0, VISIBLE_UI_WIDTH, TOP_BAR_HEIGHT); ctx!.clip(); 

      ALL_ITEMS.forEach((card: ItemCard, index: number) => {
        const cardX = 130 + (index * 80) + uiScroll; 
        const isSelected = gameState.selectedPlant === card.id;
        ctx!.fillStyle = isSelected ? (card.id===99?'#ff4500':'#a2d149') : (card.id===99?'#555':'#8b5a2b'); 
        ctx!.fillRect(cardX, 15, 70, 70);
        ctx!.lineWidth = isSelected ? 3 : 1; ctx!.strokeStyle = isSelected ? '#fff' : '#000'; ctx!.strokeRect(cardX, 15, 70, 70);
        
        ctx!.fillStyle = 'white'; ctx!.font = '10px Arial'; ctx!.fillText(card.name, cardX + 5, 30);
        if (card.id !== 99) { ctx!.fillStyle = '#ffd700'; ctx!.fillText(`${card.cost} ☀️`, cardX + 5, 75); }

        if (card.id === 0) { ctx!.fillStyle = '#32cd32'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 10, 0, Math.PI*2); ctx!.fill(); } 
        else if (card.id === 1) { ctx!.fillStyle = '#ffd700'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 10, 0, Math.PI*2); ctx!.fill(); } 
        else if (card.id === 2) { ctx!.fillStyle = '#ff2400'; ctx!.beginPath(); ctx!.arc(cardX + 30, 52, 6, 0, Math.PI*2); ctx!.fill(); ctx!.beginPath(); ctx!.arc(cardX + 40, 52, 6, 0, Math.PI*2); ctx!.fill(); } 
        else if (card.id === 3) { ctx!.fillStyle = '#5c0000'; ctx!.fillRect(cardX + 25, 45, 20, 15); ctx!.fillStyle = '#0a0a0a'; ctx!.beginPath(); ctx!.moveTo(cardX+15, 45); ctx!.lineTo(cardX+55, 45); ctx!.lineTo(cardX+35, 35); ctx!.fill(); } 
        else if (card.id === 4) { ctx!.fillStyle = '#808080'; ctx!.fillRect(cardX + 25, 45, 20, 15); ctx!.fillRect(cardX + 28, 35, 5, 10); ctx!.fillRect(cardX + 38, 38, 5, 10); } 
        else if (card.id === 5) { ctx!.fillStyle = 'black'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 12, 0, Math.PI*2); ctx!.fill(); ctx!.fillStyle = '#00bfff'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 4, 0, Math.PI*2); ctx!.fill(); }
        else if (card.id === 6) { ctx!.fillStyle = '#8b0000'; ctx!.fillRect(cardX + 25, 40, 20, 20); } 
        else if (card.id === 7) { ctx!.fillStyle = '#111'; ctx!.fillRect(cardX + 25, 40, 20, 20); ctx!.fillStyle='#00ffff'; ctx!.fillRect(cardX + 25, 42, 20, 4); } 
        else if (card.id === 8) { ctx!.fillStyle = '#87ceeb'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 10, 0, Math.PI*2); ctx!.fill(); }
        else if (card.id === 9) { 
            ctx!.fillStyle = '#FFD700'; ctx!.fillRect(cardX + 25, 40, 20, 20); 
            ctx!.fillStyle = '#333'; ctx!.font = '9px Arial'; ctx!.fillText('777', cardX + 27, 54); 
        }
        else if (card.id === 10) { // ไอคอน Cactus Tank
            ctx!.fillStyle = '#228B22'; ctx!.beginPath(); ctx!.arc(cardX + 35, 50, 10, 0, Math.PI*2); ctx!.fill();
            ctx!.fillStyle = '#FF69B4'; ctx!.beginPath(); ctx!.arc(cardX + 35, 40, 4, 0, Math.PI*2); ctx!.fill();
        }
        else if (card.id === 11) { // ไอคอน Train
            ctx!.fillStyle = '#333'; ctx!.fillRect(cardX + 25, 42, 20, 14); 
            ctx!.fillStyle = '#B22222'; ctx!.fillRect(cardX + 25, 38, 10, 10);
            ctx!.fillStyle = '#FFD700'; ctx!.beginPath(); ctx!.moveTo(cardX+45,46); ctx!.lineTo(cardX+50,56); ctx!.lineTo(cardX+45,56); ctx!.fill();
        }
        else if (card.id === 99) { ctx!.fillStyle = '#ccc'; ctx!.fillRect(cardX + 33, 40, 4, 20); ctx!.beginPath(); ctx!.moveTo(cardX + 25, 40); ctx!.lineTo(cardX + 45, 40); ctx!.lineTo(cardX + 35, 55); ctx!.fill(); } 
      });
      ctx!.restore();
    }

    const handleClick = () => {
      if (gameOver) {
        if (gameState.mouse.x >= canvas!.width/2 - 100 && gameState.mouse.x <= canvas!.width/2 + 100 && gameState.mouse.y >= canvas!.height/2 + 20 && gameState.mouse.y <= canvas!.height/2 + 80) resetGame();
        return;
      }
      if (gameState.mouse.x >= canvas!.width - 100 && gameState.mouse.x <= canvas!.width - 20 && gameState.mouse.y >= 30 && gameState.mouse.y <= 70) { isPaused = !isPaused; return; }
      if (isPaused) return;

      for (let i = 0; i < gameState.sunDrops.length; i++) {
        let sd = gameState.sunDrops[i];
        if (Math.hypot(gameState.mouse.x - sd.x, gameState.mouse.y - sd.y) < sd.radius + 15) { gameState.sun += sd.value; gameState.sunDrops.splice(i, 1); return; }
      }

      if (gameState.mouse.y < TOP_BAR_HEIGHT) {
        if (gameState.mouse.x >= 105 && gameState.mouse.x <= 125) { uiScroll = Math.min(uiScroll + 80, 0); return; }
        if (gameState.mouse.x >= 715 && gameState.mouse.x <= 735) { uiScroll = Math.max(uiScroll - 80, maxScroll); return; }
        if (gameState.mouse.x >= 130 && gameState.mouse.x <= 130 + VISIBLE_UI_WIDTH) {
           const index = Math.floor((gameState.mouse.x - 130 - uiScroll) / 80);
           if (index >= 0 && index < ALL_ITEMS.length) gameState.selectedPlant = ALL_ITEMS[index].id;
        }
        return;
      }

      const gridPositionX = gameState.mouse.x - (gameState.mouse.x % CELL_SIZE) + CELL_GAP;
      const gridPositionY = gameState.mouse.y - (gameState.mouse.y % CELL_SIZE) + CELL_GAP;
      if (gridPositionY < TOP_BAR_HEIGHT || gridPositionY >= canvas!.height || gridPositionX >= canvas!.width) return;
      
      for (let i = 0; i < gameState.defenders.length; i++) {
        if (gameState.defenders[i].x === gridPositionX && gameState.defenders[i].y === gridPositionY) {
          if (gameState.selectedPlant === 99) {
            if (gameState.defenders[i].type === 5) gameState.enemies.forEach((en: Zombie) => { en.movement = en.speed; });
            gameState.defenders.splice(i, 1); gameState.selectedPlant = 0; return;
          }
          if (gameState.defenders[i].type === 7 && gameState.defenders[i].purpleCooldown <= 0 && gameState.selectedPlant !== 99) {
             gameState.projectiles.push(new Projectile(gameState.defenders[i].x + 70, gameState.defenders[i].y + 5, 4));
             gameState.defenders[i].purpleCooldown = 900; return;
          }
          return;
        }
      }
      
      if (gameState.selectedPlant !== 99) {
        const cardInfo = ALL_ITEMS.find((c: ItemCard) => c.id === gameState.selectedPlant);
        if (cardInfo && gameState.sun >= cardInfo.cost) {
          gameState.defenders.push(new Plant(gridPositionX, gridPositionY, gameState.selectedPlant));
          gameState.sun -= cardInfo.cost;
        }
      }
    };
    
    canvas.addEventListener('click', handleClick);

    function animate() {
      if (gameOver) return; 
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawGrid();

      if (!isPaused) {
        if (gameState.jackpotTimer > 0) {
            gameState.jackpotTimer--;
        }

        drawHoverEffect(); handleEntities(); drawDomainEffects(); gameState.frame++;
      } else {
        gameState.defenders.forEach((d: Plant) => d.draw(gameState)); 
        gameState.enemies.forEach((e: Zombie) => e.draw(gameState));
        gameState.projectiles.forEach((p: Projectile) => p.draw(gameState)); 
        gameState.sunDrops.forEach((s: SunDrop) => s.draw(gameState)); 
        gameState.explosions.forEach((ex: Explosion) => ex.draw(gameState));
        ctx!.fillStyle = 'rgba(0, 0, 0, 0.4)'; ctx!.fillRect(0, TOP_BAR_HEIGHT, canvas!.width, canvas!.height - TOP_BAR_HEIGHT);
        ctx!.fillStyle = 'white'; ctx!.font = 'bold 50px Arial'; ctx!.textAlign = 'center'; ctx!.fillText('PAUSED', canvas!.width/2, canvas!.height/2 + TOP_BAR_HEIGHT/2); ctx!.textAlign = 'left';
      }
      
      drawUI();
      
      if (!gameOver) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx!.fillStyle = 'rgba(0,0,0,0.8)'; ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = 'red'; ctx!.font = 'bold 60px Arial'; ctx!.textAlign = 'center'; ctx!.fillText('Zombies ate your brains!', canvas!.width/2, canvas!.height/2 - 30);
        ctx!.fillStyle = '#a2d149'; ctx!.fillRect(canvas!.width/2 - 100, canvas!.height/2 + 20, 200, 60);
        ctx!.lineWidth = 3; ctx!.strokeStyle = 'white'; ctx!.strokeRect(canvas!.width/2 - 100, canvas!.height/2 + 20, 200, 60);
        ctx!.fillStyle = 'white'; ctx!.font = 'bold 24px Arial'; ctx!.fillText('RESTART', canvas!.width/2, canvas!.height/2 + 58); ctx!.textAlign = 'left';
      }
    }
    
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown); 
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', updateMousePos);
      canvas.removeEventListener('mouseleave', clearMousePos);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gray-900 overflow-hidden">
      <div className="relative">
        <canvas ref={canvasRef} width={900} height={600} className="shadow-2xl border-4 border-gray-700" />
      </div>

      {/* --- ส่วนของ Debug Menu ที่ลากได้ --- */}
      {showDebug && (
        <div 
          style={{ left: menuPos.x, top: menuPos.y }}
          className="fixed w-[260px] bg-black/95 text-white p-4 border border-green-500 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] flex flex-col gap-3 z-[100]"
        >
          {/* แถบด้านบนสำหรับจับลาก */}
          <div 
            className="border-b border-green-600 pb-2 mb-1 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
          >
             <h3 className="text-center font-bold text-green-400 text-lg">⚙️ Debug Menu</h3>
             <p className="text-[10px] text-gray-400 text-center mt-1">กด ' เพื่อแสดง/ซ่อน | ลากที่นี่เพื่อย้าย</p>
          </div>
          
          <button onClick={() => debugAPI.current.addSun(1000)} className="bg-yellow-600 hover:bg-yellow-500 transition-colors py-1.5 rounded text-sm font-semibold shadow-md">
              +1000 Sun ☀️
          </button>
          
          <button onClick={() => debugAPI.current.skipPrepTime()} className="bg-blue-600 hover:bg-blue-500 transition-colors py-1.5 rounded text-sm font-semibold shadow-md">
              Skip Prep Time ⏩
          </button>
          
          <button onClick={() => debugAPI.current.triggerJackpot()} className="bg-emerald-600 hover:bg-emerald-500 transition-colors py-1.5 rounded text-sm font-semibold shadow-md">
              Hakari Jackpot 🎰
          </button>
          
          <div className="h-[1px] bg-gray-700 my-1 w-full"></div>
          
          {/* ส่วนสำหรับเลือกเสกซอมบี้ที่ต้องการ */}
          <p className="text-xs text-center text-gray-300 -mb-1">เลือกรหัสซอมบี้ที่ต้องการเสก:</p>
          <div className="flex gap-2">
              <select 
                  value={customZombieType} 
                  onChange={(e) => setCustomZombieType(Number(e.target.value))}
                  className="bg-gray-800 text-white text-sm border border-gray-600 rounded p-1 flex-1 outline-none cursor-pointer"
              >
                  <option value={0}>0: Normal</option>
                  <option value={1}>1: Conehead</option>
                  <option value={2}>2: Buckethead</option>
                  <option value={3}>3: Runner</option>
                  <option value={4}>4: Mystery</option>
                  <option value={5}>5: Jane Juliet</option>
                  <option value={10}>10: Spinosaurus</option>
                  <option value={99}>99: Mahoraga</option>
                  <option value={100}>100: Roaring Knight</option>
                  <option value={102}>102: Heian Sukuna</option>
              </select>
              <button 
                  onClick={() => debugAPI.current.spawnZombie(customZombieType)} 
                  className="bg-purple-700 hover:bg-purple-600 border border-purple-500 transition-colors px-3 py-1 rounded text-sm font-bold"
              >
                  เสก! 🧟
              </button>
          </div>

          <div className="h-[1px] bg-gray-700 my-1 w-full"></div>

          <button onClick={() => debugAPI.current.killAllZombies()} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 mt-1 rounded text-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              Kill All Zombies 💥
          </button>
        </div>
      )}

    </div>
  );
}