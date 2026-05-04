# 📚 PocketEdu

**PocketEdu** is a digital library web application designed to make book browsing, borrowing, and management easier, faster, and more efficient.

This project is built to support both **students** and **administrators** with a clean, simple, and user-friendly system for managing library activities.

---

## ✨ Features

- 📖 Browse available books
- 📥 Borrow books online
- 📚 Manage book data
- 👨‍💼 Admin dashboard
- 🔍 Search and organize books
- 💻 Accessible on multiple devices

---

## 🛠️ Tech Stack

- **Laravel**
- **React / Blade**
- **Filament**
- **MySQL**

---

## 🎯 Purpose

PocketEdu was developed as a learning project and digital library solution to improve the efficiency of library management and simplify the book borrowing process.

---

## ⚙️ Installation

Follow these steps to run the project locally:

### 1. Clone the repository
git clone https://github.com/Sadewa1945/PocketEdu.git
cd PocketEdu

### 2. Install backend dependencies
composer install

### 3. Install frontend dependencies
npm install

### 4. Configure environment
cp .env.example .env
php artisan key:generate

### 5. Set up database
php artisan migrate --seed

### 6. Run the project
php artisan serve and
npm run dev


## 📸 Preview

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Books Page
![Books](./screenshots/books.png)

### Borrow System
![Borrow](./screenshots/borrow.png)

### Admin Panel
![Admin](./screenshots/admin.png)
