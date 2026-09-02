BRO, I WANT TO FINALIZE AND DOCUMENT/VERIFY THE COMPLETE BACKEND API STRUCTURE FOR MY CHURCH MANAGEMENT SYSTEM.

IMPORTANT:
- DO NOT BREAK ANY CURRENTLY WORKING API.
- DO NOT DELETE OR REWRITE working functionality unnecessarily.
- FIRST inspect my existing backend files, database tables, middleware, controllers, models, and routes.
- Reuse my existing naming conventions and database column names.
- If an API already exists and works, preserve its implementation.
- Only fix/adjust something if it is actually required.
- Do NOT create duplicate routes.
- Do NOT create duplicate tables.
- Keep Super Admin and Sub Admin completely separated by authorization and branch access.
- All protected APIs must use the existing authentication middleware.
- Super Admin can access ALL branches.
- Sub Admin can access ONLY their assigned branch.
- NEVER trust branch_id sent from the frontend/Postman for Sub Admin access. Always use req.user.branch_id from the authenticated JWT.
- Use proper HTTP status codes.
- Return consistent JSON responses with success, message, and data where appropriate.

========================================================
PROJECT
========================================================

Backend:
Node.js + Express + MySQL

Main backend structure:

backend/
├── config/
│   └── database.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── superadmin/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── subadmin/
│   ├── controllers/
│   ├── models/
│   └── routes/
└── server.js

========================================================
ROLE STRUCTURE
========================================================

SUPER_ADMIN
    |
    ├── Can see/manage ALL branches
    ├── Can create/update/delete branches
    ├── Can create/manage Sub Admins
    ├── Can allocate funds to branches
    ├── Can send notifications to ALL branches
    ├── Can send notifications to ONE specific branch
    ├── Can see global dashboard
    └── Can see global analytics

SUB_ADMIN
    |
    └── Assigned to exactly ONE branch
            |
            ├── Members
            ├── Pastors / Leaders
            ├── Prayer Schedules
            ├── Events
            ├── Donations
            ├── Funds allocated by Super Admin
            ├── Super Admin notifications
            ├── Dashboard
            └── Analytics

========================================================
AUTHENTICATION
========================================================

All protected APIs require:

Server running on http://localhost:5000

Authorization: Bearer <JWT_TOKEN>

Super Admin APIs must require:
SUPER_ADMIN

Sub Admin APIs must require:
SUB_ADMIN

Use the existing:
authMiddleware
roleMiddleware

Do not create a second authentication system if one already exists.

========================================================
SUPER ADMIN API
========================================================

BASE:

/api/superadmin

========================================================
1. SUPER ADMIN AUTH
========================================================

POST /api/superadmin/auth/login

Request:

{
  "email": "admin@church.com",
  "password": "Admin@123"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "SUPER_ADMIN"
  }
}


GET /api/superadmin/auth/profile

Response:

{
  "success": true,
  "message": "Profile fetched successfully",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE"
  }
}

========================================================
2. SUPER ADMIN BRANCH MANAGEMENT
========================================================

POST /api/superadmin/branches

Request:

{
  "name": "Trichy Main Branch",
  "address": "Trichy, Tamil Nadu",
  "phone": "9876543211",
  "email": "trichy@church.com"
}

Response:

{
  "success": true,
  "message": "Branch created successfully",
  "branch": {
    "id": 2,
    "name": "Trichy Main Branch",
    "address": "Trichy, Tamil Nadu",
    "phone": "9876543211",
    "email": "trichy@church.com",
    "status": "ACTIVE"
  }
}


GET /api/superadmin/branches

Response:

{
  "success": true,
  "branches": [
    {
      "id": 2,
      "name": "Trichy Main Branch",
      "status": "ACTIVE"
    },
    {
      "id": 3,
      "name": "Madurai Branch",
      "status": "ACTIVE"
    }
  ]
}


GET /api/superadmin/branches/:id

Response:

{
  "success": true,
  "branch": {
    "id": 2,
    "name": "Trichy Main Branch",
    "address": "Trichy, Tamil Nadu",
    "phone": "9876543211",
    "email": "trichy@church.com",
    "status": "ACTIVE"
  }
}


PUT /api/superadmin/branches/:id

Request:

