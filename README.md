# Portfolio Builder

Portfolio Builder is a web application that allows users to create their own personal portfolio website and share it using a custom link.

Users can sign up, add their personal information, showcase projects, work experience, skills, and contact details — all from a dashboard. Once saved, the app generates a unique portfolio URL that can be shared with recruiters, clients, or anyone online.

The goal of this project is to make portfolio creation simple and accessible without needing to manually code a personal website every time.

---

## Features

### User Authentication
- Sign up and login using Firebase Authentication

### Profile Management
Users can create and edit:
- Name
- Bio / About section
- Skills
- Profile image

### Projects Section
Users can add multiple projects with:
- Project title
- Description
- Project image
- GitHub repository link
- Live demo link

### Experience Section
Users can add professional experience including:
- Role
- Company name
- Start date
- End date
- Description

### Contact Section
Users can add contact details like:
- Phone number
- Email
- LinkedIn
- GitHub

### Custom Portfolio URL
Each user gets a custom portfolio link based on their name.

Example:

```bash
/portfolio/nibah-kondvilkar
```

This makes the portfolio easy to share publicly.


## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Router DOM

**Backend / Database**
- Firebase Firestore

**Authentication**
- Firebase Authentication

**Deployment**
- Vercel

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Nibah-Kondvilkar/portfolio-builder.git
```

Move into project folder:

```bash
cd portfolio-builder
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---


