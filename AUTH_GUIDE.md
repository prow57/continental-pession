# 🔐 Authentication Guide - CPS Back Office System

## Overview

The system includes a **fake authentication system** for demonstration purposes. This allows you to showcase role-based access control without requiring a real backend.

---

## 🚪 Login Screen

**Route**: `/login` (default landing page)

### Features
- Professional split-screen design
- Left side: Branding and system information
- Right side: Login form
- Show/hide password toggle
- Demo account quick login buttons
- Error handling
- Loading states

### Design Elements
- **Gradient background** - Blue theme matching CPS branding
- **Responsive layout** - Mobile-friendly with logo at top
- **Security icons** - Shield and lock icons for trust
- **Company branding** - CPS logo and tagline
- **Help information** - Support contact details

---

## 👥 Demo Accounts

All accounts use the password: **`password`**

### 1. Admin Account
- **Username**: `admin`
- **Full Name**: Makhumbo Chikaonda
- **Role**: Admin
- **Department**: Management
- **Access**: Full system access

**Use for**: Demonstrating complete system functionality

### 2. Capturer Account 1
- **Username**: `capturer1`
- **Full Name**: Chisomo Banda
- **Role**: Capturer
- **Department**: Operations
- **Access**: Create and submit records

**Use for**: Demonstrating data entry and submission workflow

### 3. Authorizer Account
- **Username**: `authorizer1`
- **Full Name**: Lawrence Kachuma
- **Role**: Authorizer
- **Department**: Compliance
- **Access**: Review and approve/reject submissions

**Use for**: Demonstrating authorization workflow

### 4. Capturer Account 2
- **Username**: `capturer2`
- **Full Name**: Thandiwe Phiri
- **Role**: Capturer
- **Department**: Operations
- **Access**: Create and submit records

**Use for**: Showing multiple capturers in the system

### 5. Read-Only Account
- **Username**: `readonly`
- **Full Name**: Mphatso Mwale
- **Role**: Read Only
- **Department**: Audit
- **Access**: View-only access

**Use for**: Demonstrating audit and reporting access

---

## 🔄 Login Flow

### Step 1: Access Login Page
- Navigate to `http://localhost:3000`
- Automatically redirects to `/login`

### Step 2: Choose Login Method

**Option A: Manual Login**
1. Enter username (e.g., `admin`)
2. Enter password (`password`)
3. Click "Sign In"
4. Wait for authentication (1 second delay)
5. Redirect to dashboard

**Option B: Quick Demo Login**
1. Click any demo account card
2. Credentials auto-fill
3. Click "Sign In"
4. Redirect to dashboard

### Step 3: Access Dashboard
- Successful login redirects to `/dashboard`
- User information stored in localStorage
- Header shows current user name and role

---

## 🚪 Logout Flow

### From Any Page
1. Click user menu in top-right header
2. Dropdown shows:
   - User name
   - Email
   - Role badge
   - Sign Out button
3. Click "Sign Out"
4. Clears localStorage
5. Redirects to `/login`

---

## 🔒 Protected Routes

All dashboard routes are protected:
- `/dashboard`
- `/members`
- `/receipts`
- `/authorization`
- `/pw-setup`
- `/reports`

### Protection Mechanism
- Checks localStorage for `currentUser`
- If not found, redirects to `/login`
- Shows loading spinner during check
- Prevents unauthorized access

---

## 💾 Session Management

### Storage
- User data stored in **localStorage**
- Key: `currentUser`
- Value: JSON stringified user object

### Persistence
- Session persists across page refreshes
- Remains until logout or localStorage cleared
- No expiration (for demo purposes)

### Security Note
⚠️ **This is a demo system only!**
- No real authentication
- No password hashing
- No JWT tokens
- No backend validation
- All passwords are "password"

**For production**, implement:
- Real authentication server
- Password hashing (bcrypt)
- JWT tokens
- Session expiration
- HTTPS only
- CSRF protection
- Rate limiting

---

## 🎭 Role-Based Access Control (RBAC)

### Current Implementation
- User role stored in user object
- Role displayed in header
- UI can be customized per role

