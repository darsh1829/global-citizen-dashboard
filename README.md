# 🌍 Global Citizen Dashboard
 
A personalized, all-in-one dashboard that gives users a daily snapshot of the world — news, crypto markets, and currency exchange rates — tailored to their interests, with AI-generated insights layered on top.
 
🔗 **Live:** [global-citizen.darssh.dev](https://global-citizen.darssh.dev)
 
---
 
## 🛠 Tech Stack
 
| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Shadcn/UI |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcrypt |
| AI | Google Gemini 2.5/3.5 Flash |
| Hosting | Vercel (frontend) + Render (backend) |
 
---
 
## ✨ Features
 
### Core
- **Auth & Onboarding** — sign up, log in, choose countries and cryptos you care about
- **Home Dashboard** — top news, crypto heatmap, and FX rates at a glance
- **News Page** — full live news feed powered by GNews
- **Crypto Page** — real-time prices and 24h change for tracked coins
- **Currency Page** — 160+ currency rates with built-in converter and search
- **Settings** — update your display name and preferences anytime
### AI (Powered by Google Gemini)
- ✅ **Insight of the Day** — synthesizes today's headlines into one concise world insight
- 🔜 **Market Mood** — sentiment score (Positive / Neutral / Negative) on the news cycle
- 🔜 **Crypto Context** — AI explains why a coin is moving based on current news
---
 
## 🔌 External APIs
 
| Data | Service |
|------|---------|
| 📰 News | [GNews API](https://gnews.io) |
| 💰 Crypto | [CoinGecko](https://coingecko.com) |
| 💱 Currency | [FreeCurrencyAPI](https://freecurrencyapi.com) |
 
---
 
## 🚀 Running Locally
 
### Prerequisites
- Node.js 18+
- PostgreSQL (local or Neon)
### Backend
```bash
cd backend
npm install
# Create a .env file with the variables below
node index.js
```
 
### Frontend
```bash
cd frontend
npm install
npm run dev
```
 
### Environment Variables
 
**`backend/.env`**
```env
JWT_SECRET=your_jwt_secret
GNEWS_API_KEY=your_key
FREECURRENCY_API_KEY=your_key
GEMINI_API_KEY=your_key
DATABASE_URL=your_neon_connection_string
```
 
**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5173
```
 
### Database Setup
Run the schema in `backend/database.sql` against your PostgreSQL instance to create the `users` and `preferences` tables.
 
---
 
## 📁 Project Structure
 
```
global-citizen-dashboard/
├── backend/
│   ├── middleware/      # JWT auth middleware
│   ├── db.js            # PostgreSQL connection
│   ├── server.js        # Express routes + API integrations
│   └── database.sql     # DB schema
└── frontend/
    └── src/
        ├── components/  # DashboardLayout, UI components
        ├── pages/       # Login, Register, Onboarding, Dashboard, News, Crypto, Currency, Settings
        └── services/    # Centralized API service (api.ts)
```
 
---
 
## 📄 License
 
MIT

---
## Credits
<a href="https://icons8.com/icon/j2D-17SBxXAJ/globe-showing-asia-australia">Globe Showing Asia Australia</a> icon by <a href="https://icons8.com">Icons8</a>
