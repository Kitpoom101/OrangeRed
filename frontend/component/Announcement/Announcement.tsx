"use client";

import React, { useState, useEffect } from 'react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/announcements';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data?.data) setAnnouncements(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        alert(editingId ? 'แก้ไขสำเร็จ' : 'สร้างสำเร็จ');
        setTitle(''); setContent(''); setEditingId(null);
        fetchAnnouncements();
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบ?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-200">
      <h1 className="text-2xl font-bold mb-6 text-white">⚙️ Admin: จัดการประกาศ</h1>
      
      {/* ฟอร์มจัดการ */}
      <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-10 shadow-xl">
        <h3 className="text-lg font-medium mb-4 text-blue-400">
            {editingId ? 'แก้ไขข้อมูล' : 'เขียนประกาศใหม่'}
        </h3>
        <input 
          type="text" placeholder="หัวข้อ" value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mb-4 focus:border-blue-500 outline-none"
          required
        />
        <textarea 
          placeholder="เนื้อหา..." value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mb-4 h-32 focus:border-blue-500 outline-none"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-bold transition-all">
            {editingId ? 'บันทึก' : 'โพสต์'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setEditingId(null); setTitle(''); setContent('');}} className="bg-slate-700 px-6 py-2 rounded-xl">
                ยกเลิก
            </button>
          )}
        </div>
      </form>

      {/* รายการสำหรับ Admin ลบ/แก้ไข */}
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann._id} className="flex justify-between items-center bg-slate-800/30 p-4 rounded-xl border border-slate-700">
            <div>
                <p className="font-semibold text-white">{ann.title}</p>
                <p className="text-xs text-slate-500">ID: {ann._id}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => {setEditingId(ann._id); setTitle(ann.title); setContent(ann.content);}} className="text-blue-400 hover:bg-blue-500/10 px-3 py-1 rounded-lg transition-colors">แก้ไข</button>
                <button onClick={() => handleDelete(ann._id)} className="text-red-400 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}