# API Error Messages

## Network Errors

| Error | User Message | Action |
|-------|--------------|--------|
| No Connection | "Unable to connect. Please check your internet connection." | Retry |
| Timeout | "Request timed out. Please try again." | Retry |
| DNS Error | "Unable to reach the server. Please try again later." | Retry |
| Connection Reset | "Connection interrupted. Please try again." | Retry |
| SSL Error | "Secure connection failed. Please check your network settings." | Retry |

## Server Errors (5xx)

| Error | User Message | Action |
|-------|--------------|--------|
| 500 Internal Error | "Something went wrong on our end. We're working to fix it." | Retry |
| 502 Bad Gateway | "Service temporarily unavailable. Please try again in a moment." | Retry |
| 503 Service Unavailable | "We're performing maintenance. Please check back shortly." | Wait |
| 504 Gateway Timeout | "The request took too long. Please try again." | Retry |
| 505 HTTP Version | "Connection error. Please try again." | Retry |
| 507 Insufficient Storage | "Server storage full. Please contact support." | Contact Support |
| 508 Loop Detected | "Request loop detected. Please try again." | Retry |

## Client Errors (4xx)

| Error | User Message | Action |
|-------|--------------|--------|
| 400 Bad Request | "The request was invalid. Please check your input and try again." | Review |
| 401 Unauthorized | "Your session has expired. Please sign in again." | Login |
| 403 Forbidden | "You don't have permission to perform this action." | Contact Admin |
| 404 Not Found | "The requested resource was not found." | Go Back |
| 405 Method Not Allowed | "This action is not allowed." | - |
| 408 Request Timeout | "Request took too long. Please try again." | Retry |
| 409 Conflict | "This action conflicts with the current state. Please refresh and try again." | Refresh |
| 410 Gone | "This resource is no longer available." | - |
| 413 Payload Too Large | "The file is too large. Maximum size is 50MB." | Reduce Size |
| 415 Unsupported Media | "File type not supported." | Change File |
| 422 Validation | "Please correct the errors below and try again." | Fix Errors |
| 429 Rate Limit | "Too many requests. Please wait a moment and try again." | Wait |
| 451 Legal Restrictions | "This content is not available in your region." | - |

## Data Loading Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Failed to Load Deals | "Unable to load deals. Please refresh the page." | Refresh |
| Failed to Load Deal | "Unable to load deal details. Please try again." | Retry |
| Failed to Load Companies | "Unable to load companies. Please refresh the page." | Refresh |
| Failed to Load Company | "Unable to load company details. Please try again." | Retry |
| Failed to Load Agents | "Unable to load AI agents. Please try again." | Retry |
| Failed to Load Agent | "Unable to load agent details. Please try again." | Retry |
| Failed to Load Data | "Unable to load data. Please check your connection and try again." | Retry |
| Failed to Load Analytics | "Unable to load analytics. Please try again." | Retry |
| Failed to Load Reports | "Unable to load reports. Please try again." | Retry |
| Failed to Load Documents | "Unable to load documents. Please try again." | Retry |
| Failed to Load Team | "Unable to load team members. Please try again." | Retry |
| Failed to Load Settings | "Unable to load settings. Please try again." | Retry |

## Data Mutation Errors

| Error | User Message | Action |
|-------|--------------|--------|
| Create Failed | "Failed to create. Please try again." | Retry |
| Update Failed | "Failed to save changes. Please try again." | Retry |
| Delete Failed | "Failed to delete. Please try again." | Retry |
| Archive Failed | "Failed to archive. Please try again." | Retry |
| Restore Failed | "Failed to restore. Please try again." | Retry |
| Duplicate Failed | "Failed to duplicate. Please try again." | Retry |
| Import Failed | "Import failed. Please check your file and try again." | Review |
| Export Failed | "Export failed. Please try again." | Retry |
| Upload Failed | "Upload failed. Please try again." | Retry |
| Bulk Action Failed | "Bulk action failed for some items. Please try again." | Retry |

## Specific API Errors

| Error | User Message |
|-------|--------------|
| Deal Not Found | "Deal not found. It may have been deleted or you don't have access." |
| Company Not Found | "Company not found. It may have been deleted or you don't have access." |
| User Not Found | "User not found." |
| Agent Not Found | "Agent not found." |
| Document Not Found | "Document not found." |
| Invalid Deal ID | "Invalid deal identifier." |
| Invalid Company ID | "Invalid company identifier." |
| Agent Execution Failed | "Agent execution failed. Please check the agent configuration and try again." |
| Agent Not Configured | "Agent not properly configured. Please update settings and try again." |
| Integration Failed | "Integration connection failed. Please check your settings." |
| Email Send Failed | "Failed to send email. Please try again." |
| Report Generation Failed | "Report generation failed. Please try again." |
| Calculation Error | "Calculation error occurred. Please refresh and try again." |

## Retry Guidance

| Scenario | Message |
|----------|---------|
| First Retry | "Please try again." |
| Second Retry | "Still having trouble? Try refreshing the page." |
| Multiple Failures | "We're experiencing technical difficulties. Please try again later or contact support." |
| Temporary Issue | "This appears to be a temporary issue. Please try again in a few minutes." |
