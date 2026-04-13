"use client";
import { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from "react";
import useChat from "@/libs/chat/useChat";
import { useSession } from "next-auth/react";
import ChatBox from "./ChatBox";
import Pusher from "pusher-js";

interface ChatProps {
  shopId: string;
  shopName?: string;
  userId?: string;
  isAdmin?: boolean;
}

interface RoomEntry {
  room: string;
  user: { _id: string; name: string };
}

function ChatRoom({ shopId, shopName, userId, isAdmin }: ChatProps) {
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const token = session?.user?.token;

  // Admin: inbox state
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Compute the active room:
  // - User: private room = shopId_userId
  // - Admin: whichever room they selected
  const userRoom = userId ? `${shopId}_${userId}` : "";
  const activeRoom = isAdmin ? (selectedRoom ?? "") : userRoom;
  const selectedUser = rooms.find((r) => r.room === selectedRoom)?.user;

  const { messages, loading, error, sendMessage, editMessage, deleteMessage } =
    useChat(activeRoom, token, {
      _id: session?.user?._id,
      name: session?.user?.name,
      profilePicture: session?.user?.profilePicture,
    });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Easter Egg States ---
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [isSkullExploding, setIsSkullExploding] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const keyBuffer = useRef<string>("");
  const [showSkullConfig, setShowSkullConfig] = useState(false);
  const [skullCount, setSkullCount] = useState<number>(1);

  // --- Fetch admin rooms on mount ---
  useEffect(() => {
    if (!isAdmin || !token) return;

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/shop/${shopId}/rooms`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRooms(data.data);
      })
      .catch(() => {});
  }, [isAdmin, shopId, token]);

  // --- Admin: real-time inbox updates via shop-level Pusher channel ---
  useEffect(() => {
    if (!isAdmin || !shopId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(shopId);

    channel.bind("shopRoom", (entry: RoomEntry) => {
      setRooms((prev) =>
        prev.some((r) => r.room === entry.room) ? prev : [...prev, entry],
      );
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(shopId);
      pusher.disconnect();
    };
  }, [isAdmin, shopId]);

  // --- Secret Code Listener (12875590) ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      keyBuffer.current = (keyBuffer.current + e.key).slice(-8);

      if (keyBuffer.current === "12875590") {
        setShowSecretMenu(true);
        setSkullCount(1);
        setShowSkullConfig(false);
        keyBuffer.current = "";
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // --- Skull Meme ---
  const triggerSkullMeme = () => {
    setShowSecretMenu(false);
    setIsGrayscale(false);
    setIsSkullExploding(true);

    const baseAnimTime = 1000;
    const delayPerSkull = 200;
    const totalWaitTime = baseAnimTime + (skullCount - 1) * delayPerSkull;
    const showEyeTime = Math.max(0, totalWaitTime - 400);

    setTimeout(() => {
      setIsGrayscale(true);
      setTimeout(() => setIsGrayscale(false), 1500);
    }, showEyeTime);

    setTimeout(() => setIsSkullExploding(false), totalWaitTime);
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Shared sub-components ────────────────────────────────────────────────

  const chatHeader = (title: string, subtitle: string) => (
        <div className="bg-background px-6 py-4 text-white border-b border-card-border z-10 shrink-0 flex items-center justify-between">
            <div>
                <h3 className="font-serif text-text-main tracking-widest uppercase text-sm">{title}</h3>
                <p className="text-[10px] text-text-sub uppercase tracking-widest font-light mt-1">{subtitle}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
        </div>
    );

    const messageList = (
        <div className="flex-1 overflow-y-auto py-6 bg-card/20 relative">
            {messages.length === 0 ? (
                <div className="text-center text-text-sub mt-12 text-[11px] uppercase tracking-widest opacity-40">
                    ✦ Silence is the beginning of a conversation, Chat now! ✦
                </div>
            ) : (
                <div className="px-4">
                   {messages.map((msg, index) => {
                        const prevSenderId = messages[index - 1]?.user._id;
                        const nextSenderId = messages[index + 1]?.user._id;
                        return (
                            <ChatBox
                                key={msg._id}
                                msg={msg}
                                editMessage={editMessage}
                                deleteMessage={deleteMessage}
                                uid={session?.user?._id}
                                isFirstInGroup={msg.user._id !== prevSenderId}
                                isLastInGroup={msg.user._id !== nextSenderId}
                            />
                        );
                    })}
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );

    const inputArea = (
        <div className="p-4 bg-background border-t border-card-border flex gap-3 items-end shrink-0 z-10 pb-safe">
            <textarea
                ref={textareaRef}
                className="flex-1 bg-surface border border-card-border rounded-2xl px-5 py-3 text-sm text-text-main placeholder-text-sub/40 outline-none transition-all duration-300 resize-none overflow-y-auto focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                style={{ minHeight: '48px', maxHeight: '150px' }}
                value={input}
                rows={1}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Compose your message..."
            />
            <button
                className="bg-accent hover:opacity-90 text-white px-6 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-accent/10 disabled:opacity-20 mb-0.5 shrink-0"
                onClick={handleSend}
                disabled={!input.trim()}
            >
                Send
            </button>
        </div>
    );

  const easterEggs = (
    <>
      <style>{`
                @keyframes slideSkull {
                    0% { transform: translateX(-100vw); }
                    100% { transform: translateX(100vw); }
                }
                .animate-slideSkull {
                    animation: slideSkull 1s linear both;
                }
            `}</style>

      {showSecretMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 font-[Tahoma,sans-serif]">
          <div className="w-full max-w-xs bg-[#0053e5] rounded-t-[8px] rounded-b-[3px] p-[3px] shadow-[2px_2px_10px_rgba(0,0,0,0.5)]">
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
            <div className="bg-[#ECE9D8] border border-white p-6 flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-black mb-2">
                Secret Found
              </h3>
              <button
                onClick={triggerSkullMeme}
                className="text-6xl hover:scale-110 active:scale-95 transition"
              >
                <img src="/skull.jpg" alt="SkullHead" />
              </button>
              <div className="mt-2 min-h-[30px] flex items-center justify-center w-full">
                {!showSkullConfig ? (
                  <button
                    onClick={() => setShowSkullConfig(true)}
                    className="text-text-sub hover:text-gray-800 text-lg font-bold px-2 transition-colors"
                    title="ตั้งค่าจำนวนโครงกระดูก"
                  >
                    +
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-700 font-semibold mt-1">
                      จำนวน:
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={skullCount}
                      onChange={(e) =>
                        setSkullCount(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="w-16 px-1 py-0.5 border border-gray-400 rounded text-black text-xs outline-none focus:border-blue-500 text-center"
                    />
                  </div>
                )}
              </div>
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
    </>
  );

  // ─── Loading / Error (shared) ─────────────────────────────────────────────

  if (loading && activeRoom)
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
        <p className="animate-pulse">Loading messages...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-red-400">
        <p>Error: {error}</p>
      </div>
    );

  // ─── Admin view ───────────────────────────────────────────────────────────

  if (isAdmin) {
        return (
            <div className={`flex h-full w-full bg-background overflow-hidden font-sans relative transition-all duration-300 ${isGrayscale ? 'grayscale' : ''}`}>
                {easterEggs}

                {/* Left: Customer inbox - ปรับสีให้ดูเป็น Sidebar หรูๆ */}
                <div className="w-72 shrink-0 bg-surface/30 border-r border-card-border flex flex-col">
                    <div className="px-6 py-6 border-b border-card-border">
                        <h3 className="text-[11px] font-bold text-text-main uppercase tracking-[0.3em]">Guest Inquiries</h3>
                        <p className="text-[9px] text-accent mt-1 uppercase tracking-widest">{shopName}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {rooms.length === 0 ? (
                            <p className="text-[10px] text-text-sub text-center mt-12 uppercase tracking-widest opacity-50">Quiet in the lobby</p>
                        ) : (
                            rooms.map(entry => (
                                <button
                                    key={entry.room}
                                    onClick={() => setSelectedRoom(entry.room)}
                                    className={`w-full text-left px-6 py-5 border-b border-card-border/30 transition-all duration-300 hover:bg-accent/5 ${selectedRoom === entry.room ? 'bg-accent/10 border-l-4 border-l-accent' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-xs text-accent font-serif italic shrink-0 shadow-inner">
                                            {entry.user.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-sm text-text-main font-medium block truncate">{entry.user.name}</span>
                                            <span className="text-[9px] text-text-sub uppercase tracking-tighter">Active Conversation</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Chat panel */}
                <div className="flex-1 flex flex-col overflow-hidden bg-card/10">
                    {!selectedRoom ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-12 h-[1px] bg-accent/30 mb-4" />
                            <p className="text-text-sub text-[11px] uppercase tracking-[0.4em]">Select a guest to begin</p>
                        </div>
                    ) : (
                        <>
                            {chatHeader(
                                `${selectedUser?.name ?? 'Guest'}`,
                                `Concierge view · ${shopName || 'Private'}`
                            )}
                            {messageList}
                            {inputArea}
                        </>
                    )}
                </div>
            </div>
        );
    }

  // ─── User view ────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex flex-col h-full w-full bg-background overflow-hidden font-sans relative transition-all duration-300 ${isGrayscale ? "grayscale" : ""}`}
    >
      {" "}
      {easterEggs}
      {chatHeader(
        shopName ? `${shopName} Chat` : "Shop Chat",
        "We reply immediately",
      )}
      {messageList}
      {inputArea}
    </div>
  );
}

export default ChatRoom;
