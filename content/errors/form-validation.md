# Form Validation Error Messages

## Required Field Messages

| Field Type | Error Message |
|------------|---------------|
| Generic | "This field is required" |
| Company Name | "Please enter a company name" |
| Deal Stage | "Please select a deal stage" |
| Email | "Please enter an email address" |
| Password | "Please enter a password" |
| Amount | "Please enter an amount" |
| Description | "Please enter a description" |
| Selection | "Please select an option" |
| File | "Please upload a file" |
| Name | "Please enter a name" |
| Title | "Please enter a title" |
| Phone | "Please enter a phone number" |
| Date | "Please select a date" |
| Sector | "Please select a sector" |
| Assigned To | "Please assign to a team member" |
| Role | "Please select a role" |
| Status | "Please select a status" |
| Source | "Please select a lead source" |
| Investment Stage | "Please select a funding stage" |

## Format Validation Messages

| Validation | Error Message | Example |
|------------|---------------|---------|
| Invalid Email | "Please enter a valid email address" | - |
| Invalid URL | "Please enter a valid URL (https://...)" | - |
| Invalid Phone | "Please enter a valid phone number" | - |
| Invalid Currency | "Please enter a valid amount" | "abc" |
| Invalid Date | "Please enter a valid date" | - |
| Invalid Number | "Please enter a valid number" | - |
| Invalid Year | "Please enter a valid year (1900-2099)" | - |
| Invalid ZIP | "Please enter a valid ZIP code" | - |
| Invalid Percentage | "Please enter a valid percentage (0-100)" | - |
| Contains HTML | "HTML tags are not allowed" | - |
| Special Characters | "Special characters are not allowed in this field" | - |

## Min/Max Validation Messages

| Validation | Error Message |
|------------|---------------|
| Min Length (2) | "Must be at least 2 characters" |
| Min Length (3) | "Must be at least 3 characters" |
| Min Length (5) | "Must be at least 5 characters" |
| Min Length (8) | "Must be at least 8 characters" |
| Min Length (10) | "Must be at least 10 characters" |
| Max Length (50) | "Must be 50 characters or less" |
| Max Length (100) | "Must be 100 characters or less" |
| Max Length (255) | "Must be 255 characters or less" |
| Max Length (500) | "Must be 500 characters or less" |
| Max Length (1000) | "Must be 1000 characters or less" |
| Min Amount ($1) | "Amount must be at least $1" |
| Min Amount ($1000) | "Amount must be at least $1,000" |
| Max Amount | "Amount exceeds maximum allowed" |
| Min Value (0) | "Value must be 0 or greater" |
| Min Value (1) | "Value must be at least 1" |
| Max Value (100) | "Value must be 100 or less" |
| Min Year | "Year must be 1900 or later" |
| Max Year | "Year cannot be in the future" |
| Min Employees | "Must have at least 1 employee" |
| Max File Size | "File size must be less than 50MB" |

## Password Validation

| Requirement | Error Message |
|-------------|---------------|
| Too Short | "Password must be at least 8 characters" |
| Too Long | "Password must be 128 characters or less" |
| No Uppercase | "Password must contain at least one uppercase letter" |
| No Lowercase | "Password must contain at least one lowercase letter" |
| No Number | "Password must contain at least one number" |
| No Special | "Password must contain at least one special character (!@#$%^&*)" |
| Common Password | "This password is too common. Please choose a stronger password" |
| Contains Email | "Password cannot contain your email address" |
| Contains Name | "Password cannot contain your name" |
| Passwords Don't Match | "Passwords do not match" |
| Same as Old | "New password must be different from current password" |

## Unique Constraint Messages

| Constraint | Error Message |
|------------|---------------|
| Duplicate Email | "An account with this email already exists" |
| Duplicate Company | "A company with this name already exists" |
| Duplicate Deal | "This deal already exists" |
| Duplicate Name | "This name is already in use" |
| Duplicate File | "A file with this name already exists" |
| Duplicate Agent | "An agent with this name already exists" |
| Duplicate Template | "A template with this name already exists" |
| Email in Use | "This email is already associated with an account" |

## Range Validation Messages

| Validation | Error Message |
|------------|---------------|
| Date in Future | "Date cannot be in the future" |
| Date Too Old | "Date cannot be before [date]" |
| End Before Start | "End date must be after start date" |
| Start After End | "Start date must be before end date" |
| Invalid Range | "Invalid date range selected" |

## File Upload Validation

| Validation | Error Message |
|------------|---------------|
| Invalid Type | "File type not supported. Please upload [types]" |
| File Too Large | "File is too large. Maximum size is [size]MB" |
| Too Many Files | "Maximum [number] files allowed" |
| Upload Failed | "Failed to upload file. Please try again" |
| Virus Detected | "File could not be uploaded for security reasons" |

## Custom Validation Messages

| Validation | Error Message |
|------------|---------------|
| Invalid Sector | "Please select a valid sector" |
| Invalid Stage | "Please select a valid deal stage" |
| Invalid Source | "Please select a valid lead source" |
| Invalid Role | "Please select a valid role" |
| Invalid Status | "Please select a valid status" |
| Invalid Priority | "Please select a valid priority" |
| Agent Name Taken | "An agent with this name already exists" |
| Invalid Schedule | "Please select a valid schedule" |
| Criteria Required | "At least one criterion is required" |
| Invalid Amount Format | "Please enter amount in USD (e.g., 1000000)" |
