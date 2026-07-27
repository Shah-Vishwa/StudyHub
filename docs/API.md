# 🌐 StudyHub API Documentation

## Project

StudyHub - Learning Management System

---

# Overview

This document describes the REST APIs used by the StudyHub application.

Status: 🚧 Planning Phase

---

# Base URL

Development

http://localhost:5000/api

Production

(To be added after AWS deployment)

---

# Authentication

JWT Authentication

Role-Based Access Control

Roles:

- Student
- Teacher
- Admin

---

# Planned API Endpoints

## Authentication

POST /api/auth/register

Description:
Register a new user.

Status:
Planned

---

POST /api/auth/login

Description:
Login user.

Status:
Planned

---

GET /api/auth/profile

Description:
Get logged-in user's profile.

Status:
Planned

---

# Courses

GET /api/courses

Description:
Get all courses.

Status:
Planned

---

GET /api/courses/:id

Description:
Get course details.

Status:
Planned

---

POST /api/courses

Description:
Create new course.

Status:
Planned

Teacher/Admin only

---

PUT /api/courses/:id

Description:
Update course.

Status:
Planned

---

DELETE /api/courses/:id

Description:
Delete course.

Status:
Planned

---

# Assignments

GET /api/assignments

Status:
Planned

POST /api/assignments

Status:
Planned

PUT /api/assignments/:id

Status:
Planned

DELETE /api/assignments/:id

Status:
Planned

---

# Quiz

GET /api/quizzes

Status:
Planned

POST /api/quizzes

Status:
Planned

---

# Notes

GET /api/notes

Status:
Planned

POST /api/notes

Status:
Planned

---

# Dashboard

GET /api/dashboard/student

Status:
Planned

GET /api/dashboard/teacher

Status:
Planned

GET /api/dashboard/admin

Status:
Planned

---

# Future APIs

- Notifications
- Certificates
- Search
- Chat
- AI Assistant
- Analytics

---

Last Updated

Sprint 0