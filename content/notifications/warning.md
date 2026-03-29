# Warning Notification Messages

## Unsaved Changes

| Context | Message |
|---------|---------|
| Navigating Away | "You have unsaved changes. Are you sure you want to leave?" |
| Closing Modal | "You have unsaved changes. Discard changes?" |
| Form Exit | "Changes not saved. Leave without saving?" |
| Browser Close | "You have unsaved changes. Are you sure you want to close this tab?" |
| Logout Warning | "You have unsaved changes. Save before signing out?" |
| Timeout Warning | "Your session will expire in [X] minutes. Save your work to avoid losing changes." |

## Delete Confirmations

### Single Item
| Context | Message |
|---------|---------|
| Delete Deal | "Are you sure you want to delete this deal? This action cannot be undone." |
| Delete Company | "Are you sure you want to delete this company? All associated deals will also be removed." |
| Delete User | "Are you sure you want to remove this user? They will lose access immediately." |
| Delete Agent | "Are you sure you want to delete this agent? All run history will be lost." |
| Delete Document | "Are you sure you want to delete this document? This action cannot be undone." |
| Delete Report | "Are you sure you want to delete this report?" |
| Delete Template | "Are you sure you want to delete this template?" |
| Delete Comment | "Delete this comment? This action cannot be undone." |
| Delete Note | "Delete this note? This action cannot be undone." |

### Bulk Delete
| Context | Message |
|---------|---------|
| Bulk Delete Deals | "Are you sure you want to delete [X] deals? This action cannot be undone." |
| Bulk Delete Companies | "Are you sure you want to delete [X] companies? All associated data will be removed." |
| Bulk Delete Users | "Are you sure you want to remove [X] users? They will lose access immediately." |
| Bulk Delete Documents | "Are you sure you want to delete [X] documents? This action cannot be undone." |

### Archive vs Delete
| Context | Message |
|---------|---------|
| Archive Deal | "Archive this deal? You can restore it later from the archive." |
| Archive Company | "Archive this company? You can restore it later." |
| Archive Warning | "This will archive [X] items. They can be restored from the archive later." |

## Bulk Actions

| Context | Message |
|---------|---------|
| Bulk Assign | "Assign [X] deals to [Name]?" |
| Bulk Stage Change | "Move [X] deals to [Stage]?" |
| Bulk Status Change | "Change status for [X] items?" |
| Bulk Archive | "Archive [X] deals?" |
| Bulk Restore | "Restore [X] archived items?" |
| Bulk Export | "Export [X] items? This may take a few minutes." |
| Bulk Import Warning | "This will import [X] records. Please review before confirming." |

## Limit Warnings

### Storage
| Context | Message |
|---------|---------|
| Storage 80% | "You're using 80% of your storage limit" |
| Storage 90% | "You're using 90% of your storage limit. Consider upgrading your plan." |
| Storage Full | "Storage limit reached. Please free up space or upgrade your plan." |
| Storage Warning | "Large file. This will use [X]% of your remaining storage." |

### User Limits
| Context | Message |
|---------|---------|
| User Limit Approaching | "You're approaching your user limit ([current]/[max])." |
| User Limit Reached | "User limit reached. Contact sales to add more seats." |
| Seat Warning | "This will exceed your plan's user limit. Upgrade to add more users." |

### API/Rate Limits
| Context | Message |
|---------|---------|
| Rate Limit 80% | "You're approaching your API rate limit." |
| Rate Limit Warning | "Rate limit approaching. Consider spacing out requests." |
| API Limit Warning | "You're approaching your monthly API call limit." |

### Feature Limits
| Context | Message |
|---------|---------|
| Report Limit | "You're approaching your monthly report limit." |
| Export Limit | "Export limit approaching. [X] exports remaining this month." |
| Agent Limit | "Agent limit reached. Upgrade to create more agents." |
| Integration Limit | "Integration limit reached. Upgrade to add more integrations." |

## Deactivation Warnings

| Context | Message |
|---------|---------|
| Deactivate Agent | "Deactivating this agent will stop all scheduled runs. Continue?" |
| Disable User | "Disabling this user will prevent them from accessing the platform. Continue?" |
| Cancel Subscription | "Canceling will remove access at the end of your billing period. Continue?" |
| Downgrade Plan | "Downgrading will [list of changes]. Continue?" |
| Remove Integration | "Removing this integration will stop data sync. Continue?" |
| Revoke Access | "Revoking access cannot be undone. Continue?" |

## Data Loss Warnings

| Context | Message |
|---------|---------|
| Overwrite Warning | "This will overwrite existing data. Continue?" |
| Replace Warning | "This will replace the current [item]. Continue?" |
| Merge Warning | "This will merge [X] records into one. This cannot be undone." |
| Import Overwrite | "This import may overwrite existing records. Continue?" |
| Bulk Update Warning | "This will update [X] records. Continue?" |

## Session & Security Warnings

| Context | Message |
|---------|---------|
| Session Expiring | "Your session expires in [X] minutes. Save your work." |
| Inactivity Warning | "You've been inactive. You will be signed out in [X] minutes for security." |
| Concurrent Login | "You have an active session on another device. Sign out other sessions?" |
| Password Expiring | "Your password expires in [X] days. Update now?" |
| Weak Password | "This password is weak. Consider using a stronger password." |
| Unsaved Security | "Security changes not saved. Save before leaving?" |

## Sync & Connection Warnings

| Context | Message |
|---------|---------|
| Sync Conflict | "Sync conflict detected. Please review and resolve." |
| Sync Delay | "Sync is experiencing delays. Changes may take longer to appear." |
| Offline Changes | "You have unsaved changes that will sync when you're back online." |
| Connection Unstable | "Connection unstable. Some features may not work properly." |
| Integration Error | "Integration experiencing issues. Data may be out of sync." |

## Validation Warnings

| Context | Message |
|---------|---------|
| Invalid Characters | "Some characters may not display correctly. Continue?" |
| Large File Warning | "This file is large ([size]). Upload may take several minutes." |
| Format Warning | "This file format may not be fully supported. Continue?" |
| Data Validation | "Some data may not meet validation rules. Review before saving?" |
| Duplicate Warning | "A similar record already exists. Continue anyway?" |
