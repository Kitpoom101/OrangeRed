"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // State สำหรับเปิดอ่านแบบ Full Page (Modal)
    const [viewingPost, setViewingPost] = useState<Announcement | null>(null);

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/announcements`;

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

    useEffect(() => { fetchAnnouncements(); }, []);

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
                body: JSON.stringify({ title, content, imageUrl }),
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
        e.stopPropagation(); // ป้องกันไม่ให้คลิกแล้วไปเปิด Modal
        if (!confirm('คุณแน่ใจไหมที่จะลบประกาศนี้?') || !session?.user?.token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` } 
            });
            if (res.ok) {
                setViewingPost(null); // ปิด Modal หากเปิดอยู่
                fetchAnnouncements();
            }
        } catch (err) { console.error(err); }
    };

    const startEdit = (item: Announcement, e: React.MouseEvent) => {
        e.stopPropagation(); // ป้องกันไม่ให้คลิกแล้วไปเปิด Modal
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || '');
        setViewingPost(null); // ปิด Modal เวลาจะกดแก้
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                        Announcements
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">จัดการและอัปเดตข่าวสารล่าสุด</p>
                </header>

                {/* Form Section */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {editingId ? '✏️ แก้ไขประกาศ' : '✨ สร้างประกาศใหม่'}
                        </h2>
                        {editingId && (
                            <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-700 underline">
                                ยกเลิกการแก้ไข
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">หัวข้อประกาศ (Title) *</label>
                                <input 
                                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required placeholder="ระบุหัวข้อ..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">ลิงก์รูปภาพ (Image URL)</label>
                                <input 
                                    type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">เนื้อหา (Content) *</label>
                            <textarea 
                                value={content} onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                required placeholder="รายละเอียดประกาศ..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                type="submit" disabled={isProcessing} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50"
                            >
                                {isProcessing ? 'กำลังประมวลผล...' : editingId ? 'อัปเดตข้อมูล' : 'เผยแพร่ประกาศ'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* List Section (Grid View) */}
                <section>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map((item) => (
                                <div 
                                    key={item._id} 
                                    onClick={() => setViewingPost(item)}
                                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 group flex flex-col"
                                >
                                    {item.imageUrl ? (
                                        <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-2 bg-blue-500 w-full"></div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold line-clamp-2 text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                                            {item.content}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                            <span className="text-xs text-slate-400 font-medium">
                                                {new Date(item.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            <div className="flex gap-2">
                                                <button onClick={(e) => startEdit(item, e)} className="text-xs px-3 py-1.5 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors font-medium">
                                                    แก้ไข
                                                </button>
                                                <button onClick={(e) => handleDelete(item._id, e)} className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-medium">
                                                    ลบ
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-slate-900/60 transition-opacity">
                    <div 
                        className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setViewingPost(null)}
                            className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-full transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Content */}
                        {viewingPost.imageUrl && (
                            <div className="w-full h-64 sm:h-80 bg-slate-100 dark:bg-slate-800">
                                <img 
                                    src={viewingPost.imageUrl} 
                                    alt={viewingPost.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}
                        
                        <div className="p-6 md:p-10">
                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                    {viewingPost.title}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    ประกาศเมื่อ: {new Date(viewingPost.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-lg">
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