{
  "name": "Trichy Main Branch",
  "address": "Trichy, Tamil Nadu",
  "phone": "9876543211",
  "email": "trichy@church.com"
}

Response:

{
  "success": true,
  "message": "Branch updated successfully"
}


PATCH /api/superadmin/branches/:id/status

Request:

{
  "status": "INACTIVE"
}

Response:

{
  "success": true,
  "message": "Branch status updated successfully"
}


DELETE /api/superadmin/branches/:id

Response:

{
  "success": true,
  "message": "Branch deleted successfully"
}

========================================================
3. SUPER ADMIN SUB ADMIN MANAGEMENT
========================================================

POST /api/superadmin/subadmins

Request:

{
  "name": "Trichy Branch Admin",
  "email": "trichyadmin@example.com",
  "password": "123456",
  "branch_id": 2
}

Response:

{
  "success": true,
  "message": "Sub Admin created successfully",
  "subadmin": {
    "id": 3,
    "name": "Trichy Branch Admin",
    "email": "trichyadmin@example.com",
    "role": "SUB_ADMIN",
    "branch_id": 2,
    "status": "ACTIVE"
  }
}


GET /api/superadmin/subadmins

Response:

{
  "success": true,
  "subadmins": [
    {
      "id": 3,
      "name": "Trichy Branch Admin",
      "email": "trichyadmin@example.com",
      "role": "SUB_ADMIN",
      "branch_id": 2,
      "branch_name": "Trichy Main Branch",
      "status": "ACTIVE"
    }
  ]
}


GET /api/superadmin/subadmins/:id

Response:

{
  "success": true,
  "subadmin": {
    "id": 3,
    "name": "Trichy Branch Admin",
    "email": "trichyadmin@example.com",
    "role": "SUB_ADMIN",
    "branch_id": 2,
    "branch_name": "Trichy Main Branch"
  }
}


PUT /api/superadmin/subadmins/:id

Request:

{
  "name": "Trichy Branch Admin",
  "email": "trichyadmin@example.com",
  "branch_id": 2
}

Response:

{
  "success": true,
  "message": "Sub Admin updated successfully"
}


DELETE /api/superadmin/subadmins/:id

Response:

{
  "success": true,
  "message": "Sub Admin deleted successfully"
}

========================================================
4. SUPER ADMIN DASHBOARD
========================================================

All dashboard data is GLOBAL across ALL branches.

GET /api/superadmin/dashboard/total-branches

Response:

{
  "success": true,
  "total_branches": 5
}


GET /api/superadmin/dashboard/total-members

Response:

{
  "success": true,
  "total_members": 425,
  "new_this_month": 32,
  "new_this_year": 180
}


GET /api/superadmin/dashboard/pastors

Response:

{
  "success": true,
  "total_pastors": 28
}


GET /api/superadmin/dashboard/donations

Response:

{
  "success": true,
  "this_month": 125000,
  "this_year": 1850000,
  "total": 4580000
}


GET /api/superadmin/dashboard/donations/highest

Response:

{
  "success": true,
  "this_month": {
    "branch_id": 2,
    "branch_name": "Trichy Main Branch",
    "amount": 45000
  },
  "this_year": {
    "branch_id": 2,
    "branch_name": "Trichy Main Branch",
    "amount": 480000
  }
}


GET /api/superadmin/dashboard/events

Response:

{
  "success": true,
  "upcoming_events": 15
}


GET /api/superadmin/dashboard/prayer

Response:

{
  "success": true,
  "prayers": [
    {
      "branch_id": 2,
      "branch_name": "Trichy Main Branch",
      "title": "Morning Prayer",
      "prayer_date": "2026-09-01",
      "start_time": "06:00:00",
      "end_time": "07:00:00"
    }
  ]
}


GET /api/superadmin/dashboard/announcements

Response:

{
  "success": true,
  "announcements": [
    {
      "id": 1,
      "branch_name": "Trichy Main Branch",
      "title": "Sunday Service",
      "message": "Sunday service at 9 AM"
    }
  ]
}

========================================================
5. SUPER ADMIN FUND ALLOCATION
========================================================

Super Admin allocates funds to individual branches.

POST /api/superadmin/funds

Request:

{
  "branch_id": 2,
  "amount": 50000,
  "description": "September Branch Fund"
}

