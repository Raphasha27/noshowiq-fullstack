# NoShowIQ 🚀
**Predict. Optimize. Care.**

NoShowIQ is a real-time intelligent system designed to predict healthcare appointment no-shows, optimize schedule density (smart overbooking), and trigger automated interventions to recover revenue and reduce patient wait times.

---

## ✨ Features (v2.0 Enhanced)
- **Predictive Risk Scoring**: Advanced ML models analyze patient history and patterns to assign a "No-Show Probability".
- **Glassmorphism Dashboard**: A premium, high-fidelity interface optimized for both Desktop and Mobile (PWA support).
- **Smart Overbooking Engine**: Automatically identifies high-risk slots safe for double-booking to maximize clinical efficiency.
- **Dynamic Interventions**: Automated alerts (SMS/Email) and manual call task lists for staff based on risk thresholds.
- **Real-Time Synergy**: Integration between .NET Backend and Next.js Frontend via SignalR for live updates.

## 🛠 Tech Stack
- **Backend**: .NET 8 (Clean Architecture)
- **Frontend**: Next.js 14, TypeScript, CSS3 (Glassmorphism)
- **ML Engine**: Python (FastAPI, Scikit-learn)
- **Database**: PostgreSQL / SQL Server (Entity Framework Core)
- **Mobile**: PWA (Progressive Web App)

---

## 📂 Project Structure
```text
NoShowIQ/
├── NoShowIQ.API/          # .NET 8 Web API & SignalR Hubs
├── NoShowIQ.Core/         # Domain Entities & Interfaces
├── NoShowIQ.Application/  # Business Logic & Services
├── NoShowIQ.Infrastructure/# DB Context & Repositories
├── frontend/              # Next.js Dashboard (Premium UI)
└── ml_engine/             # Python ML Service & Training scripts
```

---

## 🚦 Getting Started

### 1. ML Engine
```bash
cd ml_engine
pip install -r requirements.txt
python main.py
```

### 2. Backend
```bash
# Ensure .NET 8 SDK is installed
cd NoShowIQ.API
dotnet run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🎤 The "IQ" Advantage
Unlike standard scheduling software, NoShowIQ uses **Bayesian Risk Modeling** to evaluate not just *if* a patient will show, but *when* it's safe to overbook without increasing patient wait times. This balances clinical throughput with patient satisfaction.

Built with ❤️ by **Raphasha27** (Enhanced by Antigravity)
