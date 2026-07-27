# 🗄️ Database Design Document

# StudyHub
### Learning Management System (LMS)

**Version:** 0.1

**Database:** PostgreSQL

**Status:** Planning

---

# Table of Contents

1. Introduction
2. Database Goals
3. Database Technology
4. Database Architecture
5. Entity Relationship Overview
6. Tables
7. Relationships
8. Constraints
9. Data Flow
10. Future Database Enhancements

---

# 1. Introduction

This document describes the database design for StudyHub.

The database is responsible for storing all information related to users, courses, lessons, assignments, quizzes, enrollments, and student progress.

The design follows normalization principles to reduce redundancy and improve maintainability.

---

# 2. Database Goals

The database should:

- Store data securely
- Prevent duplicate data
- Maintain relationships between tables
- Support future scalability
- Allow fast data retrieval
- Maintain data integrity

---

# 3. Database Technology

Database Management System

- PostgreSQL

Why PostgreSQL?

- Open Source
- Reliable
- Fast
- ACID Compliant
- Excellent SQL Support
- Supports Large Applications

---

# 4. Database Architecture

StudyHub follows a relational database model.

Frontend

↓

Node.js API

↓

PostgreSQL Database

All data is accessed through the backend APIs.

The frontend never communicates directly with the database.

---

# 5. Entity Relationship Overview

The main entities are:

- Users
- Courses
- Lessons
- Enrollments
- Assignments
- Submissions
- Quizzes
- Questions
- Results

---

# 6. Database Tables

---

## Users

Stores information about every user.

Fields

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| full_name | VARCHAR | User's full name |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password |
| role | VARCHAR | Student, Teacher, Admin |
| created_at | TIMESTAMP | Account creation |

---

## Courses

Stores available courses.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| title | VARCHAR |
| description | TEXT |
| teacher_id | UUID |
| created_at | TIMESTAMP |

---

## Lessons

Stores lessons for each course.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| course_id | UUID |
| title | VARCHAR |
| content | TEXT |
| created_at | TIMESTAMP |

---

## Enrollments

Stores which students are enrolled.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| student_id | UUID |
| course_id | UUID |
| enrolled_at | TIMESTAMP |

---

## Assignments

Stores assignments.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| course_id | UUID |
| title | VARCHAR |
| description | TEXT |
| due_date | DATE |

---

## Assignment Submissions

Stores student submissions.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| assignment_id | UUID |
| student_id | UUID |
| submission_file | VARCHAR |
| submitted_at | TIMESTAMP |
| marks | INTEGER |

---

## Quizzes

Stores quizzes.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| course_id | UUID |
| title | VARCHAR |

---

## Questions

Stores quiz questions.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| quiz_id | UUID |
| question | TEXT |
| option_a | VARCHAR |
| option_b | VARCHAR |
| option_c | VARCHAR |
| option_d | VARCHAR |
| correct_answer | VARCHAR |

---

## Quiz Results

Stores quiz scores.

Fields

| Column | Type |
|----------|----------|
| id | UUID |
| quiz_id | UUID |
| student_id | UUID |
| score | INTEGER |
| attempted_at | TIMESTAMP |

---

# 7. Relationships

Users

↓

Teacher creates

↓

Courses

↓

Courses contain

↓

Lessons

↓

Students enroll

↓

Enrollments

↓

Assignments

↓

Assignment Submissions

↓

Grades

---

Relationship Summary

- One Teacher → Many Courses
- One Course → Many Lessons
- One Course → Many Assignments
- One Course → Many Quizzes
- One Student → Many Enrollments
- One Assignment → Many Submissions
- One Quiz → Many Questions

---

# 8. Constraints

## Primary Keys

Every table has a unique primary key.

Example

Users.id

Courses.id

Assignments.id

---

## Foreign Keys

Courses.teacher_id

→ Users.id

Lessons.course_id

→ Courses.id

Assignments.course_id

→ Courses.id

Enrollments.student_id

→ Users.id

Enrollments.course_id

→ Courses.id

Submissions.assignment_id

→ Assignments.id

Quiz.quiz_id

→ Quizzes.id

---

## Unique Constraints

- Email must be unique.
- One student cannot enroll in the same course twice.

---

## Not Null Constraints

Required fields:

- Name
- Email
- Password
- Course Title

---

# 9. Database Flow

Example

Student registers

↓

User data

↓

Users table

↓

Student logs in

↓

Backend verifies credentials

↓

Student enrolls

↓

Enrollment table

↓

Teacher uploads assignment

↓

Assignments table

↓

Student submits work

↓

Assignment Submissions table

↓

Teacher grades submission

↓

Marks updated

---

# 10. Future Database Enhancements

The following tables may be added later:

- Notifications
- Attendance
- Certificates
- Chat Messages
- Discussion Forum
- Video Lectures
- Announcements
- File Storage
- Audit Logs

---

# Security Considerations

- Passwords will never be stored as plain text.
- Passwords will be hashed using bcrypt.
- Sensitive database credentials will be stored in environment variables.
- SQL Injection protection will be implemented using parameterized queries.

---

# Performance Considerations

To improve performance:

- Create indexes on frequently searched columns.
- Use foreign keys for data integrity.
- Optimize SQL queries.
- Paginate large datasets.
- Avoid unnecessary duplicate data.

---

# Backup Strategy

Future versions will include:

- Automatic database backups
- Cloud backups
- Restore procedures

---

# ER Diagram (Initial Design)

                USERS
                  │
        ┌─────────┴─────────┐
        │                   │
   STUDENT             TEACHER
        │                   │
        │              Creates
        │                   │
        └────────► COURSES ◄────────┐
                    │               │
           ┌────────┴────────┐      │
           │                 │      │
       LESSONS         ASSIGNMENTS  │
                             │      │
                      SUBMISSIONS    │
                                    │
                          QUIZZES
                             │
                        QUESTIONS
                             │
                          RESULTS

---

# Conclusion

The StudyHub database is designed using a relational model that ensures data consistency, security, and scalability. By separating users, courses, lessons, assignments, quizzes, and results into dedicated tables, the system remains organized and maintainable as the application grows. This design also provides a solid foundation for future features such as attendance tracking, notifications, AI-assisted learning, and cloud-based file storage.