Response:

{
  "success": true,
  "message": "Fund allocated successfully",
  "fund": {
    "id": 1,
    "branch_id": 2,
    "amount": 50000,
    "description": "September Branch Fund"
  }
}


GET /api/superadmin/funds

Response:

{
  "success": true,
  "funds": [
    {
      "id": 1,
      "branch_id": 2,
      "branch_name": "Trichy Main Branch",
      "amount": 50000,
      "description": "September Branch Fund",
      "created_at": "2026-09-01T10:30:00.000Z"
    }
  ]
}


GET /api/superadmin/funds/:id

PUT /api/superadmin/funds/:id

DELETE /api/superadmin/funds/:id

These are Super Admin only.

========================================================
6. SUPER ADMIN NOTIFICATIONS
========================================================

Super Admin can send notification to:

A. ALL BRANCHES
B. ONE SPECIFIC BRANCH

--------------------------------------------------------
SEND TO ALL
--------------------------------------------------------

POST /api/superadmin/notifications

Request:

{
  "title": "Sunday Prayer",
  "message": "Sunday prayer starts at 9 AM",
  "type": "GENERAL",
  "target_type": "ALL"
}

Response:

{
  "success": true,
  "message": "Notification sent successfully",
  "notification": {
    "id": 10,
    "title": "Sunday Prayer",
    "message": "Sunday prayer starts at 9 AM",
    "type": "GENERAL",
    "target_type": "ALL"
  }
}

This notification is visible to every branch.

--------------------------------------------------------
SEND TO ONE BRANCH
--------------------------------------------------------

POST /api/superadmin/notifications

Request:

{
  "title": "Trichy Meeting",
  "message": "Trichy branch meeting tomorrow",
  "type": "GENERAL",
  "target_type": "BRANCH",
  "branch_id": 2
}

Response:

{
  "success": true,
  "message": "Notification sent successfully",
  "notification": {
    "id": 11,
    "title": "Trichy Meeting",
    "message": "Trichy branch meeting tomorrow",
    "type": "GENERAL",
    "target_type": "BRANCH",
    "branch_id": 2
  }
}

ONLY Trichy branch can see this.

Madurai and Chennai MUST NOT see it.

========================================================
7. SUPER ADMIN ANALYTICS
========================================================

All analytics are GLOBAL across all branches.

GET /api/superadmin/analytics/branches

Response:

{
  "success": true,
  "data": [
    {
      "branch_id": 2,
      "branch_name": "Trichy Main Branch",
      "status": "ACTIVE",
      "total_members": 125,
      "total_pastors": 8,
      "total_donations": 1250000,
      "total_events": 5,
      "total_prayer_schedules": 3,
      "total_branch_notifications": 8
    }
  ]
}


GET /api/superadmin/analytics/members

Response:

{
  "success": true,
  "data": {
    "total_members": 425,
    "new_members_this_month": 32,
    "new_members_this_year": 180,
    "by_branch": [
      {
        "branch_id": 2,
        "branch_name": "Trichy Main Branch",
        "total_members": 125
      }
    ]
  }
}


GET /api/superadmin/analytics/pastors

Response:

{
  "success": true,
  "data": {
    "total_pastors": 28,
    "by_branch": [
      {
        "branch_id": 2,
        "branch_name": "Trichy Main Branch",
        "total_pastors": 8
      }
    ]
  }
}


GET /api/superadmin/analytics/donations

Response:

{
  "success": true,
  "data": {
    "donations_this_month": 125000,
    "donations_this_year": 1850000,
    "total_donations": 4580000,
    "by_branch": [],
    "this_month_by_branch": [],
    "this_year_by_branch": []
  }
}


GET /api/superadmin/analytics/funds

Response:

{
  "success": true,
  "data": {
    "total_allocated": 2500000,
    "by_branch": [
      {
        "branch_id": 2,
        "branch_name": "Trichy Main Branch",
        "total_allocated": 500000
      }
    ]
  }
}


GET /api/superadmin/analytics/events

Response:

{
  "success": true,
  "data": {
    "total_events": 30,
    "upcoming_events": 15,
    "by_branch": []
  }
}


GET /api/superadmin/analytics/prayer

Response:

