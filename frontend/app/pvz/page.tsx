import PvzGame from '@/component/PvzGame/PvzGame'; // หรือปรับ path ตามตำแหน่งที่แท้จริง

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        เมึงเจอหน้านี้ได้ไงวะ สาสสสสสส
      </h1>
      
      {/* เรียกใช้งาน Component เกมตรงนี้ */}
      <PvzGame />
      
      <p className="text-gray-400 mt-4">
        วางต้นไม้โง่ว ๆ ราคา 100 บาทพอไอควาย
      </p>
    </main>
  );
}