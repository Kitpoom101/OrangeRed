"use client";
import Link from "next/link";
import Banner from "@/component/ui/Banner";
import FeaturedShop from "@/component/Shop/FeautureShop";
import { useState, useEffect, useRef } from "react";
import { ShopItem } from "@/interface";
import Image from "next/image";

// รายชื่อไฟล์รูป Jumpscare ที่ต้องการสุ่ม (เอาไฟล์ไปใส่ในโฟลเดอร์ public)
const jumpscareImages = [
  "/GUILTY.png",
  "/Logo.jpg", // เปลี่ยนชื่อให้ตรงกับไฟล์ของคุณ
  "/istockphoto-1582676945-640x640.jpg", // เพิ่มกี่รูปก็ได้ตามต้องการ
  "/roblox-twerk.gif",
];

export default function Home() {
  const [allShops, setAllShops] = useState<ShopItem[]>([]);
  
  const [isGuiltyVisible, setIsGuiltyVisible] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);
  
  // State สำหรับเก็บรูปภาพที่ถูกสุ่มมาแสดงในรอบปัจจุบัน
  const [currentJumpscare, setCurrentJumpscare] = useState(jumpscareImages[0]);
  
  // State สำหรับตำแหน่งปุ่ม Terms of Service
  const [tosPosition, setTosPosition] = useState({ x: 0, y: 0 });
  
  const guiltyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops`
        );
        const { data } = await response.json();
        if (data) setAllShops(data);
      } catch (err) {
        console.error("Failed to fetch shops", err);
      }
    };
    fetchShops();

    return () => {
      if (guiltyTimeoutRef.current) {
        clearTimeout(guiltyTimeoutRef.current);
      }
    };
  }, []);

  const triggerGuilty = () => {
    const randomIndex = Math.floor(Math.random() * jumpscareImages.length);
    setCurrentJumpscare(jumpscareImages[randomIndex]);

    const audio = new Audio("/vineboom.mp3");
    audio.currentTime = 0; 
    audio.play();

    if (guiltyTimeoutRef.current) {
      clearTimeout(guiltyTimeoutRef.current);
    }

    setIsGuiltyVisible(true); 
    setIsGrayscale(true);     

    guiltyTimeoutRef.current = setTimeout(() => {
      setIsGuiltyVisible(false); 
      setIsGrayscale(false);     
      
      guiltyTimeoutRef.current = null; 
    }, 1000); 
  };

  // ฟังก์ชันสุ่มหนีเมาส์ (โอกาส 50%)
  const handleTosHover = () => {
    if (Math.random() < 0.9) {
      // สุ่มแกน X ให้ขยับไปทางซ้าย (ค่าติดลบ 50 ถึง 650)
      const randomX = -(Math.floor(Math.random() * 600) + 50);
      // สุ่มแกน Y ให้ขยับลงล่าง (ค่าบวก 20 ถึง 400)
      const randomY = Math.floor(Math.random() * 400) + 20;
      
      setTosPosition({ x: randomX, y: randomY });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-150 ease-in-out 
        ${isGuiltyVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Image
          src={currentJumpscare}
          alt="JUMPSCARE"
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      <div
        className={`flex flex-col min-h-screen transition-all duration-150 ease-in-out ${
          isGrayscale ? "grayscale" : ""
        }`}
      >
        <div className="w-full py-3 px-8 border-b border-gray-800/50 bg-[#0f172a]/30 flex justify-end items-center relative z-50">
          {/* เพิ่ม Event onMouseEnter และใส่ Style ขยับตาม State */}
          <Link 
            href="/termofservice" 
            onMouseEnter={handleTosHover}
            style={{ transform: `translate(${tosPosition.x}px, ${tosPosition.y}px)` }}
            className="group flex items-center gap-2 transition-transform duration-300 ease-out"
          >
            <span className="text-[10px] font-serif tracking-[0.2em] uppercase text-gray-400 transition-colors group-hover:text-blue-300 bg-[#0f172a] px-2 py-1 rounded">
              Terms of Service
            </span>
          </Link>
        </div>

        <main className="flex-grow p-8 space-y-12">
          <div
            onClick={triggerGuilty}
            className="inline-block cursor-pointer transition-transform hover:scale-105 active:scale-95 active:rotate-2"
            title="DON'T CLICK!"
          >
            <Image
              src={"/Decoration/wip.jpg"}
              alt="wip"
              width={200}
              height={400}
              className="shadow-lg"
            />
          </div>{" "}
          
          <Banner />
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-end">
              <Link href={"/shop"} className="group">
                <h1 className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-gray-400 transition-all duration-500 group-hover:text-blue-300">
                  Browse All Shops
                  <span className="block h-[1px] w-0 bg-blue-300 transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
                </h1>
              </Link>
            </div>

            <FeaturedShop shops={allShops} />
          </div>
        </main>

        <footer className="w-full py-12 px-8 border-t border-gray-800/50 bg-[#0f172a]/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-sm font-serif tracking-widest uppercase text-gray-200">
                JobPhobia Massage
              </h3>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                © 2026 Digital Wellness For Job Phobic People
              </p>
            </div>
            <div className="flex gap-8">
              {["Privacy", "Terms", "Contact", "Support"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[9px] uppercase tracking-[0.3em] text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}