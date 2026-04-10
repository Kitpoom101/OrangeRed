"use client";

import React, { useEffect, useState } from 'react';

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string; // เพิ่มรองรับรูปภาพ
    createdAt: string;
}

export default function AnnouncementPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // State สำหรับลิงก์รูป
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api/announcements';

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            const result = await res.json();
            setAnnouncements(result.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    // 🌟 ฟังก์ชัน สร้าง/แก้ไข
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            if (res.ok) {
                alert(editingId ? 'แก้ไขเรียบร้อย!' : 'โพสต์เรียบร้อย!');
                resetForm();
                fetchAnnouncements();
            }
        } catch (err) { alert('เกิดข้อผิดพลาด'); }
        finally { setIsProcessing(false); }
    };

    // 🌟 ฟังก์ชัน ลบ
    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจไหมที่จะลบโพสต์นี้?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    // 🌟 เตรียมข้อมูลเพื่อแก้ไข
    const startEdit = (item: Announcement) => {
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนขึ้นไปดูฟอร์ม
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Announcements Manager</h1>

                {/* 📝 ฟอร์มจัดการ (สร้าง/แก้ไข) */}
                <form onSubmit={handleSubmit} className="bg-slate-800 border border-blue-500/30 p-6 rounded-2xl mb-12 shadow-xl">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">
                        {editingId ? '✏️ แก้ไขประกาศ' : 'สร้างประกาศใหม่'}
                    </h2>
                    <input 
                        type="text" placeholder="หัวข้อ" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mb-3 focus:border-blue-500 outline-none"
                        required
                    />
                    <input 
                        type="text" placeholder="ลิงก์รูปภาพ (URL) เช่น https://example.com/image.jpg" value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mb-3 focus:border-blue-500 outline-none"
                    />
                    <textarea 
                        placeholder="เนื้อหาประกาศ..." value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mb-4 h-24 focus:border-blue-500 outline-none"
                        required
                    />
                    <div className="flex gap-2">
                        <button type="submit" disabled={isProcessing} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-bold">
                            {isProcessing ? 'กำลังดำเนินการ...' : editingId ? 'บันทึกการแก้ไข' : 'โพสต์ประกาศ'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="bg-slate-700 px-6 py-2 rounded-xl">ยกเลิก</button>
                        )}
                    </div>
                </form>

                {/* 📋 รายการประกาศ */}
                <div className="space-y-6">
                    {loading ? <p className="text-center">กำลังโหลด...</p> : 
                     announcements.map((item) => (
                        <div key={item._id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 transition-all">
                            {/* แสดงรูปภาพถ้ามี URL */}
                            {item.imageUrl && (
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-700"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // ซ่อนถ้ารูปเสีย
                                />
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(item)} className="text-sm bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/40 px-3 py-1 rounded-lg transition-colors">แก้ไข</button>
                                    <button onClick={() => handleDelete(item._id)} className="text-sm bg-red-600/20 text-red-500 hover:bg-red-600/40 px-3 py-1 rounded-lg transition-colors">ลบ</button>
                                </div>
                            </div>
                            <p className="text-slate-300 whitespace-pre-wrap">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}