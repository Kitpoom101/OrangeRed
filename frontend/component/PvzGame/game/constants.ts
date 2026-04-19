export const CELL_SIZE = 100;
export const CELL_GAP = 3;
export const TOP_BAR_HEIGHT = 100;
export const PREP_TIME_FRAMES = 900;
export const VISIBLE_UI_WIDTH = 560;

// กำหนดประเภทของการ์ด เพื่อไม่ให้ TypeScript แจ้งเตือน Any
export interface ItemCard {
  id: number;
  name: string;
  cost: number;
  color: string;
}

export const PLANT_CARDS: ItemCard[] = [
  { id: 0, name: 'Peashooter', cost: 100, color: '#32cd32' },
  { id: 1, name: 'Sunflower', cost: 50, color: '#ffd700' },
  { id: 2, name: 'CherryBomb', cost: 150, color: '#ff4500' },
  { id: 3, name: 'Sukuna DE', cost: 300, color: '#8b0000' },
  { id: 4, name: 'Mahito DE', cost: 350, color: '#4b0082' },
  { id: 5, name: 'Gojo DE', cost: 400, color: '#000080' },
  { id: 6, name: 'Sukuna', cost: 250, color: '#ff0000' }, 
  { id: 7, name: 'Gojo', cost: 350, color: '#00ffff' },
  { id: 8, name: 'Ice Shooter', cost: 175, color: '#87ceeb' },
  { id: 9, name: 'Hakari 888', cost: 100, color: '#00ff00' },
  { id: 10, name: 'Cactus', cost: 150, color: '#7ea653' },
  { id: 11, name: 'Train', cost: 200, color: '#b744ff' },
];

export const ALL_ITEMS: ItemCard[] = [...PLANT_CARDS, { id: 99, name: 'Shovel', cost: 0, color: '#555' }];

export interface IGameState {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  frame: number;
  sun: number;
  score: number;
  defenders: any[];
  enemies: any[];
  projectiles: any[];
  sunDrops: any[];
  explosions: any[];
  enemyPositions: number[];
  mouse: { x: number, y: number, clicked: boolean };
  selectedPlant: number;
  mysteryShadowImg: HTMLImageElement;
  jackpotTimer: number; // เก็บเวลาบัพที่เหลือ
}