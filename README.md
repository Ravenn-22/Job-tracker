# Georn — Job Application Tracker

A full-stack job search management app built for serious job seekers. Track every application, manage interviews, store resumes, and get automated email reminders — all in one clean, minimal dashboard.

🔗 **Live:** [job-tracker-five-pied.vercel.app](https://job-tracker-five-pied.vercel.app)

---

## Features

- **Kanban Board** — drag and drop applications across Wishlist, Applied, Interview, Offer, and Rejected stages
- **Interview Tracking** — log every interview round, interviewer, date, and outcome per application
- **Email Reminders** — automated daily reminders for follow-up dates and application deadlines via Brevo
- **Resume Manager** — upload and manage multiple resume versions via Cloudinary
- **Events Page** — unified view of all upcoming interviews and follow-ups grouped by date
- **Salary Insights** — track salary ranges across applications and understand your market value
- **Notes Timeline** — timestamped running log of notes per application
- **Job Description Storage** — paste and store full job descriptions per application
- **Deadline Tracker** — countdown badges on application cards for upcoming deadlines
- **Export to CSV** — download all applications as a spreadsheet
- **Dark Mode** — full dark mode with persistent preference
- **Responsive Design** — fully optimized for mobile with a floating dock navigation

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Brevo (transactional email)
- Cloudinary (resume storage)
- node-cron (scheduled reminders)

### Frontend
- React + Vite
- React Router
- @dnd-kit (drag and drop)
- Recharts (dashboard charts)
- Axios
- Motion (floating dock animation)
- canvas-confetti

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Brevo account
- Cloudinary account

### Backend Setup

```bash
git clone https://github.com/Ravenn-22/georn-api.git
cd georn-api
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_sender_email
CLIENT_URL=https://your-vercel-url.vercel.app
```

Run the server:

```bash
npm run dev
```

### Frontend Setup

```bash
git clone https://github.com/Ravenn-22/georn-client.git
cd georn-client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the app:

```bash
npm run dev
```

---

## Project Structure

### Backend
src/

├── config/         # DB, email, scheduler, keep-alive

├── controllers/    # Auth, applications, resumes

├── middleware/     # JWT auth middleware

├── models/         # User, Application, Resume

└── routes/         # Auth, application, resume routes

### Frontend
src/

├── api/            # Axios instance

├── assets/         # Images and illustrations

├── components/     # Shared and feature components

├── context/        # Auth and theme context

├── hooks/          # Custom hooks

├── pages/          # All page components

└── styles/         # Global styles

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/stats` | Get dashboard stats |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| POST | `/api/applications/:id/interviews` | Add interview round |
| PUT | `/api/applications/:id/interviews/:interviewId` | Update interview |
| DELETE | `/api/applications/:id/interviews/:interviewId` | Delete interview |
| POST | `/api/applications/:id/notes` | Add note |
| DELETE | `/api/applications/:id/notes/:noteId` | Delete note |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all resumes |
| POST | `/api/resumes` | Upload resume |
| PUT | `/api/resumes/:id` | Rename resume |
| DELETE | `/api/resumes/:id` | Delete resume |

---

## Author

**Raven (Shonaike Temitayo)**
- GitHub: [@Ravenn-22](https://github.com/Ravenn-22)
- Twitter: [@Raheemii\_](https://twitter.com/Raheemii_)
- LinkedIn: [linkedin.com/in/shonaiketemitayo](https://linkedin.com/in/shonaiketemitayo)

---

## License

MIT