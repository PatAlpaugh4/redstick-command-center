# Authentication Error Messages

## Login Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Invalid Credentials | "Invalid email or password. Please try again." | Retry |
| Account Not Found | "No account found with this email address." | Sign Up |
| Account Disabled | "This account has been disabled. Please contact support." | Contact Support |
| Account Locked | "Account temporarily locked due to too many failed attempts. Try again in 15 minutes." | Wait |
| Account Suspended | "This account has been suspended. Please contact support." | Contact Support |
| Email Not Verified | "Please verify your email address before signing in." | Resend Email |
| Invalid Email Format | "Please enter a valid email address." | Correct |
| Password Expired | "Your password has expired. Please reset it." | Reset Password |
| First Login Required | "Please complete your account setup before signing in." | Complete Setup |
| Org Disabled | "Your organization's access has been disabled. Please contact your administrator." | Contact Admin |

## Session Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Session Expired | "Your session has expired. Please sign in again." | Login |
| Session Invalid | "Your session is invalid. Please sign in again." | Login |
| Session Not Found | "Session not found. Please sign in again." | Login |
| Token Expired | "Your session has expired. Please sign in again." | Login |
| Token Invalid | "Authentication failed. Please sign in again." | Login |
| Token Revoked | "Your session has been revoked. Please sign in again." | Login |
| Concurrent Session | "You've been signed out because you signed in on another device." | Login |

## Permission Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Insufficient Permissions | "You don't have permission to access this feature." | Contact Admin |
| Role Restricted | "This action requires administrator privileges." | Contact Admin |
| Read Only | "You have read-only access. Contact your administrator for write access." | Contact Admin |
| Feature Restricted | "This feature is not available on your plan." | Upgrade |
| Plan Limit Reached | "You've reached your plan limit. Please upgrade to continue." | Upgrade |
| Not Team Member | "You're not a member of this team." | Request Access |
| Resource Forbidden | "You don't have access to this resource." | - |

## Password Reset Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Invalid Token | "This password reset link has expired or is invalid." | Request New |
| Token Expired | "This password reset link has expired. Please request a new one." | Request New |
| Email Not Found | "No account found with this email address." | Check Email |
| Already Used | "This reset link has already been used." | Request New |
| Recent Reset | "Password was recently reset. Please wait before requesting another reset." | Wait |
| Max Attempts | "Too many reset attempts. Please try again later." | Wait |

## Registration Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Email Exists | "An account with this email already exists." | Sign In |
| Invalid Invitation | "This invitation link is invalid or has expired." | Request New |
| Domain Not Allowed | "Email domain not authorized. Please use your company email." | Use Company Email |
| Registration Closed | "Registration is currently closed. Please contact your administrator." | Contact Admin |
| Invitation Required | "You need an invitation to join. Please contact your administrator." | Request Invite |

## OAuth/Social Login Errors

| Error | User Message |
|-------|--------------|
| OAuth Failed | "Social login failed. Please try again or use email login." |
| Account Not Linked | "No account linked to this social profile. Please sign in with email." |
| Email Mismatch | "Email from social account doesn't match. Please use the correct account." |
| Provider Error | "Authentication provider error. Please try again later." |
| Access Denied | "Access denied. You declined the authentication request." |

## MFA/2FA Errors

| Error | User Message | Action |
|-------|--------------|--------|
| MFA Required | "Two-factor authentication is required." | Enter Code |
| Invalid Code | "Invalid verification code. Please try again." | Retry |
| Code Expired | "Verification code expired. Please request a new one." | Request New |
| MFA Setup Required | "Please set up two-factor authentication to continue." | Setup MFA |
| Device Not Recognized | "Unrecognized device. Please verify your identity." | Verify |
| Too Many MFA Attempts | "Too many failed attempts. Please try again later." | Wait |

## Security Alert Messages

| Alert | Message |
|-------|---------|
| New Device | "We noticed a login from a new device. Please verify this was you." |
| New Location | "Login from an unusual location detected. Please verify." |
| Password Changed | "Your password was recently changed. If this wasn't you, please secure your account." |
| Email Changed | "Your email address was recently changed. If this wasn't you, please contact support." |
| Multiple Failed Logins | "Multiple failed login attempts detected. Consider changing your password." |
| Suspicious Activity | "Suspicious activity detected on your account. Please review recent activity." |
