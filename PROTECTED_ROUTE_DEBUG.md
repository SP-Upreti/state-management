# Protected Route Not Working - Debug Guide

## Issue
ProtectedRoute is not letting users access the checkout page even when they appear to be logged in.

## Diagnosis Steps

### 1. Check Browser Console Logs
Open the browser console (F12) and look for these log messages:

#### On Page Load:
```
useAuth mount effect - Token exists: [true/false], User exists: [true/false]
```

#### When Clicking Checkout:
```
Checkout clicked - Auth state: {
  isAuthenticated: boolean,
  hasUser: boolean,
  isLoading: boolean
}
```

#### When ProtectedRoute Checks:
```
ProtectedRoute check: {
  path: "/checkout",
  isAuthenticated: boolean,
  hasUser: boolean,
  isLoading: boolean,
  user: {...},
  token: boolean
}
```

### 2. Check LocalStorage
Open DevTools → Application → Local Storage → http://localhost:3000

Look for:
- `token` - Should be a JWT string if logged in
- `guest_session_id` - Guest cart session (not related to auth)

### 3. Common Scenarios

#### Scenario A: Token exists but user is null
**Symptoms:**
- Token in localStorage ✓
- `isAuthenticated: true` ✓
- `user: null` ✗
- Page redirects to login

**Cause:**
- Backend API call to `/api/auth/me` is failing
- Network issue or backend not running
- Invalid/expired token

**Solution:**
1. Check if backend is running on port 5000
2. Check browser Network tab for API calls
3. Look for `/api/auth/me` request
4. Check response status (should be 200)
5. If 401: Token is invalid - clear localStorage and login again
6. If 500: Backend error - check backend logs

#### Scenario B: isLoading stuck at true
**Symptoms:**
- Infinite loading spinner
- Never redirects or loads content
- Console shows `isLoading: true` forever

**Cause:**
- API call to fetch user is hanging
- Backend not responding
- Network timeout

**Solution:**
1. Check backend is running
2. Check browser Network tab
3. Look for pending requests
4. Restart backend server
5. Clear localStorage and refresh

#### Scenario C: Token missing after login
**Symptoms:**
- Login appears successful
- Immediately redirected back to login
- No token in localStorage

**Cause:**
- Login API not returning token
- Token not being saved to localStorage

**Solution:**
1. Check login API response in Network tab
2. Should have `token` field in response
3. Check `auth.login()` function saves token
4. Check backend `/api/auth/login` endpoint

#### Scenario D: User object missing fields
**Symptoms:**
- Token exists ✓
- User object exists ✓
- Still redirected to login

**Cause:**
- User object doesn't have required fields
- Backend returning incomplete user data

**Solution:**
1. Console log the user object
2. Check it has: `id`, `email`, `firstName`, `lastName`, `role`
3. Check backend `/api/auth/me` response

## Quick Fixes

### Fix 1: Clear Everything and Login Again
```javascript
// In browser console:
localStorage.clear();
location.reload();
// Then login again
```

### Fix 2: Check Token Validity
```javascript
// In browser console:
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Has token:', !!token);
```

### Fix 3: Manual User Refresh
```javascript
// In browser console (while on any page):
// This will trigger a user data refresh
window.location.reload();
```

### Fix 4: Check Backend Health
```bash
# In terminal:
curl http://localhost:5000/api/health

# Should return something like:
# {"success": true, "message": "API is running"}
```

### Fix 5: Test Auth Endpoint
```bash
# In terminal (replace YOUR_TOKEN with actual token):
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me

# Should return user data
```

## Code Changes Made

### 1. Added Debug Logging (`useAuth.ts`)
- Logs when token is checked on mount
- Logs when refreshUser is called
- Logs success/failure of user fetch
- Logs token validity checks

### 2. Added Debug Logging (`ProtectedRoute.tsx`)
- Logs every auth check
- Logs redirect decisions
- Logs loading states

### 3. Added Fallback Refresh (`ProtectedRoute.tsx`)
- If token exists but user is null
- Automatically attempts to refresh user data
- Shows loading spinner during refresh

### 4. Improved Loading State (`useAuth.ts`)
- Sets `isLoading: true` on mount if token exists
- Prevents premature navigation
- Better loading state management

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] Can access http://localhost:5000/api/health
- [ ] Login page works (check Network tab for API call)
- [ ] Token is saved to localStorage after login
- [ ] User data is fetched after login (check `/api/auth/me` in Network tab)
- [ ] Navbar shows user profile picture/name when logged in
- [ ] Can navigate to /profile page
- [ ] Can navigate to /checkout page
- [ ] Cart checkout button doesn't redirect to login

## Expected Auth Flow

1. **User logs in:**
   - POST `/api/auth/login` with credentials
   - Receive `{ token, user }` in response
   - Save token to localStorage
   - Set user in state
   - Set `isAuthenticated: true`

2. **Page refresh (while logged in):**
   - Check localStorage for token
   - If token exists: set `isLoading: true`
   - Call GET `/api/auth/me` with token
   - Receive user data
   - Set user in state
   - Set `isLoading: false`

3. **Navigate to protected route:**
   - Check `auth.isLoading`
     - If true: Show loading spinner
   - Check `auth.isAuthenticated && auth.user`
     - If false: Redirect to login
     - If true: Render protected content

## Backend Requirements

The backend MUST have these endpoints working:

1. **POST /api/auth/login**
   ```json
   Response: {
     "success": true,
     "token": "jwt-token-here",
     "data": {
       "user": {
         "id": 1,
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "role": "user"
       }
     }
   }
   ```

2. **GET /api/auth/me**
   - Requires `Authorization: Bearer <token>` header
   ```json
   Response: {
     "success": true,
     "data": {
       "user": {
         "id": 1,
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "role": "user"
       }
     }
   }
   ```

## Troubleshooting by Error Message

### "Cannot read property 'user' of undefined"
- AppContext is not wrapping the component
- Check App.tsx has `<AppProvider>` wrapper

### "Network Error"
- Backend is not running
- CORS issue (check backend CORS settings)
- Wrong API URL (check VITE_API_URL in .env)

### "401 Unauthorized"
- Token is invalid or expired
- Clear localStorage and login again
- Check backend token verification

### "500 Internal Server Error"
- Backend error
- Check backend console/logs
- Database connection issue

## Files Modified for Debugging

1. `src/hooks/useAuth.ts` - Added console logging
2. `src/components/ProtectedRoute.tsx` - Added console logging and fallback refresh
3. `src/components/cart/CartSidebar.tsx` - Added auth check logging

## Next Steps if Still Not Working

1. Share the browser console output
2. Share the Network tab showing API calls
3. Check backend is running: `cd backend && npm run dev`
4. Check frontend is running: `npm run dev`
5. Try incognito/private browser window
6. Try different browser
7. Check for CORS errors in console
