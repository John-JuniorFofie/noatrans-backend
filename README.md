# 🗣️ NoaTrans Backend

**NoaTrans** is a backend API for a Ghanaian language learning platform that supports translation, courses, and user facilitation across local dialects like Akan, Ewe, Ga and the other Ghanaian lanuages.

---

## ⚙️ Tech Stack
- **Language:** TypeScript  
- **Framework:** Express.js (Node.js)  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT  
- **Docs:** Swagger UI  
- **Env Management:** dotenv  

---

## 📁 Project Structure
noatrans-backend/
│
├── src/
│   ├── config/          # Configuration files (DB, environment, etc.)
│   ├── controllers/     # Request handlers for different routes
│   ├── models/          # Mongoose models and schemas
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Authentication and validation middleware
│   ├── services/        # Business logic and external integrations
│   ├── types/           # TypeScript interfaces and custom types
│   └── server.ts        # Application entry point
│
├── package.json         # Dependencies and project scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation


yaml
Copy code

---

🧩 Setup & Run Locally
bash
Copy code
# 1. Clone the repo
git clone /https://github.com/John-JuniorFofie/project-3
cd noatrans-backend

# 2. Install dependencies
npm install

# 3. Run in dev mode
npm run dev
📚 API Docs


bash
Copy code
http://localhost:5000/api-docs
👤 Author
John Fofie — Backend Developer
johnfofie31@gmail.com