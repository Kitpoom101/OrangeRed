"use client";

import React, { useState, useEffect } from 'react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string; // เพิ่ม imageUrl ให้รองรับข้อมูลจากหลังบ้าน
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // เพิ่ม State สำหรับรูปภาพ
  const [editingId, setEditingId] = useState<string | null>(null);

 const API_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/v1/announcements';

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data?.data) setAnnouncements(data.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // เพิ่ม imageUrl เข้าไปใน Payload
        body: JSON.stringify({ title, content, imageUrl }), 
      });

      if (res.ok) {
        setTitle(''); setContent(''); setImageUrl(''); setEditingId(null);
        fetchAnnouncements();
      }
    } catch (err) { alert("Execution Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirm permanent removal of this entry?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAnnouncements();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 text-text-main animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-3xl font-serif tracking-tight mb-2 text-text-main">Registry Announcements</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Internal Management System</p>
        <div className="h-[1px] w-12 bg-gold/30 mt-6" />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-card border border-card-border p-8 rounded-2xl mb-16 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-accent/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 via-gold/50 to-accent/50" />
        
        <h3 className="text-[11px] uppercase tracking-[0.3em] mb-6 text-gold font-bold">
          {editingId ? 'Modify Registry Entry' : 'Compose New Directive'}
        </h3>
        
        <div className="space-y-6">
          <div className="group">
            <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub mb-2 group-focus-within:text-accent transition-colors">Heading</p>
            <input 
              type="text" placeholder="Title of the announcement" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-card-border py-2 text-sm text-text-main focus:outline-none focus:border-accent transition-all font-serif italic"
              required
            />
          </div>

          {/* ช่องกรอก URL รูปภาพที่เพิ่มเข้ามา */}
          <div className="group">
            <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub mb-2 group-focus-within:text-accent transition-colors">Visual Asset (URL)</p>
            <input 
              type="text" placeholder="https://..." value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-transparent border-b border-card-border py-2 text-sm text-text-main focus:outline-none focus:border-accent transition-all font-serif italic"
            />
          </div>

          <div className="group">
            <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub mb-2 group-focus-within:text-accent transition-colors">Detailed Content</p>
            <textarea 
              placeholder="Enter directive details..." value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-background/30 border border-card-border rounded-lg p-4 h-40 text-sm text-text-main focus:outline-none focus:border-accent/50 transition-all font-light leading-relaxed"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button type="submit" className="px-8 py-2.5 bg-accent/20 border border-accent/50 text-accent text-[10px] uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all rounded-sm font-bold">
            {editingId ? 'Authorize Update' : 'Publish Entry'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setEditingId(null); setTitle(''); setContent(''); setImageUrl('');}} className="px-8 py-2.5 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.4em] hover:text-text-main transition-all rounded-sm">
              Discard
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        <p className="text-[9px] uppercase tracking-[0.5em] text-text-sub mb-8 text-center">— Active Registry Entries —</p>
        {announcements.map(ann => (
          <div key={ann._id} className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-card/40 p-6 rounded-xl border border-card-border transition-all duration-500 hover:bg-card hover:translate-x-1 gap-6">
            
            {/* แสดงรูปภาพถ้ามี */}
            <div className="flex gap-6 items-center flex-1">
              {ann.imageUrl && (
                <div className="w-20 h-20 shrink-0 overflow-hidden rounded-md border border-card-border/50">
                  <img 
                    src={ann.imageUrl} 
                    alt={ann.title} 
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="space-y-1">
                <p className="font-serif text-lg text-text-main group-hover:text-accent transition-colors">{ann.title}</p>
                <div className="flex gap-4 items-center opacity-40">
                  <p className="text-[8px] uppercase tracking-widest">UID: {ann._id.slice(-6)}</p>
                  <p className="text-[8px] uppercase tracking-widest">{new Date(ann.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 shrink-0 mt-4 md:mt-0">
              <button 
                onClick={() => {
                  setEditingId(ann._id); 
                  setTitle(ann.title); 
                  setContent(ann.content); 
                  setImageUrl(ann.imageUrl || ''); 
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }} 
                className="text-[9px] uppercase tracking-[0.3em] text-accent/70 hover:text-accent transition-colors font-bold"
              >
                Modify
              </button>
              <button 
                onClick={() => handleDelete(ann._id)} 
                className="text-[9px] uppercase tracking-[0.3em] text-red-500/50 hover:text-red-500 transition-colors font-bold"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}