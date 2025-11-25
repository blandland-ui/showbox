# ShowBox Password Protection

This directory is now protected with password authentication.

## How It Works

1. **Auth Page**: `auth.html` - The login page that users see first
2. **Auth Check**: `auth-check.js` - Automatically checks authentication on all protected pages
3. **Session Storage**: Uses browser sessionStorage to maintain login for 24 hours

## Default Password

**Current Password**: `showbox2025`

To change the password, edit line 104 in `auth.html`:
```javascript
const CORRECT_PASSWORD = 'showbox2025'; // Change this to your desired password
```

## Protected Pages

All pages in the `/showbox` directory are protected. When users try to access any page:
- If not authenticated → Redirected to `auth.html`
- If authenticated → Access granted for 24 hours
- After 24 hours → Must log in again

## Access Points

- Main site heart link (❤️) → `./showbox/auth.html`
- Direct URL → `blacksitedb.com/showbox/auth.html`

## Adding Protection to More Pages

To protect additional pages in the showbox directory, add this script tag in the `<head>` section:

```html
<!-- Authentication Check - Must be first -->
<script src="auth-check.js"></script>
```

## Security Notes

- Password is stored in JavaScript (client-side only)
- Session expires after 24 hours of inactivity
- For higher security, consider server-side authentication with PHP
- Currently uses sessionStorage (cleared when browser closes)

## Files Modified

1. `showbox/auth.html` - New password login page
2. `showbox/auth-check.js` - New authentication checker
3. `showbox/index.html` - Added auth-check.js script
4. `index.html` - Updated heart link to point to auth page

## Testing

1. Click the heart (❤️) link on the main page
2. Enter password: `showbox2025`
3. You'll be redirected to ShowBox
4. Session persists for 24 hours

## Customization

You can customize:
- Password (line 104 in auth.html)
- Session duration (line 105 in auth.html)
- Page styling (CSS in auth.html)
- Error messages (HTML in auth.html)
