# 📦 Project Workflow

## 🚀 Push to Work Repositories

### 🎨 Frontend (FE)

```bash
cd frontend
npm run sync:fe
```

### ⚙️ Backend (BE)

```bash
cd backend
npm run sync:be
```

---

## 🧠 How It Works

- This is a **monorepo** containing both frontend and backend  
- Each part is synced to its own repository using **git subtree**  
- Commands:
  - `sync:fe` → pushes `frontend/` to FE repo  
  - `sync:be` → pushes `backend/` to BE repo  

---

## ⚡ Tips

- Always commit before syncing:

```bash
git add .
git commit -m "your message"
```

- Run commands inside the correct folder:
  - `frontend/` for FE  
  - `backend/` for BE  

---

## 🧪 Example Workflow

```bash
# Frontend
cd frontend
git add .
git commit -m "update UI"
npm run sync:fe

# Backend
cd ../backend
git add .
git commit -m "update API"
npm run sync:be
```

---

## ⏰ Assignment Link

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZoerMYa3)

---

## 🎯 Project Structure

```text
MassageService/
├── frontend/   → synced to FE repo
└── backend/    → synced to BE repo
```

This repository acts as a **central hub**, while frontend and backend are deployed independently.