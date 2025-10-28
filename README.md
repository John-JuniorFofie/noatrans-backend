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
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── server.ts
│
├── .env
├── .gitignore
├── package.json
└── README.md

yaml
Copy code

---

## 🔑 Environment Variables
Create a `.env` file in the root with:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/noatrans
ACCESS_TOKEN_SECRET=anylongrandomsecret
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
Once running:

bash
Copy code
http://localhost:5000/api-docs
👤 Author
John Fofie — Backend Developer
📧 noatransproject@gmail.com (optional)