{
  "success": true,
  "data": {
    "total_prayer_schedules": 40,
    "todays_prayers": 8,
    "by_branch": []
  }
}


GET /api/superadmin/analytics/notifications

Response:

{
  "success": true,
  "data": {
    "total_notifications": 50,
    "all_branch_notifications": 20,
    "branch_specific_notifications": 30,
    "by_branch": []
  }
}

========================================================
SUB ADMIN API
========================================================

BASE:

/api/subadmin

IMPORTANT:
Every Sub Admin API must use:

const branchId = req.user.branch_id;

Do NOT accept branch_id from the request to determine access.

Example:

Trichy Sub Admin:
req.user.branch_id = 2

They can ONLY access branch_id = 2.

========================================================
1. SUB ADMIN AUTH
========================================================

POST /api/subadmin/auth/login

Request:

{
  "email": "abuthahirmohammed6@gmail.com",
  "password": "123456"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": 3,
    "name": "Trichy Branch Admin",
    "email": "abuthahirmohammed6@gmail.com",
    "role": "SUB_ADMIN",
    "branch_id": 2
  }
}


GET /api/subadmin/auth/profile

Response:

{
  "success": true,
  "message": "Profile fetched successfully",
  "user": {
    "id": 3,
    "name": "Trichy Branch Admin",
    "email": "abuthahirmohammed6@gmail.com",
    "role": "SUB_ADMIN",
    "branch_id": 2,
    "branch_name": "Trichy Main Branch",
    "branch_address": "Trichy, Tamil Nadu",
    "branch_phone": "9876543211",
    "branch_email": "trichy@church.com",
    "branch_status": "ACTIVE"
  }
}

========================================================
2. SUB ADMIN MEMBERS
========================================================

POST /api/subadmin/members

Request:

{
  "name": "Mohammed Abuthahir",
  "email": "mohammed@example.com",
  "phone": "9876543211",
  "address": "Trichy, Tamil Nadu",
  "date_of_birth": "2000-05-15",
  "gender": "MALE",
  "joined_date": "2026-09-01",
  "amount": 1000
}

IMPORTANT:
branch_id must come from req.user.branch_id.

Response:

{
  "success": true,
  "message": "Member created successfully",
  "member": {
    "id": 1,
    "name": "Mohammed Abuthahir",
    "branch_id": 2,
    "amount": 1000
  }
}


GET /api/subadmin/members

GET /api/subadmin/members/:id

PUT /api/subadmin/members/:id

DELETE /api/subadmin/members/:id

ALL must enforce:

WHERE branch_id = req.user.branch_id

A Trichy Sub Admin must NEVER see a Madurai member.

========================================================
3. SUB ADMIN PASTORS / LEADERS
========================================================

POST /api/subadmin/pastors

Request:

{
  "name": "Pastor John",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "Trichy, Tamil Nadu",
  "joined_date": "2026-09-01",
  "designation": "Pastor"
}

branch_id comes from req.user.branch_id.

Response:

{
  "success": true,
  "message": "Pastor created successfully"
}


GET /api/subadmin/pastors

GET /api/subadmin/pastors/:id

PUT /api/subadmin/pastors/:id

DELETE /api/subadmin/pastors/:id

All must be branch restricted.

========================================================
4. SUB ADMIN PRAYER SCHEDULE
========================================================

POST /api/subadmin/prayer-schedules

Request:

{
  "title": "Morning Prayer",
  "description": "Daily morning prayer",
  "prayer_date": "2026-09-01",
  "start_time": "06:00:00",
  "end_time": "07:00:00",
  "location": "Main Church Hall"
}

branch_id comes from req.user.branch_id.

Response:

{
  "success": true,
  "message": "Prayer schedule created successfully"
}


GET /api/subadmin/prayer-schedules

GET /api/subadmin/prayer-schedules/:id

PUT /api/subadmin/prayer-schedules/:id

DELETE /api/subadmin/prayer-schedules/:id

All branch restricted.

========================================================
5. SUB ADMIN EVENTS
========================================================

POST /api/subadmin/events

Request:

{
  "title": "Sunday Service",
  "description": "Weekly Sunday service",
  "event_date": "2026-09-06",
  "start_time": "09:00:00",
  "end_time": "11:00:00",
  "location": "Main Church"
}

