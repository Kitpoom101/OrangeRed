import { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react';
import useChat from '@/libs/chat/useChat';
import { useSession } from 'next-auth/react';
import ChatBox from './ChatBox';

interface ChatProps {
    roomId: string;
}

function ChatRoom({ roomId }: ChatProps) {
    const [input, setInput] = useState<string>('');
    const { data: session } = useSession();
    const { messages, loading, error, sendMessage, editMessage, deleteMessage } = useChat(
        roomId, 
        session?.user?.token, 
        { _id: session?.user?._id, name: session?.user?.name }
    );
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Easter Egg States ---
    const [showSecretMenu, setShowSecretMenu] = useState(false);
    const [isSkullExploding, setIsSkullExploding] = useState(false);
    const [isGrayscale, setIsGrayscale] = useState(false); 
    const keyBuffer = useRef<string>(""); 

    // 🌟 States สำหรับคุมจำนวนโครงกระดูก
    const [showSkullConfig, setShowSkullConfig] = useState(false);
    const [skullCount, setSkullCount] = useState<number>(1);

    // --- Secret Code Listener (12875590) ---
    useEffect(() => {
        const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
            keyBuffer.current = (keyBuffer.current + e.key).slice(-8);
            
            if (keyBuffer.current === "12875590") {
                setShowSecretMenu(true);
                // 🌟 รีเซ็ตจำนวนโครงกระดูกเป็น 1 ทุกครั้งที่เปิดหน้าต่างลับ
                setSkullCount(1);
                setShowSkullConfig(false); // ซ่อนช่องกรอกให้กลับไปเป็นปุ่ม + เหมือนเดิม
                keyBuffer.current = ""; 
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // --- Function to trigger the Skull Meme ---
    const triggerSkullMeme = () => {
        setShowSecretMenu(false); 
        setIsGrayscale(false);    
        setIsSkullExploding(true); 
        
        // คำนวณเวลาที่ใช้ทั้งหมด
        const baseAnimTime = 1000;
        const delayPerSkull = 200;
        const totalWaitTime = baseAnimTime + ((skullCount - 1) * delayPerSkull);

        // 🌟 ให้ภาพลูกตาโผล่ขึ้นมา "ก่อน" โครงกระดูกจะวิ่งสุดจอ (เร็วขึ้น 400ms)
        // ใช้ Math.max(0, ...) เพื่อป้องกันไม่ให้เวลาติดลบในกรณีที่ปรับเลขเยอะเกินไป
        const showEyeTime = Math.max(0, totalWaitTime - 400);

        // 1. ตัวตั้งเวลาสำหรับ "ลูกตา 👀 และจอขาวดำ"
        setTimeout(() => {
            setIsGrayscale(true);

            // รอ 1.5 วินาที แล้วปิดลูกตา/จอขาวดำกลับเป็นปกติ
            setTimeout(() => {
                setIsGrayscale(false);
            }, 1500);
        }, showEyeTime);

        // 2. ตัวตั้งเวลาปิด "โครงกระดูก" (ปิดเมื่อโครงกระดูกตัวสุดท้ายวิ่งพ้นจอไปแล้วจริงๆ)
        setTimeout(() => {
            setIsSkullExploding(false); 
        }, totalWaitTime);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (): Promise<void> => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
        
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-slate-400">
            <p className="animate-pulse">Loading messages...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-red-400">
            <p>Error: {error}</p>
        </div>
    );

    return (
        <div className={`flex flex-col h-screen w-full bg-slate-900 overflow-hidden font-sans relative transition-all duration-300 ${isGrayscale ? 'grayscale' : ''}`}>
            
            {/* CSS for the Skull sliding animation */}
            <style>{`
                @keyframes slideSkull {
                    0% { transform: translateX(-100vw); }
                    100% { transform: translateX(100vw); }
                }
                .animate-slideSkull {
                    animation: slideSkull 1s linear both; 
                }
            `}</style>

            {/* Header */}
            <div className="bg-slate-950 px-5 py-4 text-white border-b border-slate-800 z-10 shrink-0 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-slate-100 tracking-wide">Support Chat</h3>
                    <p className="text-xs text-slate-400 font-light mt-0.5">We reply immediately</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            </div>

            {/* Message display area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 relative">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 text-sm font-light">
                        No messages yet. Start chatting now!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatBox 
                            key={msg._id} 
                            msg={msg} 
                            editMessage={editMessage} 
                            deleteMessage={deleteMessage} 
                            uid={session?.user?._id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2 items-end shrink-0 z-10 pb-safe">
                <textarea
                    ref={textareaRef}
                    className="flex-1 bg-slate-800 hover:bg-slate-700/50 focus:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 resize-none overflow-y-auto"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    value={input}
                    rows={1}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
                <button 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:hover:bg-blue-600 mb-0.5 shrink-0" 
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    Send
                </button>
            </div>

            {/* ========================================= */}
            {/* 🥚 EASTER EGG COMPONENTS 🥚 */}
            {/* ========================================= */}
            
            {/* 1. Secret Pop-up Menu - Windows XP Theme */}
            {showSecretMenu && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 font-[Tahoma,sans-serif]">
                    
                    <div className="w-full max-w-xs bg-[#0053e5] rounded-t-[8px] rounded-b-[3px] p-[3px] shadow-[2px_2px_10px_rgba(0,0,0,0.5)]">

                        {/* Title Bar */}
                        <div className="flex items-center justify-between px-2 py-[2px] bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#0058ee] rounded-t-[5px]">
                            <span className="text-white text-sm font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)]">
                                Secret Menu
                            </span>
                            <button
                                onClick={() => setShowSecretMenu(false)}
                                className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-[#ff8c73] to-[#e54013] hover:brightness-110 active:brightness-90 text-white rounded-[3px] border border-white/60 text-[10px] font-bold shadow-sm"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Window Content */}
                        <div className="bg-[#ECE9D8] border border-white p-6 flex flex-col items-center text-center">
                            <h3 className="text-lg font-bold text-black mb-2">
                                Secret Found
                            </h3>
                            
                            {/* Skull Button */}
                            <button
                                onClick={triggerSkullMeme}
                                className="text-6xl hover:scale-110 active:scale-95 transition"
                            >
                                <img 
                                    src="/skull.jpg" 
                                    alt="SkullHead" 
                                />
                            </button>

                            {/* Config ปุ่ม + และช่องใส่จำนวนโครงกระดูก */}
                            <div className="mt-2 min-h-[30px] flex items-center justify-center w-full">
                                {!showSkullConfig ? (
                                    <button 
                                        onClick={() => setShowSkullConfig(true)}
                                        className="text-gray-400 hover:text-gray-800 text-lg font-bold px-2 transition-colors"
                                        title="ตั้งค่าจำนวนโครงกระดูก"
                                    >
                                        +
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-700 font-semibold mt-1">จำนวน:</span>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={skullCount}
                                            onChange={(e) => setSkullCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 px-1 py-0.5 border border-gray-400 rounded text-black text-xs outline-none focus:border-blue-500 text-center"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowSecretMenu(false)}
                                className="mt-4 px-6 py-1 bg-gradient-to-b from-white to-gray-300 border border-gray-500 rounded-[3px] hover:border-[#0053e5] hover:shadow-[inset_0_0_0_1px_#85c2ff] text-black text-sm shadow-sm transition-all active:from-gray-300 active:to-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Sliding Skeleton GIF */}
            {isSkullExploding && (
                <div className="fixed inset-0 z-[200] pointer-events-none flex items-center overflow-hidden">
                    {Array.from({ length: skullCount }).map((_, idx) => (
                        <img 
                            key={idx}
                            src="/skeleton-run.gif" 
                            alt={`Running Skeleton ${idx}`} 
                            className="absolute animate-slideSkull h-1/2 object-contain scale-x-[-1] drop-shadow-[10px_10px_15px_rgba(0,0,0,0.5)]"
                            style={{ animationDelay: `${idx * 0.2}s` }} 
                        />
                    ))}
                </div>
            )}

            {/* 3. Big Eyes Emoji Overlay 👀 */}
            {isGrayscale && (
                <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center bg-transparent transition-opacity duration-300">
                    <div className="text-[15rem] md:text-[25rem] drop-shadow-2xl">
                        <img 
                            src="/liecmat811-eye811.png" 
                            alt="LookAwayEyesSkeleton" 
                            className="animate-pulse" 
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default ChatRoom;