# NyayaDoot – Justice Access Platform

**NyayaDoot** is an open-source platform built to improve public access to justice in India. It integrates AI, data analytics, and legal tools to empower citizens, law students, NGOs, and policymakers with transparent, intelligent, and actionable solutions.

---

## 🚀 Key Features

### 🧠 LegalEase GPT (AI Chatbot)
- Ask legal questions in simple language.
- Supports **local languages** (via multilingual NLP).
- Uses **RAG-based system** for accurate, law-aligned answers.

### 🔗 Lawyer-Connect
- Matches users with **pro bono lawyers** or **law students**.
- Filters based on domain (e.g., criminal, civil, RTI, women’s rights).

### 🕊️ WhistleSafe
- Anonymous platform for reporting **corruption** or **misconduct**.
- Uses NLP to assess **credibility** of reports.
- Admin dashboard for reviewing flagged content.

### 📊 GovWatch
- Upload project data (CSV/JSON) to detect **corruption risk**.
- Visual indicators for fraud-prone patterns.
- Score-based transparency evaluation.

### 🗺️ Justice Access Heatmap
- Visual map of **state-wise access to justice** metrics.
- Highlights gaps in infrastructure, legal aid, case backlog, etc.
- Provides actionable insights and recommendations.

---

## 💡 Tech Stack

- **Frontend**: HTML, CSS, JS 
- **Backend**:  Flask
- **Database**: MySQL 
- **AI/ML**: RAG based LLM legal aid system
- **Data**: NCRB, eCourts, NFHS, RTI, Legal datasets
- **Visualization**: Chart.js

---

## 📁 Folder Structure

```
nyayadoot/
├── legalgpt/             # Legal chatbot module
├── govwatch/             # Corruption risk detection
├── whistle_safe/         # Anonymous reporting system
├── heatmap/              # Justice Access visualization
├── lawyer_connect/       # Matchmaking engine
├── static/, templates/   # UI assets and pages
├── app.py / main.py      # Entry point
└── README.md
```

---

## 🧪 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Soumaditya777/Nyayadoot.git
cd nyayadoot
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the app

```bash
python app.py
```

> Make sure to set up `.env` for OpenAI API keys or other secrets.

---

## 🎯 Vision

NyayaDoot aims to:
- **Bridge the justice gap** for underserved populations.
- Leverage **AI responsibly** to simplify legal processes.
- Promote **transparency and accountability** in governance.

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## 🤝 Contributing

We welcome contributions! Feel free to:
- Fork the repo
- Open issues
- Suggest improvements
- Submit pull requests

---

## 📬 Contact

Built with ❤️ by Team HouseStark ( Hack4SDG Winner )
🔗 [GitHub](https://github.com/Soumaditya777)  

---

> "Justice should not only be done, but should manifestly and undoubtedly be seen to be done."
