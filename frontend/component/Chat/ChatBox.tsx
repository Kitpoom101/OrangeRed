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
    const [showDeletePopup, setShowDeletePopup] = useState(false); // Add state to control delete popup
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
            <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                    
                    {/* Sender name */}
                    <span className={`text-[11px] font-medium mb-1 px-1 tracking-wide ${isMe ? "text-blue-400" : "text-slate-500"}`}>
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
                        <div className="group relative">
                            <div 
                                className={`px-4 py-2.5 text-sm shadow-sm
                                    ${isMe 
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                                        : "bg-slate-800 text-slate-100 border border-slate-700/50 rounded-2xl rounded-tl-sm" 
                                    }
                                `}
                            >
                                <span className="break-words leading-relaxed">{msg.text}</span>
                            </div>

                            {/* Dark Mode Edit / Delete buttons */}
                            {isMe && (
                                <div className="absolute top-0 -left-[4.5rem] hidden group-hover:flex gap-1 bg-slate-800 shadow-lg border border-slate-700 rounded-full px-2 py-1.5 z-10">
                                    <button
                                        title="Edit"
                                        className="text-slate-400 hover:text-blue-400 text-xs px-1.5 transition-colors"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        title="Delete"
                                        className="text-slate-400 hover:text-red-400 text-xs px-1.5 transition-colors"
                                        onClick={() => setShowDeletePopup(true)} // Open Popup instead of confirm()
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