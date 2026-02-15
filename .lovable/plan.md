

# DataKhet: Scalable Auth, Subscription, and Profile Architecture

## Overview

This plan introduces a proper authentication system, restructures the subscription flow, adds a profile dashboard, and makes navigation state-aware -- all while preserving the current guest-first experience where farmers can scan freely without signing in.

---

## Current State

- No authentication -- everything uses anonymous `session_id` in localStorage
- Subscription is phone + 9-digit code verification (offline code distribution)
- "Subscribe" button in nav goes to `/subscribe` (phone+code form), not `/pricing`
- No user profiles, no dashboard, no role-based UI
- All scan data stored by `session_id`, not linked to any user

---

## Architecture

### Phase 1: Database Schema

**New tables:**

1. **`profiles`** -- stores user profile and contextual farming data
   - `id` (uuid, FK to auth.users, ON DELETE CASCADE)
   - `phone` (text)
   - `display_name` (text)
   - `village` (text, nullable)
   - `district` (text, nullable)
   - `state` (text, nullable)
   - `primary_crops` (text array, nullable) -- e.g. wheat, rice, cotton
   - `total_land_bigha` (numeric, nullable)
   - `language_preference` (text, default 'hi')
   - `created_at`, `updated_at`

2. **`user_roles`** -- separate role table (security best practice)
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `role` (app_role enum: 'user', 'premium', 'admin')
   - Unique constraint on (user_id, role)

3. **`user_subscriptions`** -- tracks subscription state per user
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `plan_type` (text: 'daily', '6month', '1year')
   - `access_code` (text) -- the 9-digit code used
   - `activated_at` (timestamptz)
   - `expires_at` (timestamptz)
   - `is_active` (boolean, default false)
   - `created_at`

**Modifications to existing tables:**
- Add `user_id` (uuid, nullable, FK to auth.users) to `soil_scans` -- nullable so existing session-based scans keep working
- Update RLS on `soil_scans` so authenticated users see their own scans AND session-based scans

**Security functions:**
- `has_role(user_id, role)` -- security definer function for RLS
- Auto-create profile trigger on user signup
- Auto-assign 'user' role on signup

**RLS policies:**
- `profiles`: users can read/update only their own profile
- `user_roles`: read-only for users (managed via backend functions)
- `user_subscriptions`: users can read their own; updates via edge function only
- `soil_scans`: authenticated users see scans where `user_id = auth.uid()` OR `session_id` matches; unauthenticated users see by session_id (existing behavior)

### Phase 2: Authentication

**Sign-up / Sign-in flow:**
- Email + password authentication (simple for rural users who may use shared devices)
- Phone number collected during profile setup (not for OTP -- keeping the offline code model)
- Auto-confirm email signups disabled (users verify email)
- On first sign-in, migrate existing localStorage session scans to the user's account by updating `user_id` on matching `session_id` rows

**Auth context:**
- Create `AuthContext` provider wrapping the app
- Provides `user`, `profile`, `isSubscribed`, `isPremium`, `signIn`, `signUp`, `signOut`
- Listens to `onAuthStateChange` for session management
- Loads profile and subscription status on auth state change

### Phase 3: Navigation and Flow Changes

**"Subscribe" button behavior:**
- In `DesktopNav` and `MobileMenu`, "Subscribe" / "सदस्यता लें" now links to `/pricing` instead of `/subscribe`
- On the Pricing page, each plan's "select" action checks auth state:
  - If signed in: navigates to `/subscribe` with the selected plan pre-filled
  - If not signed in: navigates to `/auth?redirect=/pricing` (sign-in/sign-up page)

**State-aware navigation:**
- For guests: show "सदस्यता लें" (Subscribe) button
- For signed-in free users: show "अपग्रेड करें" (Upgrade) button linking to `/pricing`
- For premium users: show "प्रोफ़ाइल" (Profile) button linking to `/profile`
- Bottom nav remains unchanged (Scan, History, Help) for all users

### Phase 4: New Pages

1. **`/auth`** -- Sign-in / Sign-up page
   - Tab-based: sign in or create account
   - Email + password fields
   - Hindi-first UI matching existing design language
   - Accepts `?redirect=` query param for post-auth navigation
   - Shows "Continue as guest" option (navigates to home)

2. **`/profile`** -- User dashboard
   - Profile section: name, phone, village, district, crops, total land
   - Subscription section: current plan, expiry, upgrade/renew button
   - Settings: language preference, sign out
   - Link to scan history (filtered to this user)
   - Edit profile form for contextual farming data

### Phase 5: Subscription Flow Update

- Update `verify-subscription` edge function to:
  - Accept optional `user_id` parameter
  - When user is authenticated, create/update `user_subscriptions` record and assign 'premium' role
  - Still support the existing phone+code model for backward compatibility
- Update `Subscribe.tsx` to pass `user_id` when authenticated
- After successful verification, if authenticated, save subscription to database (not just localStorage)

### Phase 6: Session Migration

When a user signs in for the first time:
- Read `datakhet_session` from localStorage
- Update all `soil_scans` with that `session_id` to set `user_id = auth.uid()`
- This links their historical scans to their new account

---

## Guest Access Preservation

All existing features remain fully accessible without sign-in:
- Soil/crop/kitchen garden scanning
- Scan results viewing
- Land mapping and saved plots (localStorage-based)
- History (session-based)
- Voice walkthrough
- All informational pages

Sign-in is only prompted when a user explicitly clicks a pricing plan action.

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/contexts/AuthContext.tsx` | Auth provider with profile and subscription state |
| Create | `src/pages/Auth.tsx` | Sign-in / Sign-up page |
| Create | `src/pages/Profile.tsx` | User dashboard with settings and subscription |
| Modify | `src/App.tsx` | Add AuthProvider, new routes (/auth, /profile) |
| Modify | `src/pages/Pricing.tsx` | Add per-plan select buttons with auth check |
| Modify | `src/pages/Subscribe.tsx` | Pass user_id when authenticated, redirect from pricing |
| Modify | `src/components/DesktopNav.tsx` | State-aware nav (Subscribe/Upgrade/Profile) |
| Modify | `src/components/MobileMenu.tsx` | State-aware menu items |
| Modify | `src/components/BottomNav.tsx` | Optional profile icon for signed-in users |
| Modify | `src/pages/Home.tsx` | Link scans to user_id when authenticated |
| Modify | `supabase/functions/verify-subscription/index.ts` | Support user_id, update user_subscriptions table |
| DB Migration | -- | Create profiles, user_roles, user_subscriptions tables; add user_id to soil_scans; RLS policies; triggers |

---

## Technical Details

### Database Migration SQL (summary)

```text
1. Create app_role enum ('user', 'premium', 'admin')
2. Create profiles table with farming context fields
3. Create user_roles table with has_role() security definer function
4. Create user_subscriptions table
5. Add user_id column to soil_scans (nullable)
6. Create trigger: auto-create profile + assign 'user' role on signup
7. RLS policies for all new tables
8. Update soil_scans RLS to support both session_id and user_id access
```

### Auth Context API

```text
AuthContext provides:
- user: User | null
- profile: Profile | null
- subscription: Subscription | null
- isAuthenticated: boolean
- isPremium: boolean
- loading: boolean
- signIn(email, password)
- signUp(email, password, phone)
- signOut()
- updateProfile(data)
- refreshSubscription()
```

### Navigation State Logic

```text
if (!isAuthenticated) -> show "Subscribe" -> links to /pricing
if (isAuthenticated && !isPremium) -> show "Upgrade" -> links to /pricing
if (isAuthenticated && isPremium) -> show "Profile" -> links to /profile
```

