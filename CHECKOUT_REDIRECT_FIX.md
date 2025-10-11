# Checkout Button Redirect to Login Fix

## Problem Description

When clicking the "Checkout" button in the cart sidebar, users were being redirected to the login page even when they were already logged in.

## Root Causes

### 1. **Race Condition in Authentication State**
   - When the app loads, the `useAuth` hook immediately sets `isAuthenticated: true` if a token exists in localStorage
   - However, the `user` object remains `null` until the API call to `/api/auth/me` completes
   - The `ProtectedRoute` component checks **both** `isAuthenticated` AND `user`:
     ```typescript
     if (!auth.isAuthenticated || !auth.user) {
         return <Navigate to="/login" ... />;
     }
     ```
   - This creates a brief window where `isAuthenticated = true` but `user = null`, causing the redirect

### 2. **Initial Loading State Not Set**
   - The `useAuth` hook initialized with `isLoading: false` even when a token existed
   - This meant the app didn't show a loading state while fetching user data
   - Users could click checkout before the user data was loaded

### 3. **useEffect Dependency Loop**
   - The `refreshUser` useEffect had dependencies `[state.token, state.user, refreshUser]`
   - This could cause infinite loops or multiple unnecessary API calls
   - The `refreshUser` function depended on `state.token`, creating circular dependencies

### 4. **No Auth Check in Cart Checkout Handler**
   - The cart sidebar's checkout handler simply navigated to `/checkout` without checking auth state
   - No feedback to user about authentication status

## Fixes Applied

### 1. **Fixed Initial Loading State** (`src/hooks/useAuth.ts`)
   ```typescript
   // BEFORE
   const [state, setState] = useState<AuthState>({
       user: null,
       token: localStorage.getItem('token'),
       isAuthenticated: !!localStorage.getItem('token'),
       isLoading: false, // ❌ Wrong - should be true if token exists
       error: null,
   });

   // AFTER
   const [state, setState] = useState<AuthState>({
       user: null,
       token: localStorage.getItem('token'),
       isAuthenticated: !!localStorage.getItem('token'),
       isLoading: !!localStorage.getItem('token'), // ✅ Show loading while fetching user
       error: null,
   });
   ```

### 2. **Fixed useEffect Dependencies** (`src/hooks/useAuth.ts`)
   ```typescript
   // BEFORE
   const refreshUser = useCallback(async () => {
       if (!state.token) return;
       // ... fetch user
   }, [state.token]); // ❌ Creates dependency on state

   useEffect(() => {
       if (state.token && !state.user) {
           refreshUser();
       }
   }, [state.token, state.user, refreshUser]); // ❌ Can cause loops

   // AFTER
   const refreshUser = useCallback(async () => {
       const token = localStorage.getItem('token'); // ✅ Read directly
       if (!token) {
           clearAuth();
           return;
       }
       // ... fetch user
   }, []); // ✅ No dependencies

   useEffect(() => {
       const token = localStorage.getItem('token');
       if (token && !state.user && !state.error) {
           refreshUser();
       }
   }, []); // ✅ Only run once on mount
   ```

### 3. **Added Auth Check in Cart Checkout** (`src/components/cart/CartSidebar.tsx`)
   ```typescript
   const handleCheckout = () => {
       // Debug logging
       console.log('Checkout clicked - Auth state:', {
           isAuthenticated: auth.isAuthenticated,
           hasUser: !!auth.user,
           isLoading: auth.isLoading
       });
       
       // Check auth before navigating
       if (!auth.isAuthenticated || !auth.user) {
           console.log('User not authenticated, redirecting to login');
           navigate('/login', { state: { from: '/checkout' } });
           onClose();
           return;
       }
       
       onClose();
       navigate('/checkout');
   };
   ```

### 4. **Added Loading State to Checkout Button**
   ```typescript
   <button
       onClick={handleCheckout}
       disabled={cart.isLoading || auth.isLoading} // ✅ Disable while loading
       className="... disabled:opacity-50 disabled:cursor-not-allowed"
   >
       {auth.isLoading ? 'Loading...' : 'Checkout'} // ✅ Show loading text
   </button>
   ```

### 5. **Fixed AppContext useEffect Dependencies**
   ```typescript
   // BEFORE
   useEffect(() => {
       if (auth.isAuthenticated && auth.user) {
           // ... merge cart
       }
   }, [auth.isAuthenticated, auth.user, cart]); // ❌ cart causes re-renders

   // AFTER
   useEffect(() => {
       if (auth.isAuthenticated && auth.user) {
           // ... merge cart
       }
   }, [auth.isAuthenticated, auth.user]); // ✅ Removed cart dependency
   ```

## How Authentication Flow Works Now

1. **App Loads**
   - Check if token exists in localStorage
   - If token exists:
     - Set `isAuthenticated: true`
     - Set `isLoading: true` (NEW!)
     - Set `user: null`

2. **Fetch User Data**
   - Call `/api/auth/me` to get user data
   - On success:
     - Set `user` object
     - Set `isLoading: false`
     - Keep `isAuthenticated: true`
   - On failure (401):
     - Clear token from localStorage
     - Set `isAuthenticated: false`
     - Set `user: null`
     - Set `isLoading: false`

3. **Cart Checkout Click**
   - Check if `auth.isLoading` is true
     - If yes: Button is disabled, shows "Loading..."
   - Check if `auth.isAuthenticated && auth.user`
     - If no: Redirect to login with return path
     - If yes: Navigate to checkout

4. **ProtectedRoute Check**
   - Show loading spinner if `auth.isLoading`
   - Redirect to login if `!auth.isAuthenticated || !auth.user`
   - Render protected content if authenticated

## Testing Steps

1. **Clear localStorage and refresh page**
   - Should show login button
   - Cart checkout should redirect to login

2. **Login to the application**
   - Should show user profile dropdown
   - Token should be saved to localStorage

3. **Refresh the page while logged in**
   - Should briefly show "Loading..." on checkout button
   - Should load user data automatically
   - Once loaded, checkout button should work

4. **Click checkout button**
   - Should navigate to /checkout page
   - Should NOT redirect to login
   - Should show checkout form

5. **Open browser console**
   - Should see "Checkout clicked - Auth state" log
   - Should show isAuthenticated: true, hasUser: true, isLoading: false

## Additional Improvements Made

- Added console logging for debugging auth state
- Improved button states with loading indicators
- Better error handling in auth flow
- Prevented infinite useEffect loops
- Cleaner dependency management

## Files Modified

1. `src/hooks/useAuth.ts` - Fixed loading state and useEffect dependencies
2. `src/components/cart/CartSidebar.tsx` - Added auth check and loading state
3. `src/contexts/AppContext.tsx` - Fixed useEffect dependencies
