# 🚀 DIU Startup – Full-Stack Project Setup Guide

এই প্রজেক্টটি একটি ফুল-স্ট্যাক ই-কমার্স সিস্টেম যা **React (Vite)** ও **Django REST Framework** দিয়ে তৈরি করা হয়েছে। নিচে প্রজেক্টটি আপনার লোকাল মেশিনে সেটআপ করার সম্পূর্ণ গাইড দেওয়া হলো:

---

## 🛠️ Requirements
প্রজেক্টটি রান করার আগে আপনার সিস্টেমে নিচের টুলসগুলো ইনস্টল থাকতে হবে:
1. **Python 3.10+**
2. **Node.js 18+** ও **npm**
3. **PostgreSQL** (ঐচ্ছিক, ডিফল্টভাবে SQLite দিয়েও চালানো যাবে)

---

## 🏗️ Step 1: Clone the Project
প্রথমে গিটহাব থেকে প্রজেক্টটি ক্লোন করে নিন এবং প্রজেক্ট ডিরেক্টরিতে যান:
```bash
git clone https://github.com/nbr233/DIU-Startup.git
cd DIU-Startup
```

---

## 🐍 Step 2: Backend (Django REST API) Setup
১. `backend` ডিরেক্টরিতে যান:
   ```bash
   cd backend
   ```

২. একটি পাইথন ভার্চুয়াল এনভায়রনমেন্ট (Virtual Environment) তৈরি এবং অ্যাক্টিভেট করুন:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

৩. প্রয়োজনীয় সব প্যাকেজ ইনস্টল করুন:
   ```bash
   pip install -r requirements.txt
   ```

৪. এনভায়রনমেন্ট ফাইল সেটআপ করুন:
   `backend` ফোল্ডারের ভেতর একটি `.env` ফাইল তৈরি করুন এবং নিচের কোডটি পেস্ট করুন (অথবা `.env.example` ফাইলটি রিনেম করে নিতে পারেন):
   ```env
   SECRET_KEY=django-insecure-diu-startup-key-2024
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Database (ডিফল্টভাবে SQLite ব্যবহার করতে 'sqlite' রাখুন, অথবা PostgreSQL কনফিগার করুন)
   DB_ENGINE=sqlite
   DB_NAME=diu_startup
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   ```

৫. ডেটাবেজ মাইগ্রেশন রান করুন:
   ```bash
   python manage.py makemigrations users shops products orders payments reviews coupons banners notifications chats
   python manage.py migrate
   ```

৬. ডামি ডেটা এবং অ্যাডমিন ইউজার সিড (Seed) করুন:
   ```bash
   python seed.py
   ```

৭. ব্যাকএন্ড সার্ভারটি চালু করুন:
   ```bash
   python manage.py runserver 8000
   ```
   সার্ভারটি রান হওয়ার পর ব্যাকএন্ড API দেখতে পারবেন: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**  
   ইন্টারেক্টিভ এপিআই ডকুমেন্টেশন (Swagger): **[http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)**

---

## ⚛️ Step 3: Frontend (React) Setup
১. নতুন একটি টার্মিনাল খুলে মূল ফোল্ডার থেকে `frontend_react` ফোল্ডারে যান:
   ```bash
   cd frontend_react
   ```

২. প্রয়োজনীয় npm প্যাকেজ ইনস্টল করুন:
   ```bash
   npm install
   ```

৩. ফ্রন্টএন্ড ডেভলপমেন্ট সার্ভারটি চালু করুন:
   ```bash
   npm run dev
   ```
   সার্ভারটি রান হওয়ার পর আপনার ব্রাউজারে এটি ওপেন করুন: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Default Login Credentials
ডেটাবেজে সিড স্ক্রিপ্ট দিয়ে নিচের টেস্ট অ্যাকাউন্টগুলো অলরেডি তৈরি করা আছে:

| Role | Email (Username) | Password |
|---|---|---|
| **Super Admin** | `superadmin@diustartup.com` | `superadmin123` |
| **Seller / Shop Owner** | `seller@diustartup.com` | `seller123` |
| **Customer** | (যেকোনো নতুন অ্যাকাউন্ট ফ্রন্টএন্ডে রেজিস্টার করতে পারেন) | - |
