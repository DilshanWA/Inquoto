# 🧾 InvoQuoto – Quotation & Invoice Management System

A secure and feature-rich web application designed for **NeoMac Engineering Company** to streamline the creation, management, and tracking of invoices and quotations. The system supports role-based access, PDF generation, and smart analytics for efficient business operations.

---

## 🏢 Project Overview

InvoQuoto is built to automate the process of generating, editing, and managing **invoices and quotations** for NeoMac Engineering. It supports **role-based permissions** for `Admin` and `User` roles, ensuring strict control over who can manage which documents.

---

## 👥 User Roles & Permissions

### 🔐 Admin
- Add and manage all users
- Create, edit, and delete **any** invoice or quotation
- Access all dashboards and statistics

### 👤 Regular User
- Can **generate invoices/quotations**
- Can **edit or delete only their own** invoices/quotations
- Can view and download their documents as PDF
- Cannot manage users

---

## 📊 Dashboard Features

- 📌 Live counts for:
  - Total Invoices & Quotations
  - Completed, Pending, and Canceled status
- 🔍 Quick search and filtering
- 🆔 Every invoice/quotation is assigned a **unique ID**
- 📄 View or download invoices/quotations as **PDF documents**

---

## 🧠 Core Features

- 🔐 Role-based Authentication and Authorization
- 🧾 Create, Edit, View & Delete Quotations and Invoices
- 📄 PDF Generation using `pdf-lib`
- 🆔 Auto-generated unique document IDs
- 📥 Download/View PDF directly from the browser
- 📈 Dashboard Analytics & Statistics
- 🔁 RESTful API for seamless frontend-backend integration

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ [Next.js](https://nextjs.org/) (App Router)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- ⛓️ TypeScript

### Backend
- 🟩 Node.js + Express.js
- 📦 Firebase firestore (Store invoide,quotation,user details)
- 📄 [PDF-lib](https://pdf-lib.js.org/) for PDF generation
- 🔒 Firebase Authentication

---

## 📂 Folder Structure

```txt
invoquoto/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invoquoto.git
cd invoquoto
```

### 2. Setup the Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder with the following variables:

```env
PORT=5000
DATABASE=your_database_uri
FIREBASEAPIKEY=your_API_key
```

---

## 📸 Screenshots

## Login Screen
![LoginPage Screenshot](https://github.com/user-attachments/assets/08c67761-d031-4c6d-9252-d776858c8a22)

### Dashboard Overview  
![Dashboard Screenshot](https://github.com/user-attachments/assets/c5c9d0ff-2ef8-497a-b35b-83e5360417aa)

### Invoice Preview  
![Invoice PDF Screenshot](./assets/invoice-preview.png)

---

## 📄 API Overview

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| POST   | /api/auth/login        | Login for admin/user           |
| POST   | /api/users             | Create user (admin only)       |
| GET    | /api/invoices          | Get all invoices (admin)       |
| GET    | /api/invoices/:id      | Get specific invoice           |
| POST   | /api/invoices          | Create new invoice             |
| PUT    | /api/invoices/:id      | Update invoice (owner or admin)|
| DELETE | /api/invoices/:id      | Delete invoice (owner or admin)|

---

## 🧑‍💻 Author

**Dineth** – Full Stack Developer  
[GitHub Profile](https://github.com/yourusername)  
Email: `youremail@example.com`

---


## 👥 Team / Contributors

| Name           | Role                  | GitHub                                    | Email                     |
|----------------|-----------------------|-------------------------------------------|---------------------------|
| Dineth         | Full Stack Developer  | [@dineth](https://github.com/yourusername) | youremail@example.com     |
| John Silva     | Backend Developer     | [@johnsilva](https://github.com/johnsilva) | john@example.com          |
| Amaya Perera   | UI/UX Designer        | [@amayap](https://github.com/amayap)       | amaya@example.com         |


## 📄 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

## 🙋‍♂️ Contributions

Pull requests and suggestions are welcome!  
If you find a bug or want to request a feature, please open an [Issue](https://github.com/yourusername/invoquoto/issues).

---