### Future Enhancement Ideas
1. **Capturer Role**
   - Hide "Approve" buttons
   - Show only own submissions
   - Disable authorization actions

2. **Authorizer Role**
   - Hide "Create" buttons
   - Show all pending items
   - Enable approve/reject actions

3. **Read-Only Role**
   - Disable all forms
   - Hide action buttons
   - Show view-only interfaces

4. **Admin Role**
   - Full access to everything
   - User management
   - System settings

---

## 🎬 Demo Script for Authentication

### Scenario 1: Admin Login
```
1. Open http://localhost:3000
2. Click "Makhumbo Chikaonda" demo card
3. Click "Sign In"
4. Show dashboard with full access
5. Click user menu → Show role badge
6. Click "Sign Out"
```

### Scenario 2: Role Switching
```
1. Login as Capturer (capturer1)
2. Navigate to Authorization Queue
3. Show pending items
4. Logout
5. Login as Authorizer (authorizer1)
6. Navigate to Authorization Queue
7. Show approve/reject functionality
```

### Scenario 3: Session Persistence
```
1. Login as Admin
2. Navigate to Members page
3. Refresh browser (F5)
4. Show still logged in
5. User info persists
```

---

## 🐛 Troubleshooting

### Issue: Can't login
**Solution**: Ensure password is exactly `password` (lowercase)

### Issue: Redirects to login after refresh
**Solution**: Check browser localStorage is enabled

### Issue: User menu not showing
**Solution**: Refresh page to load user from localStorage

### Issue: Logout doesn't work
**Solution**: Check browser console for errors

---

## 📝 Code Structure

### Files Created
1. `/app/login/page.tsx` - Login page component
2. `/lib/auth/context.tsx` - Auth context (optional)
3. `/components/auth/protected-route.tsx` - Route protection
4. `/components/layout/header.tsx` - Updated with logout

### Key Functions
```typescript
// Check authentication
const storedUser = localStorage.getItem("currentUser");

// Login
localStorage.setItem("currentUser", JSON.stringify(user));

// Logout
localStorage.removeItem("currentUser");
router.push("/login");
```

---

## 🎨 Login Page Design

### Left Panel (Desktop Only)
- **Gradient background**: Blue 600 to Blue 800
- **CPS Logo**: White square with blue text
- **Welcome message**: Large heading
- **Feature highlights**: 2 cards with icons
- **Copyright notice**: Bottom of panel

### Right Panel
- **Mobile logo**: Shows on small screens
- **Sign in heading**: Large, centered
- **Login form**: Username and password
- **Show/hide password**: Eye icon toggle
- **Error message**: Red alert box
- **Sign in button**: Blue, full width
- **Demo accounts**: 4 quick-login cards
- **Help text**: Support contact info

### Responsive Behavior
- **Desktop (1024px+)**: Split screen
- **Tablet (768-1023px)**: Right panel only
- **Mobile (<768px)**: Stacked layout

---

## ✅ Authentication Checklist

- [x] Login page created
- [x] Professional design
- [x] Show/hide password
- [x] Demo account cards
- [x] Fake authentication logic
- [x] localStorage session
- [x] Protected routes
- [x] Logout functionality
- [x] User menu in header
- [x] Role display
- [x] Loading states
- [x] Error handling
- [x] Responsive design

---

## 🎯 Demo Tips

1. **Start with login** - Shows professional entry point
2. **Use demo cards** - Faster than typing
3. **Show role badge** - Emphasize RBAC
4. **Switch users** - Demonstrate different roles
5. **Test logout** - Show session management
6. **Refresh page** - Show persistence

---

## 🚀 Future Enhancements

### Phase 2: Real Authentication
- [ ] Backend API integration
- [ ] JWT token generation
- [ ] Password hashing
- [ ] Session expiration
- [ ] Refresh tokens
- [ ] Remember me functionality

### Phase 3: Advanced Features
- [ ] Two-factor authentication (2FA)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Activity logging
- [ ] Single sign-on (SSO)

### Phase 4: Security Hardening
- [ ] HTTPS enforcement
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] Security headers

---

**Authentication system is complete and ready for demonstration!** 🔐✅
