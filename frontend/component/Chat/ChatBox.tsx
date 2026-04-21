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
    const d = new Date(iso);
    const date = d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${date} ${time}`;
}

function Avatar({ user }: { user: { name?: string; profilePicture?: string | null } }) {
    const [imgError, setImgError] = useState(false);

    if (user.profilePicture && !imgError) {
        return (
            <img
                src={user.profilePicture}
                alt={user.name ?? ''}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-card-border/50 shadow-sm"
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-[10px] text-accent font-bold shrink-0 shadow-inner">
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
        ? `bg-accent text-white shadow-lg shadow-accent/5 ${isLastInGroup ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl'}`
        : `bg-card/40 text-text-main border border-card-border/50 ${isLastInGroup ? 'rounded-2xl rounded-tl-none' : 'rounded-2xl'}`;

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
            <div data-msg-id={msg._id} className={`group flex w-full px-4 items-end gap-3
                ${isMe ? 'justify-end' : 'justify-start'}
                ${isFirstInGroup ? 'mt-6' : 'mt-1'}
            `}>
                {!isMe && (
                    isLastInGroup
                        ? <Avatar user={msg.user} />
                        : <div className="w-8 shrink-0" />
                )}

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    {isDeleted ? (
                        <div className="px-4 py-2 text-[11px] rounded-2xl border border-dashed border-card-border/40 bg-surface/20">
                            <span className="italic text-text-sub opacity-50 tracking-wider">Message vanished into silence</span>
                        </div>
                    ) : isEditing ? (
                        <div className="flex flex-col bg-card border border-accent/30 p-4 rounded-2xl shadow-2xl w-full min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                            <input
                                ref={inputRef}
                                className="bg-transparent border-b border-card-border/50 px-1 py-2 text-sm text-text-main outline-none focus:border-accent mb-4 w-full transition-all"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex justify-end gap-3 text-[10px] font-bold uppercase tracking-widest">
                                <button onClick={() => setIsEditing(false)} className="text-text-sub hover:text-text-main px-2 py-1 transition-colors">Cancel</button>
                                <button onClick={handleSave} className="bg-accent text-white rounded-lg px-4 py-2 hover:opacity-90 transition-all shadow-md shadow-accent/10">Update</button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group/bubble">
                            <div className={`px-4 py-2.5 text-sm transition-all duration-300 ${bubbleClass}`}>
                                <span className="[overflow-wrap:anywhere] whitespace-pre-wrap leading-relaxed font-light">{msg.text}</span>
                            </div>

                            {/* Floating Actions - ปรับให้ดู Minimal ขึ้น */}
                            {isMe && !isDeleted && (
                                <div className="absolute top-1/2 -left-16 -translate-y-1/2 flex opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto gap-2 bg-background/80 backdrop-blur-md border border-card-border rounded-full px-2 py-1 z-10 shadow-xl">
                                    <button title="Edit" className="text-[10px] hover:scale-125 transition-transform p-1" onClick={() => setIsEditing(true)}>✨</button>
                                    <button title="Delete" className="text-[10px] hover:scale-125 transition-transform p-1" onClick={() => setShowDeletePopup(true)}>🗑️</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Refined label — every edited message */}
                    {!isDeleted && msg.editedAt && (
                        <button
                            onClick={() => hasHistory && setShowHistory(v => !v)}
                            className={`text-[9px] text-accent/70 uppercase tracking-tighter italic mt-0.5 px-1 ${hasHistory ? 'hover:text-accent cursor-pointer' : 'cursor-default'}`}
                        >
                            (refined)
                        </button>
                    )}


                    {/* History Popover */}
                    {showHistory && hasHistory && (
                        <div ref={historyRef} className={`mt-2 z-20 bg-card border border-card-border rounded-xl shadow-2xl w-64 overflow-hidden animate-in slide-in-from-top-2 ${isMe ? 'self-end' : 'self-start'}`}>
                            <div className="px-4 py-2 bg-surface/50 border-b border-card-border/40">
                                <span className="text-[9px] font-bold text-accent uppercase tracking-[0.2em]">Legacy of edits</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto divide-y divide-card-border/20">
                                {msg.history!.map((entry: HistoryEntry, i: number) => (
                                    <div key={i} className="px-4 py-3 hover:bg-surface/30 transition-colors">
                                        <p className="text-[11px] text-text-main font-light break-words whitespace-pre-wrap  leading-relaxed">{entry.text}</p>
                                        <p className="text-[8px] text-text-sub mt-2 uppercase tracking-widest">{formatTime(entry.editedAt)}</p>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            {showDeletePopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
                    <div className="bg-card border border-card-border rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-xl">✕</span>
                        </div>
                        <h3 className="text-lg font-serif text-text-main mb-2">Withdraw Message?</h3>
                        <p className="text-xs text-text-sub mb-8 leading-relaxed uppercase tracking-widest">This action will erase the message from the sanctuary's memory forever.</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={handleDeleteConfirm} className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">Confirm Deletion</button>
                            <button onClick={() => setShowDeletePopup(false)} className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-text-sub hover:text-text-main transition-all">Keep it</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
