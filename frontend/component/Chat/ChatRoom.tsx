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
    const keyBuffer = useRef<string>(""); // Buffer to store recent keystrokes

    // --- Secret Code Listener (12875590) ---
    useEffect(() => {
        const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
            // Append the latest key and keep only the last 8 characters
            keyBuffer.current = (keyBuffer.current + e.key).slice(-8);
            
            // Check if it matches the secret code
            if (keyBuffer.current === "12875590") {
                setShowSecretMenu(true);
                keyBuffer.current = ""; // Reset after unlocking
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // --- Function to trigger the Skull Meme ---
    const triggerSkullMeme = () => {
        setShowSecretMenu(false); // Close the menu
        setIsSkullExploding(true); // Start the animation
        
        // Hide the animation after 3 seconds
        setTimeout(() => {
            setIsSkullExploding(false);
        }, 3000);
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

    // Fullscreen loading state
    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-slate-400">
            <p className="animate-pulse">Loading messages...</p>
        </div>
    );
    
    // Fullscreen error state
    if (error) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-red-400">
            <p>Error: {error}</p>
        </div>
    );

    return (
        // Use h-screen and w-full for 100% full screen, removed borders and shadows
        <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden font-sans relative">
            
            {/* CSS for the Skull sliding animation */}
            <style>{`
                @keyframes slideSkull {
                    0% { transform: translateX(-100vw); }
                    100% { transform: translateX(100vw); }
                }
                .animate-slideSkull {
                    /* Changed to 1.5s to make it run faster */
                    animation: slideSkull 1s linear forwards; 
                }
            `}</style>

            {/* Header */}
            <div className="bg-slate-950 px-5 py-4 text-white border-b border-slate-800 z-10 shrink-0 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-slate-100 tracking-wide">Support Chat</h3>
                    <p className="text-xs text-slate-400 font-light mt-0.5">We reply immediately</p>
                </div>
                {/* Small blue online status indicator for a nice touch */}
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
                    
                    {/* Window Container (ขอบสีน้ำเงินโค้งมนสไตล์ Luna) */}
                    <div className="w-full max-w-xs bg-[#0053e5] rounded-t-[8px] rounded-b-[3px] p-[3px] shadow-[2px_2px_10px_rgba(0,0,0,0.5)]">

                        {/* Title Bar */}
                        <div className="flex items-center justify-between px-2 py-[2px] bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#0058ee] rounded-t-[5px]">
                            <span className="text-white text-sm font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)]">
                                Secret Menu
                            </span>
                            {/* XP Red Close Button */}
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

                            {/* <p className="text-sm text-gray-800 mb-6">
                                You discovered a secret menu. Click the skull for a reward.
                            </p> */}

                            {/* Skull Button */}
                            <button
                                onClick={triggerSkullMeme}
                                className="text-6xl hover:scale-110 active:scale-95 transition"
                                // title="Do not click!"
                            >
                                <img 
                        src="/skull.jpg" 
                        alt="SkullHead" 
                        
                    />
                            </button>

                            {/* Close Button (XP Standard Button Style) */}
                            <button
                                onClick={() => setShowSecretMenu(false)}
                                className="mt-6 px-6 py-1 bg-gradient-to-b from-white to-gray-300 border border-gray-500 rounded-[3px] hover:border-[#0053e5] hover:shadow-[inset_0_0_0_1px_#85c2ff] text-black text-sm shadow-sm transition-all active:from-gray-300 active:to-gray-200"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* 2. Sliding Skeleton GIF (Flipped, faster, black shadow) */}
            {isSkullExploding && (
                <div className="fixed inset-0 z-[200] pointer-events-none flex items-center overflow-hidden">
                    <img 
                        src="/skeleton-run.gif" 
                        alt="Running Skeleton" 
                        className="animate-slideSkull h-1/2 object-contain scale-x-[-1] drop-shadow-[10px_10px_15px_rgba(0,0,0,0.5)]"
                    />
                </div>
            )}

        </div>
    );
}

export default ChatRoom;