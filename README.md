# NoteSync – MERN Stack Educational Platform

## Overview

**NoteSync** is a MERN stack based educational web platform designed to help engineering students access academic resources in one place.
The platform allows students to access **semester-wise notes, previous year question papers (PYQs), aptitude preparation materials, and a community discussion forum similar to Quora.**

The system aims to simplify learning by organizing resources and enabling peer interaction.

---

# Features

## 1. Notes Section

* Semester-wise academic notes
* Subject-based organization
* Easy access for students preparing for exams
* Structured resource browsing

## 2. Previous Year Question Papers (PYQs)

* Organized by semester and subject
* Helps students prepare using past exam patterns
* Quick navigation to required papers

## 3. Aptitude Preparation

* Aptitude questions for placement preparation
* Practice materials to improve logical and quantitative skills
* Useful for campus placement preparation

## 4. Ask & Answer (Quora-like Forum)

* Students can post questions
* Other users can answer questions
* Community knowledge sharing
* Discussion-based learning

## 5. User Authentication

* User login system
* Identification using USN or user credentials
* Role based access for content interaction

## 6. Modern Web Interface

* Clean UI built with React
* Navigation across different academic services
* Interactive frontend experience

---

# Tech Stack

### Frontend

* React.js
* HTML
* CSS
* JavaScript

Frontend code is located in:

```
mce-prep-frontend
```

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Version Control

* Git
* GitHub

---

# Project Structure

```
NoteSync
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── mce-prep-frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.js
│   │
│   └── package.json
│
└── README.md
```

---

# System Architecture

```
                ┌─────────────────────┐
                │      Frontend       │
                │     React.js UI     │
                │ (mce-prep-frontend) │
                └──────────┬──────────┘
                           │ API Calls
                           │
                ┌──────────▼──────────┐
                │       Backend       │
                │   Node.js + Express │
                │   REST API Server   │
                └──────────┬──────────┘
                           │
                           │ Database Queries
                           │
                ┌──────────▼──────────┐
                │       MongoDB       │
                │   Stores Users,     │
                │ Questions, Notes,   │
                │ and Resources       │
                └─────────────────────┘
```

---

# Installation and Setup

## 1. Clone Repository

```
git clone https://github.com/Ankitha2807/NoteSync.git
```

---

## 2. Backend Setup

Navigate to backend folder

```
cd server
```

Install dependencies

```
npm install
```

Start server

```
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

## 3. Frontend Setup

Navigate to frontend folder

```
cd mce-prep-frontend
```

Install dependencies

```
npm install
```

Run frontend

```
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# Usage

Students can:

1. Browse notes for different semesters
2. Access previous year question papers
3. Practice aptitude questions
4. Post questions and answers in the discussion forum
5. Collaborate and learn from peers

Admins can:

1.File upload for notes and study materials
2.Upload answers for the questions which the students are asking for
3.Post aptitude questions
4.Upload year wise question papers

---

# Future Improvements

Possible future enhancements:

* AI-based doubt answering system
* Personalized learning recommendations
* Quiz and test modules
* Notifications for answers and discussions

---

# Author

**Ankitha K N**
MERN Stack Developer


