# PowerLink Ethiopia - Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│  (Customers, Admins, Supervisors, Technicians)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL CDN                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Frontend (React + Vite)                          │  │
│  │  - Static HTML/CSS/JS                                    │  │
│  │  - Optimized Assets                                      │  │
│  │  - Global CDN Distribution                               │  │
│  │  - Automatic HTTPS                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Calls (HTTPS)
                         │ VITE_API_URL
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Node.js + Express Server                         │  │
│  │  - REST API Endpoints                                    │  │
│  │  - Authentication                                        │  │
│  │  - File Upload Handling                                  │  │
│  │  - Business Logic                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│                         │                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                              │  │
│  │  - Users                                                 │  │
│  │  - Service Requests                                      │  │
│  │  - Announcements                                         │  │
│  │  - Outages                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Supabase Storage                                 │  │
│  │  - Uploaded Documents                                    │  │
│  │  - User Files                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User Browser
    │
    ├─→ Login Request → Vercel (Frontend)
    │                       │
    │                       ├─→ POST /api/auth/login → Supabase Backend
    │                       │                              │
    │                       │                              ├─→ Verify Credentials
    │                       │                              │
    │                       │                              ├─→ Generate JWT Token
    │                       │                              │
    │                       ├─← Return Token ←─────────────┘
    │                       │
    ├─← Store Token in localStorage
    │
    └─→ Access Protected Routes (with token in headers)
```

### 2. Service Request Submission Flow
```
User Browser
    │
    ├─→ Fill Service Request Form → Vercel (Frontend)
    │
    ├─→ Upload Documents
    │       │
    │       ├─→ POST /api/uploads/service-documents → Supabase Backend
    │       │                                             │
    │       │                                             ├─→ Store in Supabase Storage
    │       │                                             │
    │       ├─← Return File URLs ←────────────────────────┘
    │       │
    ├─→ Submit Request with File URLs
    │       │
    │       ├─→ POST /api/service-requests → Supabase Backend
    │       │                                    │
    │       │                                    ├─→ Save to PostgreSQL
    │       │                                    │
    │       ├─← Return Ticket ID ←───────────────┘
    │       │
    └─← Display Success Message
```

### 3. Document Validation Flow (Supervisor)
```
Supervisor Browser
    │
    ├─→ View Pending Requests → Vercel (Frontend)
    │                               │
    │                               ├─→ GET /api/service-requests/pending
    │                               │                                │
    │                               ├─← Return Pending Requests ←────┘
    │                               │
    ├─→ Review Documents
    │
    ├─→ Approve/Reject
    │       │
    │       ├─→ POST /api/service-requests/:id/approve → Supabase Backend
    │       │                                                │
    │       │                                                ├─→ Update Status in DB
    │       │                                                │
    │       │                                                ├─→ Notify Customer
    │       │                                                │
    │       ├─← Return Success ←──────────────────────────────┘
    │       │
    └─← Update UI
```

## Environment Configuration

### Development Environment
```
┌─────────────────────┐
│  Developer Machine  │
│                     │
│  localhost:5173 ────┼──→ localhost:5000
│  (Vite Dev Server)  │    (Local Backend)
│                     │
│  VITE_API_URL=      │
│  http://localhost:  │
│  5000               │
└─────────────────────┘
```

### Production Environment
```
┌──────────────────────────┐
│  Vercel CDN              │
│                          │
│  your-app.vercel.app ────┼──→ your-project.supabase.co
│  (Static Frontend)       │    (Supabase Backend)
│                          │
│  VITE_API_URL=           │
│  https://your-project.   │
│  supabase.co             │
└──────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. HTTPS/TLS Encryption                                    │
│     ├─ Vercel: Automatic SSL certificates                   │
│     └─ Supabase: Built-in HTTPS                             │
│                                                              │
│  2. CORS Protection                                          │
│     ├─ Backend allows only specific origins                 │
│     └─ Prevents unauthorized API access                     │
│                                                              │
│  3. JWT Authentication                                       │
│     ├─ Token-based authentication                           │
│     ├─ Stored in localStorage                               │
│     └─ Sent in Authorization headers                        │
│                                                              │
│  4. Role-Based Access Control (RBAC)                        │
│     ├─ Customer: Limited access                             │
│     ├─ Supervisor: Document validation                      │
│     ├─ Technician: Task management                          │
│     └─ Admin: Full system access                            │
│                                                              │
│  5. Input Validation                                         │
│     ├─ Frontend: Form validation                            │
│     └─ Backend: Data sanitization                           │
│                                                              │
│  6. File Upload Security                                     │
│     ├─ File type validation                                 │
│     ├─ Size limits                                          │
│     └─ Secure storage in Supabase                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Pipeline

