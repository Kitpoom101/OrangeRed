"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    imagePosition?: string; // เก็บค่าตำแหน่ง Crop ของรูป
    createdAt: string;
}

export default function AnnouncementPage() {
    const { data: session } = useSession();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // State สำหรับฟอร์ม
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePosition, setImagePosition] = useState('center');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // State สำหรับ Modal และ Theme
    const [viewingPost, setViewingPost] = useState<Announcement | null>(null);
    const [isLightMode, setIsLightMode] = useState(false);

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/announcements`;

    // ดึงข้อมูลประกาศ
    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            const result = await res.json();
            setAnnouncements(result.data || []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchAnnouncements(); 
        
        // ตรวจสอบ Theme ปัจจุบันเมื่อโหลดหน้าเว็บ
        if (document.documentElement.classList.contains('light')) {
            setIsLightMode(true);
        }
    }, []);

    // ฟังก์ชันสลับ Theme
    const toggleTheme = () => {
        if (isLightMode) {
            document.documentElement.classList.remove('light');
            setIsLightMode(false);
        } else {
            document.documentElement.classList.add('light');
            setIsLightMode(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.token) return alert("Unauthorized: กรุณาเข้าสู่ระบบ");
        
        setIsProcessing(true);
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify({ title, content, imageUrl, imagePosition }), // ส่งค่าตำแหน่งรูปไปบันทึก
            });

            if (res.ok) {
                resetForm();
                fetchAnnouncements();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (err) { 
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ'); 
        } finally { 
            setIsProcessing(false); 
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('คุณแน่ใจไหมที่จะลบประกาศนี้?') || !session?.user?.token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` } 
            });
            if (res.ok) {
                setViewingPost(null);
                fetchAnnouncements();
            }
        } catch (err) { console.error(err); }
    };

    const startEdit = (item: Announcement, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || '');
        setImagePosition(item.imagePosition || 'center'); // ดึงตำแหน่งรูปล่าสุดมาแสดง
        setViewingPost(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
        setImagePosition('center');
    };

    // แปลงค่าให้เป็น Tailwind Class
    const getPositionClass = (pos?: string) => {
        if (pos === 'top') return 'object-top';
        if (pos === 'bottom') return 'object-bottom';
        return 'object-center';
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Header & Theme Toggle */}
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-accent">
                            Announcements
                        </h1>
                        <p className="text-text-sub uppercase tracking-widest text-[10px] mt-2 font-bold">
                            Registry Management System
                        </p>
                    </div>
                    
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-card-border bg-card text-text-main text-xs uppercase tracking-widest hover:border-accent transition-all"
                    >
                        {isLightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </header>

                {/* Form Section */}
                <section className="bg-card border border-card-border rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:border-accent/30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 via-gold/50 to-accent/50" />
                    
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold">
                            {editingId ? 'Modify Registry Entry' : 'Compose New Directive'}
                        </h2>
                        {editingId && (
                            <button onClick={resetForm} className="text-xs text-text-sub hover:text-red transition-colors underline">
                                ยกเลิกการแก้ไข
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="col-span-1 md:col-span-6 space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-text-sub group-focus-within:text-accent transition-colors font-semibold">หัวข้อประกาศ (Title) *</label>
                                <input 
                                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-background border border-card-border rounded-lg p-3 text-text-main focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all font-serif"
                                    required placeholder="ระบุหัวข้อ..."
                                />
                            </div>
                            <div className="col-span-1 md:col-span-4 space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-text-sub group-focus-within:text-accent transition-colors font-semibold">ลิงก์รูปภาพ (Image URL)</label>
                                <input 
                                    type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-background border border-card-border rounded-lg p-3 text-text-main focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-text-sub group-focus-within:text-accent transition-colors font-semibold">ตำแหน่งรูป (Crop)</label>
                                <select 
                                    value={imagePosition} 
                                    onChange={(e) => setImagePosition(e.target.value)}
                                    className="w-full bg-background border border-card-border rounded-lg p-3 text-text-main focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                >
                                    <option value="top">ส่วนบน</option>
                                    <option value="center">ตรงกลาง</option>
                                    <option value="bottom">ส่วนล่าง</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-sub group-focus-within:text-accent transition-colors font-semibold">เนื้อหา (Content) *</label>
                            <textarea 
                                value={content} onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-background border border-card-border rounded-lg p-4 h-32 text-text-main focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-none leading-relaxed"
                                required placeholder="รายละเอียดประกาศ..."
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" disabled={isProcessing} 
                                className="bg-accent/10 border border-accent/50 text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-lg text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-sm disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : editingId ? 'Authorize Update' : 'Publish Entry'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* List Section (Grid View) */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] flex-1 bg-card-border"></div>
                        <p className="text-[9px] uppercase tracking-[0.5em] text-text-sub text-center font-bold">Active Registry Entries</p>
                        <div className="h-[1px] flex-1 bg-card-border"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map((item) => (
                                <div 
                                    key={item._id} 
                                    onClick={() => setViewingPost(item)}
                                    className="bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 group flex flex-col"
                                >
                                    {item.imageUrl ? (
                                        <div className="h-48 overflow-hidden bg-background relative border-b border-card-border">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.title} 
                                                // ใช้คลาสจัดการตำแหน่ง Crop ที่เลือกไว้
                                                className={`w-full h-full object-cover ${getPositionClass(item.imagePosition)} grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700`}
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-2 bg-gradient-to-r from-accent to-gold w-full"></div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-3">
                                            <h3 className="text-xl font-serif font-bold line-clamp-2 text-text-main leading-tight group-hover:text-accent transition-colors">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-text-sub mb-6 line-clamp-3 flex-1 font-light leading-relaxed">
                                            {item.content}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center pt-4 border-t border-card-border mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-text-sub uppercase tracking-widest font-bold">
                                                    UID: {item._id.slice(-6)}
                                                </span>
                                                <span className="text-[9px] text-text-sub mt-1">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={(e) => startEdit(item, e)} className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent/80 hover:text-accent transition-colors">
                                                    Modify
                                                </button>
                                                <button onClick={(e) => handleDelete(item._id, e)} className="text-[9px] uppercase tracking-[0.2em] font-bold text-red/60 hover:text-red transition-colors">
                                                    Archive
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            {/* FULL PAGE MODAL */}
            {viewingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-background/80 transition-opacity">
                    <div 
                        className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-card-border relative animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setViewingPost(null)}
                            className="absolute top-4 right-4 bg-background/50 hover:bg-background border border-card-border text-text-main p-2.5 rounded-full transition-all z-10 backdrop-blur-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Content */}
                        {viewingPost.imageUrl && (
                            <div className="w-full h-72 sm:h-96 bg-background border-b border-card-border relative">
                                <img 
                                    src={viewingPost.imageUrl} 
                                    alt={viewingPost.title} 
                                    className={`w-full h-full object-cover ${getPositionClass(viewingPost.imagePosition)}`} // ตำแหน่ง Crop แสดงผลใน Modal ด้วย
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent h-full w-full pointer-events-none opacity-60"></div>
                            </div>
                        )}
                        
                        <div className="p-8 md:p-12 relative -mt-10 md:-mt-16 z-10 bg-card rounded-t-3xl md:rounded-none md:bg-transparent md:pt-8">
                            <div className="mb-8">
                                <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold mb-3">
                                    Registry Entry • {viewingPost._id.slice(-6)}
                                </p>
                                <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-text-main mb-4 leading-tight">
                                    {viewingPost.title}
                                </h2>
                                <p className="text-xs text-text-sub font-medium uppercase tracking-widest border-b border-card-border pb-6">
                                    Published: {new Date(viewingPost.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            
                            <div className="max-w-none">
                                <p className="text-text-main whitespace-pre-wrap leading-relaxed text-lg font-light">
                                    {viewingPost.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}