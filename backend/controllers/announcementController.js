// backend/controllers/announcementController.js
const Announcement = require('../models/Announcement');

// --- (ฟังก์ชัน GET เดิมของคุณ) ---
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: announcements.length, data: announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 👇 ลองเช็คฟังก์ชัน POST (สร้าง) ในเครื่องคุณว่ารับค่า imagePosition หรือยัง ---
exports.createAnnouncement = async (req, res) => {
    try {
        // ต้องรับ imagePosition มาด้วย
        const { title, content, imageUrl, imagePosition } = req.body; 
        
        const announcement = await Announcement.create({
            title, 
            content, 
            imageUrl, 
            imagePosition // บันทึกลง Database
        });
        
        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- 👇 ลองเช็คฟังก์ชัน PUT (แก้ไข) ---
exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id, 
            req.body, // ถ้าเขียนเป็น req.body ค่า imagePosition จะถูกอัปเดตให้อัตโนมัติ
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};