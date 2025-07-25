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
- 📦 Firebase firestore (Store invoice, quotation, user details)
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
git clone https://github.com/DilshanWA/QuantifyPro.git
cd QuantifyPro
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env

> 🔐 **Create Firebase Admin SDK key**
>
> - Go to Firebase Console → Project Settings → Service Accounts
> - Click **Generate new private key**
> - Save it as `serviceAccountKey.json` in the `backend/` folder

```bash
node app.js
```

node app.js
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
![Invoice PDF Screenshot](https://github.com/user-attachments/assets/d9091f5c-6f62-4c7e-aab1-8eb861ba9499)

### Quotation Preview 
![Invoice PDF Screenshot](https://github.com/user-attachments/assets/8bf2f07f-9fae-4385-9db9-85aa460ce9cb)

#### Admin Panel
![Invoice PDF Screenshot](https://github.com/user-attachments/assets/e3317d58-dbf3-46a3-9fc6-a6aa734ced25)

###  New user register
![Invoice PDF Screenshot](https://github.com/user-attachments/assets/8bff2e1c-5ca7-4fdc-85d7-ab77da7b8fa5)


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

**Dilshan** – Full Stack Developer  
[GitHub Profile](https://github.com/DilshanWA)  
Email: `dilshan.personal12@gmail.com`

---


## 👥 Team / Contributors

| Name           | Role                  | GitHub                                    | Email                     |
|----------------|-----------------------|-------------------------------------------|---------------------------|
| Dilshan         | Full Stack Developer  | [@dilshan](https://github.com/yourusername) | dilshan.personal12@gmail.com     |
| AT Gayan     | Full Stack Developer     | [@ATgayan](https://github.com/ATgayan) |  thusitha.personal@gmail.com          |


## 📄 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

## 🙋‍♂️ Contributions

Pull requests and suggestions are welcome!  
If you find a bug or want to request a feature, please open an [Issue](https://github.com/yourusername/invoquoto/issues).

---
