# 🌱 EcoAudit

EcoAudit is a community waste logging and environmental awareness web application that allows users to record waste reports, track disposal locations on an interactive map, and visualize community waste data for better sustainability practices.

## 🚀 Features

- Log waste reports with category and weight
- Automatic location capture using browser geolocation
- Interactive map visualization using Leaflet.js
- View submitted waste logs
- Lightweight JSON-based data storage
- Clean and responsive UI with eco-friendly design

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Leaflet.js

### Backend
- Node.js
- Express.js

### Data Storage
- JSON File Storage (`data.json`)

---

## 📂 Project Structure

```
EcoAudit/
│
├── client/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server/
│   ├── server.js
│   ├── data.json
│   ├── package.json
│   ├── routes/
│   └── models/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nethra152007/EcoAudit.git
```

### 2. Navigate to the Server Folder

```bash
cd EcoAudit/server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

```bash
node server.js
```

Server will run on:

```text
http://localhost:5000
```

### 5. Run the Frontend

Open `client/index.html` using VS Code Live Server.

---

## 🌍 How It Works

1. User selects a waste category.
2. User enters waste weight.
3. Browser captures the user's location.
4. Data is sent to the Express backend.
5. Waste reports are stored in `data.json`.
6. Submitted reports are displayed on the page and plotted on the map.

---

## 📸 Key Functionalities

- Waste logging
- Geolocation tracking
- Interactive mapping
- Data persistence
- Environmental awareness support

---

## 🔮 Future Enhancements

- User authentication
- Database integration (MongoDB)
- Waste analytics dashboard
- Image upload support
- Community leaderboard
- Admin panel

---

## 👩‍💻 Author

**Nethra Babuji**

Integrated M.Tech Computer Science & Engineering (Data Science)  
VIT Chennai

---

## 📄 License

This project was developed for educational and community awareness purposes.