branch_id comes from req.user.branch_id.

Response:

{
  "success": true,
  "message": "Event created successfully"
}


GET /api/subadmin/events

GET /api/subadmin/events/:id

PUT /api/subadmin/events/:id

DELETE /api/subadmin/events/:id

All branch restricted.

========================================================
6. SUB ADMIN DONATIONS
========================================================

POST /api/subadmin/donations

Request:

{
  "member_id": 1,
  "amount": 1000,
  "payment_date": "2026-09-01",
  "purpose": "Monthly Offering"
}

IMPORTANT:
The member must belong to the logged-in Sub Admin's branch.

Response:

{
  "success": true,
  "message": "Donation recorded successfully",
  "donation": {
    "id": 1,
    "member_id": 1,
    "member_name": "Mohammed Abuthahir",
    "amount": 1000,
    "payment_date": "2026-09-01",
    "purpose": "Monthly Offering"
  }
}


GET /api/subadmin/donations

GET /api/subadmin/donations/:id

PUT /api/subadmin/donations/:id

DELETE /api/subadmin/donations/:id

All branch restricted.

========================================================
7. SUB ADMIN FUND VIEW
========================================================

Sub Admin DOES NOT allocate funds.

Super Admin allocates funds.

Sub Admin can ONLY see funds allocated to their own branch.

GET /api/subadmin/funds

Response:

{
  "success": true,
  "message": "Fund summary fetched successfully",
  "data": {
    "this_month": 50000,
    "this_year": 250000,
    "total": 480000
  }
}


GET /api/subadmin/funds/history

Response:

{
  "success": true,
  "message": "Fund history fetched successfully",
  "count": 3,
  "funds": [
    {
      "id": 5,
      "branch_id": 2,
      "branch_name": "Trichy Main Branch",
      "amount": 50000,
      "description": "September Branch Fund",
      "created_at": "2026-09-01T10:30:00.000Z"
    }
  ]
}

IMPORTANT:
Use req.user.branch_id.

Trichy Sub Admin must never see Madurai funds.

This Month and This Year must be dynamic using CURDATE().

========================================================
8. SUB ADMIN NOTIFICATIONS
========================================================

These APIs are for viewing notifications created by Super Admin.

GET /api/subadmin/notifications

GET /api/subadmin/notifications/:id

The query must allow:

target_type = ALL

OR:

target_type = BRANCH
AND branch_id = req.user.branch_id

Example:

Super Admin sends:

{
  "target_type": "ALL"
}

Trichy:
YES

Madurai:
YES

Chennai:
YES


Super Admin sends:

{
  "target_type": "BRANCH",
  "branch_id": 2
}

Trichy:
YES

Madurai:
NO

Chennai:
NO

A Sub Admin MUST NOT be able to change branch_id through Postman.

========================================================
9. SUB ADMIN DASHBOARD
========================================================

Dashboard is branch-specific.

APIs:

GET /api/subadmin/dashboard/member

GET /api/subadmin/dashboard/pastor

GET /api/subadmin/dashboard/donation

GET /api/subadmin/dashboard/event

GET /api/subadmin/dashboard/prayer

GET /api/subadmin/dashboard/announcement

GET /api/subadmin/dashboard/fund

Every API must use:

req.user.branch_id

Example:

Trichy Sub Admin:

Members:
125

Pastors:
8

Donations:
This Month = 45000
This Year = 480000
Total = 1250000

Events:
5

Prayer:
Today's Trichy prayers

Funds:
This Month
This Year
Total

Announcements:
Trichy announcements only.

========================================================
10. SUB ADMIN ANALYTICS
========================================================

Analytics must be branch-specific.

The existing analytics implementation should remain working.

It should provide:

Members:
- Total
- New This Month
- New This Year

Pastors:
- Total

Donations:
- This Month
- This Year
- Total
- Highest Donor

Events:
- Total
- Upcoming

Prayer:
- Today's prayers

Announcements:
- Recent

Funds:
- This Month
- This Year
- Total

Every query must filter using:

req.user.branch_id

========================================================
DATABASE / COLUMN SAFETY
========================================================

IMPORTANT:

Before changing SQL queries, inspect the actual database schema.

Use the actual column names in the existing tables.

Do NOT assume a column exists.