```
┌──────────────┐
│  Developer   │
│  Local Code  │
└──────┬───────┘
       │
       │ git push
       ▼
┌──────────────┐
│  Git Repo    │
│  (GitHub)    │
└──────┬───────┘
       │
       │ Webhook
       ▼
┌──────────────────────────────────────┐
│  Vercel Build System                 │
│  ┌────────────────────────────────┐  │
│  │ 1. Clone Repository            │  │
│  │ 2. Install Dependencies        │  │
│  │ 3. Set Environment Variables   │  │
│  │ 4. Run: npm run build          │  │
│  │ 5. Optimize Assets             │  │
│  │ 6. Deploy to CDN               │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ Deploy
       ▼
┌──────────────────────────────────────┐
│  Vercel CDN (Global)                 │
│  ┌────────────────────────────────┐  │
│  │ Static Files Distributed       │  │
│  │ Across Multiple Regions        │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ Live URL
       ▼
┌──────────────┐
│  End Users   │
└──────────────┘
```

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Current Setup                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Vercel)                                          │
│  ├─ Global CDN                                              │
│  ├─ Automatic scaling                                       │
│  └─ 100+ edge locations                                     │
│                                                              │
│  Backend (Supabase)                                         │
│  ├─ Auto-scaling database                                   │
│  ├─ Connection pooling                                      │
│  └─ Built-in caching                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Future Scaling Options                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Database Scaling                                         │
│     ├─ Read replicas                                        │
│     ├─ Database sharding                                    │
│     └─ Caching layer (Redis)                                │
│                                                              │
│  2. Backend Scaling                                          │
│     ├─ Multiple backend instances                           │
│     ├─ Load balancer                                        │
│     └─ Microservices architecture                           │
│                                                              │
│  3. Storage Scaling                                          │
│     ├─ CDN for static files                                 │
│     ├─ Object storage optimization                          │
│     └─ Image compression                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend Monitoring (Vercel)                               │
│  ├─ Analytics Dashboard                                     │
│  ├─ Performance Metrics                                     │
│  ├─ Error Tracking                                          │
│  └─ User Analytics                                          │
│                                                              │
│  Backend Monitoring (Supabase)                              │
│  ├─ Database Performance                                    │
│  ├─ API Response Times                                      │
│  ├─ Error Logs                                              │
│  └─ Resource Usage                                          │
│                                                              │
│  Optional: Third-Party Tools                                │
│  ├─ Sentry (Error Tracking)                                 │
│  ├─ LogRocket (Session Replay)                              │
│  └─ Google Analytics (User Behavior)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Cost Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Monthly Cost Estimate                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Vercel (Frontend Hosting)                                  │
│  ├─ Free Tier: $0/month                                     │
│  │   ├─ 100 GB bandwidth                                    │
│  │   ├─ Unlimited deployments                               │
│  │   └─ Automatic HTTPS                                     │
│  └─ Pro Tier: $20/month (if needed)                         │
│                                                              │
│  Supabase (Backend + Database)                              │
│  ├─ Free Tier: $0/month                                     │
│  │   ├─ 500 MB database                                     │
│  │   ├─ 1 GB file storage                                   │
│  │   └─ 50,000 monthly active users                         │
│  └─ Pro Tier: $25/month (if needed)                         │
│                                                              │
│  Total Current Cost: $0/month                               │
│  Total with Pro Tiers: $45/month                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Disaster Recovery

```
┌─────────────────────────────────────────────────────────────┐
│                    Backup Strategy                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Code Backup                                              │
│     └─ Git repository (GitHub/GitLab)                       │
│                                                              │
│  2. Database Backup                                          │
│     ├─ Supabase automatic daily backups                     │
│     └─ Point-in-time recovery                               │
│                                                              │
│  3. File Storage Backup                                      │
│     └─ Supabase Storage replication                         │
│                                                              │
│  4. Deployment Rollback                                      │
│     ├─ Vercel: Instant rollback to previous deployment      │
│     └─ Git: Revert commits                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Features                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend Optimizations                                      │
│  ├─ Code splitting                                          │
│  ├─ Lazy loading                                            │
│  ├─ Asset compression                                       │
│  ├─ CDN caching                                             │
│  └─ Image optimization                                      │
│                                                              │
│  Backend Optimizations                                       │
│  ├─ Database indexing                                       │
│  ├─ Query optimization                                      │
│  ├─ Connection pooling                                      │
│  └─ Response caching                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture provides:
- ✅ **Scalability**: Handles growth automatically
- ✅ **Security**: Multiple layers of protection
- ✅ **Performance**: Global CDN + optimized backend
- ✅ **Reliability**: Automatic backups + rollback
- ✅ **Cost-Effective**: Free tier for initial deployment
- ✅ **Easy Maintenance**: Automated deployments

**Ready to deploy!** Follow the Quick Deploy guide to go live.
