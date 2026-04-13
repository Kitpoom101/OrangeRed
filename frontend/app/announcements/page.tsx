"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"; // 1. ดึง session มาใช้เพื่อส่ง token

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export default function AnnouncementPage() {
    const { data: session } = useSession(); // ดึง session
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/announcements`;

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            const result = await res.json();
            setAnnouncements(result.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.token) return alert("Unauthorized"); // เช็คสิทธิ์
        
        setIsProcessing(true);
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}` // 2. ใส่ Token ไปที่ Backend
                },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            if (res.ok) {
                resetForm();
                fetchAnnouncements();
            }
        } catch (err) { alert('เกิดข้อผิดพลาด'); }
        finally { setIsProcessing(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจไหมที่จะลบโพสต์นี้?') || !session?.user?.token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` } 
            });
            if (res.ok) fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    const startEdit = (item: Announcement) => {
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
    };

    return (
        // 3. ปรับสีให้เป็น Semantic ตาม Theme (bg-background, text-foreground)
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-500">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-text-main mb-8 uppercase tracking-widest">
                    Announcements Manager
                </h1>

                {/* ฟอร์มจัดการ: ใช้ bg-card และ border-card-border */}
                <form onSubmit={handleSubmit} className="bg-card border border-card-border p-8 rounded-2xl mb-12 shadow-2xl transition-all">
                    <h2 className="text-lg font-serif font-bold text-accent mb-6 uppercase tracking-widest">
                        {editingId ? '✏️ Edit Announcement' : '✨ Create New Post'}
                    </h2>
                    <input 
                        type="text" placeholder="Title" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-surface border border-card-border rounded-xl p-3 mb-4 focus:border-accent outline-none text-text-main"
                        required
                    />
                    <input 
                        type="text" placeholder="Image URL (https://...)" value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-surface border border-card-border rounded-xl p-3 mb-4 focus:border-accent outline-none text-text-main"
                    />
                    <textarea 
                        placeholder="Content details..." value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-surface border border-card-border rounded-xl p-3 mb-6 h-32 focus:border-accent outline-none text-text-main"
                        required
                    />
                    <div className="flex gap-3">
                        <button type="submit" disabled={isProcessing} className="bg-accent hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">
                            {isProcessing ? 'Processing...' : editingId ? 'Update Post' : 'Publish Post'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="bg-text-sub/20 text-text-sub px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-text-sub/30">Cancel</button>
                        )}
                    </div>
                </form>

                {/* รายการประกาศ */}
                <div className="space-y-8">
                    {loading ? <p className="text-center font-mono text-text-sub animate-pulse">Loading Identity...</p> : 
                     announcements.map((item) => (
                        <div key={item._id} className="bg-card/50 border border-card-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                            {item.imageUrl && (
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    className="w-full h-56 object-cover border-b border-card-border grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-serif font-semibold text-text-main tracking-wide">{item.title}</h2>
                                    <div className="flex gap-3">
                                        <button onClick={() => startEdit(item)} className="text-[9px] uppercase tracking-widest bg-gold/10 text-gold hover:bg-gold/20 px-3 py-1.5 rounded border border-gold/20 transition-all">Edit</button>
                                        <button onClick={() => handleDelete(item._id)} className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded border border-red-500/20 transition-all">Delete</button>
                                    </div>
                                </div>
                                <p className="text-text-sub text-sm leading-relaxed whitespace-pre-wrap">{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}