Known prayer_schedules structure:

CREATE TABLE prayer_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    prayer_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

Therefore prayer queries must use:

start_time

NOT:

prayer_time

For dates use:

prayer_date

========================================================
DYNAMIC MONTH / YEAR
========================================================

Do NOT hardcode months or years.

For current month:

YEAR(date_column) = YEAR(CURDATE())
AND MONTH(date_column) = MONTH(CURDATE())

For current year:

YEAR(date_column) = YEAR(CURDATE())

Use this consistently for:
- Members
- Donations
- Funds where applicable
- Other time-based analytics

========================================================
SECURITY TESTS
========================================================

After implementation/verification, test these scenarios.

TEST 1:

Trichy Sub Admin login.

JWT contains:

branch_id = 2

GET:

/api/subadmin/members

Must return ONLY Trichy members.

TEST 2:

Try accessing a known Madurai member:

GET:

/api/subadmin/members/MADURAI_MEMBER_ID

Must return:

{
  "success": false,
  "message": "Member not found or access denied"
}

or equivalent 404/403 response.

TEST 3:

Trichy Sub Admin:

GET /api/subadmin/funds

Must show ONLY Trichy funds.

TEST 4:

Super Admin allocates:

branch_id = 2
amount = 50000

Trichy Sub Admin must see 50000.

Madurai Sub Admin must NOT see 50000.

TEST 5:

Super Admin sends:

target_type = ALL

Every branch Sub Admin must see it.

TEST 6:

Super Admin sends:

target_type = BRANCH
branch_id = 2

Only Trichy Sub Admin sees it.

Madurai and Chennai must NOT see it.

TEST 7:

Super Admin analytics must show ALL branches.

Sub Admin analytics must show ONLY their branch.

========================================================
SERVER.JS
========================================================

Make sure all existing routes remain mounted.

Expected route mounting pattern:

// Super Admin
app.use("/api/superadmin/auth", superAdminAuthRoutes);
app.use("/api/superadmin/branches", superAdminBranchRoutes);
app.use("/api/superadmin/subadmins", superAdminSubAdminRoutes);
app.use("/api/superadmin/dashboard", superAdminDashboardRoutes);
app.use("/api/superadmin/funds", superAdminFundRoutes);
app.use("/api/superadmin/notifications", superAdminNotificationRoutes);
app.use("/api/superadmin/analytics", superAdminAnalyticsRoutes);

// Sub Admin
app.use("/api/subadmin/auth", subAdminAuthRoutes);
app.use("/api/subadmin/members", subAdminMemberRoutes);
app.use("/api/subadmin/pastors", subAdminPastorRoutes);
app.use("/api/subadmin/prayer-schedules", subAdminPrayerScheduleRoutes);
app.use("/api/subadmin/events", subAdminEventRoutes);
app.use("/api/subadmin/donations", subAdminDonationRoutes);
app.use("/api/subadmin/funds", subAdminFundRoutes);
app.use("/api/subadmin/notifications", subAdminNotificationRoutes);
app.use("/api/subadmin/dashboard", subAdminDashboardRoutes);
app.use("/api/subadmin/analytics", subAdminAnalyticsRoutes);

IMPORTANT:
If my actual filenames differ, use the existing filenames instead of creating duplicates.

========================================================
FINAL REQUIREMENT
========================================================

Do NOT simply generate duplicate code.

FIRST inspect the existing implementation.

Then:

1. List all currently existing Super Admin APIs.
2. List all currently existing Sub Admin APIs.
3. Compare them against this specification.
4. Identify missing APIs.
5. Identify incorrect APIs.
6. Identify incorrect SQL column names.
7. Fix only what is required.
8. Preserve all working functionality.
9. Verify route mounting in server.js.
10. Verify SUPER_ADMIN authorization.
11. Verify SUB_ADMIN authorization.
12. Verify branch isolation.
13. Verify dynamic month/year calculations.
14. Verify notification ALL vs BRANCH behavior.
15. Verify Super Admin sees global data.
16. Verify Sub Admin sees only own branch data.

Do not modify the frontend yet.

At the end, give me a concise report:

- APIs already working
- APIs added
- APIs fixed
- Security/branch isolation verified
- Database changes made, if any
- Any remaining issue


