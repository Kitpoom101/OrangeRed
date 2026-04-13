'use client'
import { Message, HistoryEntry } from "@/libs/chat/useChat";
import { useEffect, useState, KeyboardEvent, useRef } from "react";

interface ChatBoxProps {
    editMessage: (id: string, text: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    msg: Message;
    uid?: string;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function Avatar({ user }: { user: { name?: string; profilePicture?: string | null } }) {
    const [imgError, setImgError] = useState(false);

    if (user.profilePicture && !imgError) {
        return (
            <img
                src={user.profilePicture}
                alt={user.name ?? ''}
                className="w-8 h-8 rounded-full object-cover shrink-0"
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-semibold shrink-0">
            {user.name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

export default function ChatBox({ msg, editMessage, deleteMessage, uid, isFirstInGroup, isLastInGroup }: ChatBoxProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(msg.text);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    const isMe = msg.user._id === uid;
    const isDeleted = !!msg.deleted;
    const hasHistory = !isDeleted && msg.history && msg.history.length > 0;

    // Bubble corner style: tail only on the last message in a group
    const bubbleClass = isMe
        ? `bg-blue-600 text-white group-hover:bg-blue-500 ${isLastInGroup ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl'}`
        : `bg-slate-800 text-slate-100 border border-slate-700/50 group-hover:border-slate-600 group-hover:bg-slate-700/80 ${isLastInGroup ? 'rounded-2xl rounded-tl-sm' : 'rounded-2xl'}`;

    const handleSave = async () => {
        if (!text.trim()) return;
        await editMessage(msg._id, text);
        setIsEditing(false);
    };

    const handleDeleteConfirm = async () => {
        await deleteMessage(msg._id);
        setShowDeletePopup(false);
    };

    useEffect(() => { setText(msg.text); }, [msg.text]);
    useEffect(() => { if (isEditing) inputRef.current?.focus(); }, [isEditing]);

    useEffect(() => {
        if (!showHistory) return;
        const handler = (e: MouseEvent) => {
            if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
                setShowHistory(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showHistory]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <>
            <div className={`group flex w-full px-3 items-end gap-2
                ${isMe ? 'justify-end' : 'justify-start'}
                ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}
            `}>
                {/* Avatar or spacer for others' messages */}
                {!isMe && (
                    isLastInGroup
                        ? <Avatar user={msg.user} />
                        : <div className="w-8 shrink-0" />
                )}

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {isDeleted ? (
                        <div className={`px-4 py-2.5 text-sm rounded-2xl border border-dashed ${isMe ? 'border-blue-800/50' : 'border-slate-700/50'}`}>
                            <span className="italic text-slate-500">This message was deleted</span>
                        </div>
                    ) : isEditing ? (
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
                        <div className="relative">
                            <div className={`px-4 py-2.5 text-sm shadow-sm transition-colors duration-200 ${bubbleClass}`}>
                                <span className="break-words leading-relaxed">{msg.text}</span>
                            </div>

                            {/* Edit / Delete buttons */}
                            {isMe && !isDeleted && (
                                <div className="absolute top-0 -left-[4.5rem] hidden group-hover:flex gap-1 bg-slate-800 shadow-lg border border-slate-700 rounded-full px-2 py-1.5 z-10">
                                    <button title="Edit" className="text-slate-400 hover:text-blue-400 text-xs px-1.5 transition-transform hover:scale-110 active:scale-95" onClick={() => setIsEditing(true)}>✏️</button>
                                    <button title="Delete" className="text-slate-400 hover:text-red-400 text-xs px-1.5 transition-transform hover:scale-110 active:scale-95" onClick={() => setShowDeletePopup(true)}>🗑️</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timestamp + edited badge — only on last in group */}
                    {isLastInGroup && (
                        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[10px] text-slate-600">{formatTime(msg.createdAt)}</span>
                            {!isDeleted && msg.editedAt && (
                                <button
                                    onClick={() => hasHistory && setShowHistory(v => !v)}
                                    className={`text-[10px] text-slate-500 transition-colors ${hasHistory ? 'hover:text-slate-300 cursor-pointer' : 'cursor-default'}`}
                                >
                                    (edited)
                                </button>
                            )}
                        </div>
                    )}

                    {/* History popover */}
                    {showHistory && hasHistory && (
                        <div ref={historyRef} className={`mt-1 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-64 overflow-hidden ${isMe ? 'self-end' : 'self-start'}`}>
                            <div className="px-3 py-2 border-b border-slate-700/60">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Edit history</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto divide-y divide-slate-700/40">
                                {msg.history!.map((entry: HistoryEntry, i: number) => (
                                    <div key={i} className="px-3 py-2">
                                        <p className="text-xs text-slate-300 break-words leading-relaxed">{entry.text}</p>
                                        <p className="text-[10px] text-slate-600 mt-1">{formatTime(entry.editedAt)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation popup */}
            {showDeletePopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Delete this message?</h3>
                        <p className="text-sm text-slate-400 mb-6">You will not be able to recover this message after deleting it.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeletePopup(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
