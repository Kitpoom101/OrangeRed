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
        <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden font-sans">
            
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
        </div>
    );
}

export default ChatRoom;