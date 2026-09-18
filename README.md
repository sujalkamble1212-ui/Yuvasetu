# YuvaSetu - Student Placement Portal
> **“Connecting Students to Careers”**

A modern, full-stack college placement portal mini-project built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, featuring local file storage for resumes and profile photos, automated student eligibility screening, comprehensive admin management, and an Express.js audit logging middleware.

---

## 🌟 Visual Design & Aesthetics

- **Custom SVG Logo**: Designed with a dynamic bridge arch (*Setu*) connecting education and youth (*Yuva*) to professional careers.
- **Split-Screen Authentication (Ref Image 2)**: Sleek high-contrast dark form on the left with one-click demo credentials, paired with a vibrant purple hero showcase on the right.
- **Card-Based Dashboard (Ref Image 1)**: Crisp floating cards with soft shadows, rounded corners, colorful highlight widgets (Violet, Teal, Coral), academic stats, and an upcoming drive deadline schedule.
- **Multi-Device Screen Support**: Fully responsive across desktop (sticky sidebar), tablet (adaptive grid), and mobile (slide-over drawer + bottom navigation dock).

---

## 🚀 Technology Stack

- **Frontend**: React 18 (Vite), React Router v6, Lucide Icons, Vanilla CSS design system
- **Backend**: Node.js, Express.js REST API, Modular MVC architecture
- **Database**: MongoDB (MongoDB Atlas / Local MongoDB with automatic in-memory fallback)
- **File Storage**: Local filesystem storage:
  - `backend/uploads/profile-photos/` (Images: JPG, PNG, WEBP, max 2MB)
  - `backend/uploads/resumes/` (Documents: PDF, DOC, DOCX, max 5MB)
- **Security**: Password hashing with `bcryptjs`, JWT token authentication, role-based authorization (`student` vs `admin`), file MIME/size validation.

---

## 🔑 Default Demo Credentials

Pre-seeded in the database for instant evaluation:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@yuvasetu.edu` | `Student@123` | Sara Sharma (B.Tech CSE, 8.7 CGPA, 0 Backlogs) |
| **🎓 Student 2** | `rahul@yuvasetu.edu` | `Rahul@123` | Rahul Verma (B.Tech IT, 7.8 CGPA, 1 Backlog) |
| **🛡️ Admin / TPO** | `admin@yuvasetu.edu` | `Admin@123` | College Placement Cell Officer |

*(Quick demo buttons are also integrated directly into the login screen).*

---

## 📂 Project Architecture

```text
Yuva_setu/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # Database connection with Atlas & fallback
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, Login, Me, Logout
│   │   │   ├── studentController.js    # Profile, Photo, Education, Academics, Skills, Resume
│   │   │   ├── driveController.js      # Drives listing, eligibility check, CRUD
│   │   │   ├── applicationController.js# Apply, My applications, Status update
│   │   │   ├── adminController.js      # Metrics stats, student directory & profiles
│   │   │   └── logController.js        # Filterable activity logs & audit purge
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT protect & role authorize
│   │   │   ├── uploadMiddleware.js     # Multer local storage & MIME validation
│   │   │   ├── activityLogger.js       # Express request logging interceptor
│   │   │   └── errorHandler.js         # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js                 # User credentials & roles
│   │   │   ├── StudentProfile.js       # Profile, contact, photo, academics, skills, resume ref
│   │   │   ├── Education.js            # 10th, 12th, Diploma, Graduation, Post-Graduation
│   │   │   ├── PlacementDrive.js       # Company, role, CTC, criteria, deadlines
│   │   │   ├── Application.js          # Drive-Student unique application & status
│   │   │   └── ActivityLog.js          # Audit trails (method, endpoint, IP, response time)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   ├── driveRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── logRoutes.js
│   │   ├── utils/
│   │   │   └── seedData.js             # Initial demo database populator
│   │   └── server.js                   # Main Express application & static upload host
│   ├── uploads/
│   │   ├── profile-photos/             # Local student avatars
│   │   └── resumes/                    # Local candidate resumes
│   ├── .env                            # Backend configuration
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── logo.svg                    # Vector brand logo with tagline
│   │   └── logo-icon.svg               # Mobile brand emblem / favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx             # Nav sidebar with user profile & active states
│   │   │   ├── Navbar.jsx              # Mobile top bar & bottom navigation dock
│   │   │   ├── Modal.jsx               # Reusable dialog modal
│   │   │   ├── StatusBadge.jsx         # Colorful status chip component
│   │   │   └── ProtectedRoute.jsx      # Role-based route guardian
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state & session provider
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Split auth login (Ref Image 2)
│   │   │   ├── Register.jsx            # Student / Admin registration
│   │   │   ├── StudentDashboard.jsx    # Hero cards & drive schedule (Ref Image 1)
│   │   │   ├── StudentProfile.jsx      # Personal details & local photo upload
│   │   │   ├── EducationPage.jsx       # 10th, 12th, Diploma, UG, PG milestones
│   │   │   ├── CurrentAcademicPage.jsx # Course, CGPA, backlogs & graduation year
│   │   │   ├── SkillsPage.jsx          # Technical skills manager & quick pills
│   │   │   ├── ResumePage.jsx          # Local resume upload, preview, replace, delete
│   │   │   ├── DrivesPage.jsx          # Drive list, criteria match, instant apply
│   │   │   ├── ApplicationsPage.jsx    # Stage pipeline (Applied, Shortlisted, Selected)
│   │   │   ├── AdminDashboard.jsx      # Overview metrics, funnels, shortcuts
│   │   │   ├── AdminDrives.jsx         # Drive CRUD & criteria manager
│   │   │   ├── AdminApplications.jsx   # Candidate applicant screening & status updater
│   │   │   ├── AdminStudents.jsx       # Registered student directory & full inspector
│   │   │   └── AdminLogs.jsx           # Audit log viewer with filters (User, Action, Status, Date)
│   │   ├── services/
│   │   │   └── api.js                  # Frontend REST API client
│   │   ├── App.jsx                     # Route definitions & layout wrappers
│   │   ├── index.css                   # Responsive design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Quick Setup & Run Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # (Optional) Populates demo drives, students, and audit logs
npm start        # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser to access the YuvaSetu portal.

---

## 📑 Feature Walkthrough

### 1. Student Portal
- **Dashboard**: High-level overview of readiness, active openings, and scheduled drive deadlines.
- **Smart Eligibility**: Automatically checks candidate's CGPA, active backlogs, and deadline before allowing application submission.
- **Resume Management**: Upload, preview, download, replace, or delete your local resume file (`.pdf`, `.doc`, `.docx`).
- **Profile & Education**: Multi-level education editor (10th, 12th, Diploma, Graduation, Post-Graduation) and current academic standing.
- **Skills**: Interactive skill tagger with quick-add pills.
- **Application Tracking**: Real-time progress visualizer (*Applied → Shortlisted → Selected / Rejected*) with placement officer remarks.

### 2. Admin / Placement Cell Portal
- **Recruitment Analytics**: Key metrics (Total students, active drives, applications, selected offers).
- **Drive Management**: Full CRUD to create, edit, close, or delete drives with specific CGPA/backlog thresholds.
- **Application Screening**: Review candidate profiles, download resumes, and update recruitment status.
- **Student Directory**: Search all registered students and inspect their full multi-tier academic history.
- **Activity Audit Logs**: Express logging middleware logs every registration, login, profile edit, application, and status change with IP address, HTTP method, endpoint, status code, and response time.
