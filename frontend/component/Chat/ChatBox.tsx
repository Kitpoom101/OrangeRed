import { Message } from "@/libs/chat/useChat";
import { useEffect, useState, KeyboardEvent, useRef } from "react";

interface ChatBoxProps {
    editMessage: (id: string, text: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    msg: Message;
    uid?: string;
}

export default function ChatBox({ msg, editMessage, deleteMessage, uid }: ChatBoxProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(msg.text);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isMe = msg.user._id === uid;

    const handleSave = async () => {
        if (!text.trim()) return;
        await editMessage(msg._id, text);
        setIsEditing(false);
    };

    const handleDeleteConfirm = async () => {
        await deleteMessage(msg._id);
        setShowDeletePopup(false);
    };

    useEffect(() => {
        setText(msg.text);
    }, [msg.text]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <>
            {/* เพิ่ม group, p-2 (padding), และ hover effect (พื้นหลัง+ลอยขึ้น) ที่ชั้นนอกสุด */}
            <div className={`group flex w-full p-2 rounded-2xl transition-all duration-300 ease-out hover:bg-slate-800/40 hover:-translate-y-1 hover:shadow-lg ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                    
                    {/* Sender name */}
                    <span className={`text-[11px] font-medium mb-1 px-1 tracking-wide transition-colors ${isMe ? "text-blue-400 group-hover:text-blue-300" : "text-slate-500 group-hover:text-slate-400"}`}>
                        {msg.user.name}
                    </span>

                    {isEditing ? (
                        /* Dark mode edit message */
                        <div className="flex flex-col bg-slate-800 border border-slate-700 p-2.5 rounded-2xl shadow-md w-full min-w-[200px]">
                            <input
                                ref={inputRef}
                                className="bg-transparent border-b border-slate-600 px-1 py-1 text-sm text-slate-100 outline-none focus:border-blue-400 mb-3 w-full transition-colors"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex justify-end gap-2 text-xs font-medium">
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors">Cancel</button>
                                <button onClick={handleSave} className="bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-500 transition-colors shadow-sm">Save</button>
                            </div>
                        </div>
                    ) : (
                        /* Normal message display mode */
                        <div className="relative"> {/* เอา group เดิมออก เพราะไปใช้ที่ div นอกสุดแล้ว */}
                            <div 
                                className={`px-4 py-2.5 text-sm shadow-sm transition-colors duration-300
                                    ${isMe 
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm group-hover:bg-blue-500" 
                                        : "bg-slate-800 text-slate-100 border border-slate-700/50 rounded-2xl rounded-tl-sm group-hover:border-slate-600 group-hover:bg-slate-700/80" 
                                    }
                                `}
                            >
                                <span className="break-words leading-relaxed">{msg.text}</span>
                            </div>

                            {/* Dark Mode Edit / Delete buttons (จะโผล่มาเมื่อชี้ที่บรรทัดข้อความ) */}
                            {isMe && (
                                <div className="absolute top-0 -left-[4.5rem] hidden group-hover:flex gap-1 bg-slate-800 shadow-lg border border-slate-700 rounded-full px-2 py-1.5 z-10">
                                    <button
                                        title="Edit"
                                        className="text-slate-400 hover:text-blue-400 text-xs px-1.5 transition-transform hover:scale-110 active:scale-95"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        title="Delete"
                                        className="text-slate-400 hover:text-red-400 text-xs px-1.5 transition-transform hover:scale-110 active:scale-95"
                                        onClick={() => setShowDeletePopup(true)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom UI Popup for delete confirmation */}
            {showDeletePopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Delete this message?</h3>
                        <p className="text-sm text-slate-400 mb-6">You will not be able to recover this message after deleting it.</p>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowDeletePopup(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}