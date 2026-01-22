# 🌾 Kisan-Mitra — Smart Agriculture Marketplace Platform
<img src="https://res.cloudinary.com/dabaopg3v/image/upload/v1769106391/Screenshot_2026-01-22_235251_pshy9u.png" style="border-radius: 12px; width: 100%; border: 1px solid #3B4E45" />
## 🚩 Problem Statement

1. Smallholder farmers face **low yields** and **unstable incomes**.
2. Lack of **soil/crop intelligence** and **delayed interventions** reduce productivity.
3. Weak **market linkages** prevent farmers from receiving fair prices for their produce.

---

## ❗ The Problem

1. Decisions are made **without detailed NPK** or **crop health data**.
2. **Late detection** of pests and diseases reduces crop survival rates.
3. Access to **agricultural loans** is slow, complex, and unclear.
4. **Market price discovery** is fragmented across mandis.

---

## 🎯 Who Faces This Issue?

* **Primary:** Smallholder farmers with **2–10 acres** of land
* **Secondary:** FPOs and cooperatives
* **Tertiary:** Rural banks, MFIs, agribusinesses seeking **data-driven insights**

---

## 🧠 Why Does This Problem Exist?

1. Existing tools only solve **one part** of the workflow.
2. No integrated stack connecting:
   **Sensing → Diagnosis → Treatment → Finance → Market linkage**
3. Missing: **Multilingual support**, **offline access**, **last-mile agent operations**.

---
<img src="https://res.cloudinary.com/dabaopg3v/image/upload/v1769106390/Screenshot_2026-01-22_235321_epyuad.png" style="border-radius: 12px; width: 100%; border: 1px solid #3B4E45" />

# 📋 Project Overview

**Kisan-Mitra** is a modern agricultural marketplace that connects **farmers and dealers** for crop trading, price discovery, and transparent communication.
The platform features:

* A modern **React + Tailwind** frontend
* A robust **Node.js + Express + MongoDB** backend
* Secure authentication, multi-language support, reviews, dashboards, and more

---

# 🗂️ Project Structure

```
Kisan-Mitra/
├── Backend/                   # Node.js Express backend
│   └── src/
│       ├── controllers/       # Business logic
│       ├── middlewares/       # JWT auth
│       ├── models/            # Mongoose schemas
│       ├── routes/            # API routing
│       └── utils/             # Token utilities
│
├── Frontend/                  # React Vite frontend
│   └── src/
│       ├── components/        # UI components
│       ├── pages/             # Main pages
│       ├── reducer/           # Redux store
│       ├── services/          # API integrations
│       ├── constants/         # Static configs
│       └── slices/            # Redux slices
│
└── README.md                  # Main project documentation
```

---

# 🚀 Tech Stack

### 🔧 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* dotenv

### 🎨 Frontend

* React 18
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* React Router DOM
* ESLint

---

# 🧩 Component Breakdown

## Backend

### 📌 Controllers

* Crop CRUD operations
* Farmer/Dealer authentication
* Dealer review management

### 📌 Models

* Crop
* Dealer
* Farmer
* Farmer Loans

### 📌 Routes

* Crop APIs
* Dealer APIs
* Farmer APIs

---

## Frontend

### Core Components

* Home, Navbar, Footer
* Dealer & Farmer Dashboards
* Search, Filter, Crop Cards
* Dealer Reviews & Detail Cards

### Pages

* Auth (Login/Register)
* Dealer Dashboard & Reviews
* Farmer Marketplace (eMandi)
* Language Settings
* Profile pages

### State Management

* Authentication
* Crops
* Dealer State
* Language Preferences

---

# 🌟 Key Features

## 👨‍🌾 Farmer Features

* Browse crops by category & location
* Advanced filters & search
* Dealer reviews and contact
* WhatsApp communication
* Profile management
* Multi-language support

## 🧑‍💼 Dealer Features

* Add/Edit/Delete crops
* Manage inventory & pricing
* See and respond to reviews
* Dashboard analytics
* Multi-language support

## 🔥 System Features

* Fast REST APIs
* JWT-secured routes
* Responsive UI
* Modular architecture
* Review & Rating system
* Real-time data updates

---

# 🗃️ Database Schema (Collections)

### 1️⃣ Crops

* Name, category, price, quantity
* Dealer reference
* Harvest details
* Location

### 2️⃣ Dealers

* Business details
* WhatsApp contact
* Address & location

### 3️⃣ Farmers

* Personal details
* Farm size
* Authentication

### 4️⃣ Loans

* Farmer loan information
* Repayment tracking

---

# 📱 Application Flow

### Dealer

1. Login → Dashboard
2. Add or manage crops
3. Update profile & business info
4. Receive reviews & connect with farmers

### Farmer

1. Login → eMandi
2. Browse/search crops
3. See dealer details
4. Contact via WhatsApp
5. Compare prices & buy

---

# 🔐 Security Highlights

* JWT-based authentication
* API route protection
* Sanitized inputs
* Environment-based config
* Error-handling middleware

---

# 📡 API Endpoints

### 🔑 Authentication

* `POST /api/dealer/register`
* `POST /api/dealer/login`
* `POST /api/farmer/register`
* `POST /api/farmer/login`

### 🌾 Crops

* `GET /api/crops`
* `POST /api/crops`
* `PUT /api/crops/:id`
* `DELETE /api/crops/:id`
* `GET /api/crops/dealer`

### 👤 Profile

* Dealer: GET/PUT `/api/dealer/profile`
* Farmer: GET/PUT `/api/farmer/profile`

### ⭐ Reviews

* `GET /api/dealer/reviews`
* `POST /api/dealer/reviews`
* `PUT /api/dealer/reviews/:id`
* `DELETE /api/dealer/reviews/:id`

### 🌍 Language API

* `GET /api/languages`
* `PUT /api/user/language`

---

# 🛠️ Installation & Setup

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# 🔮 Future Enhancements

* Analytics dashboard
* Real-time alerts
* Mobile app (React Native)
* Logistics integration
* Market price predictions
* Payment gateway integration
* AI pest/disease detection

---

# 📜 License

**MIT License**

---

# 📌 Project Status

✔️ Production Ready
✔️ Last Updated: **2025**
✔️ Version **1.0.0**
