

## Fix: Personalized Post-Login Flow and Subscription Management

### Problem
1. After sign-in, users are redirected to `/profile` by default (Auth.tsx line 14: `redirect = "/profile"`), which feels transactional rather than welcoming.
2. The DesktopNav and MobileMenu show "Upgrade" for free-tier users, pushing them to `/pricing` instead of letting them manage subscriptions from their profile.
3. The profile page shows freemium benefits but doesn't clearly distinguish "Manage Subscription" as a dedicated section.

### Changes

#### 1. Auth.tsx - Default redirect to Home after sign-in
- Change default redirect from `/profile` to `/` (Home page)
- Home already has personalized greeting: "Name, aaj kya jaanchein?" -- this creates a warm, personalized landing experience

#### 2. DesktopNav.tsx - Fix CTA for authenticated free users
- For free-tier authenticated users: CTA should link to `/profile` (not `/pricing`) with label "Manage" or "Profile"
- For unauthenticated users: keep linking to `/pricing` with "Subscribe"
- For premium users: link to `/profile` with "Profile" (already correct)

#### 3. MobileMenu.tsx - Same CTA fix
- Mirror the DesktopNav logic: authenticated free users go to `/profile`, not `/pricing`

#### 4. Profile.tsx - Enhance subscription section
- Rename the upgrade CTA to "Manage Subscription" style
- Show current plan status more prominently (Free Plan active badge)
- Keep the "Upgrade to Premium" button but frame it as an option within subscription management, not as the primary action
- Add remaining scan count display (from `useScanLimit` hook) so users see their usage at a glance

#### 5. Subscribe.tsx - Redirect fix
- When authenticated free users land here, show their current free plan status with option to upgrade (already mostly correct, just ensure redirect consistency)

### Technical Details

| File | Change |
|------|--------|
| `src/pages/Auth.tsx` | Change default redirect from `/profile` to `/` |
| `src/components/DesktopNav.tsx` | Authenticated free users CTA goes to `/profile` with "Profile" label |
| `src/components/MobileMenu.tsx` | Same CTA fix as DesktopNav |
| `src/pages/Profile.tsx` | Add scan usage display from `useScanLimit`, enhance subscription section with "Manage Subscription" framing |

