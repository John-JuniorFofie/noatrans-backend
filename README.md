#  NoaTrans Backend

**NoaTrans** is a backend API for a Ghanaian language learning platform that supports translation, courses, and user facilitation across local dialects like Akan, Ewe, Ga and the other Ghanaian lanuages.

---

##  Tech Stack
- **Language:** TypeScript  
- **Framework:** Express.js (Node.js)  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT  
- **Docs:** Swagger UI  
- **Env Management:** dotenv  

---

## Project Structure
noatrans-backend/
│
├── src/
│   ├── config/          
│   ├── controllers/     
│   ├── models/          
│   ├── routes/          
│   ├── middlewares/     
│   ├── services/        
│   ├── types/           
│   └── server.ts       
│
├── package.json         
├── tsconfig.json        
└── README.md          


yaml
Copy code

---

 Setup & Run Locally
bash
Copy code
# 1. Clone the repo
git clone /https://github.com/John-JuniorFofie/project-3
cd noatrans-backend

# 2. Install dependencies
npm install

# 3. Run in dev mode
npm run dev
API Docs


bash
Copy code
http://localhost:5000/api-docs
 Author
John Fofie — Backend Developer
johnfofie31@gmail.com