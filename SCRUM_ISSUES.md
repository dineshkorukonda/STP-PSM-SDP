# Smart Transport Pass System — Scrum Artifacts

Repository: https://github.com/dineshkorukonda/STP-PSM-SDP  
Live Demo: https://smartpass-psm.vercel.app

---

# Product Goal

Develop a centralized Smart Transport Pass System that allows users to create and manage a digital transport pass usable across buses, metro systems, and shared vehicles. The system should simplify public transport access, allow digital recharges, and track transport usage.

---

# Sprint Goal

Build the core functionality of the Smart Transport Pass System allowing users to:

- Register and log into the system
- Create a digital transport pass
- Recharge their pass
- Track travel usage
- View information in a dashboard

---

# Product Backlog

## Issue 1 — User Registration

Users should be able to create accounts in the system.

Acceptance Criteria:

- User enters name, email, password
- Data stored securely
- Duplicate users prevented

---

## Issue 2 — User Authentication (Login)

Users must log into the platform to manage their pass.

Acceptance Criteria:

- Email/password authentication
- Session creation
- Error handling for invalid login

---

## Issue 3 — Digital Pass Creation

Users should generate a digital transport pass.

Acceptance Criteria:

- Unique pass ID generated
- Pass linked to user account
- Pass stored in database

Dependencies:

User Registration  
User Authentication

---

## Issue 4 — Pass Recharge System

Users should recharge their transport pass.

Acceptance Criteria:

- Recharge amount input
- Balance updated
- Transaction recorded

Dependencies:

Digital Pass Creation

---

## Issue 5 — Transport Usage Tracking

System records user travel history.

Acceptance Criteria:

- Store trip records
- Track transport type
- Maintain timestamp history

Dependencies:

Digital Pass Creation

---

## Issue 6 — User Dashboard

Provide interface showing pass information.

Dashboard displays:

- Pass ID
- Balance
- Recharge history
- Usage history

Dependencies:

Authentication  
Pass Creation  
Recharge System

---

# Increment

Final system increment includes:

- User authentication
- Digital pass creation
- Recharge system
- Usage tracking
- Dashboard interface

Working Deployment:

https://smartpass-psm.vercel.app

Source Code:

https://github.com/dineshkorukonda/STP-PSM-SDP
