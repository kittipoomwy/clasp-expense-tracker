/**
 * Configuration Template
 *
 * INSTRUCTIONS:
 * 1. Copy the values below
 * 2. Update the actual files with your configuration
 * 3. Run `clasp push` to deploy
 *
 * DO NOT commit this file with real values!
 */

// ============================================
// EMAIL WHITELIST CONFIGURATION
// ============================================
// Location: src/server/main.js (lines 7-13)
//
// Example:
const WHITELIST_EMAILS = [
  "your-email@gmail.com",
  "friend-email@gmail.com",
  "family-email@gmail.com"
];
//
// Leave empty to allow all users: []


// ============================================
// GOOGLE SPREADSHEET CONFIGURATION
// ============================================
// Location: src/server/sheetsService.js (line 6)
//
// How to find your Spreadsheet ID:
// 1. Open your Google Spreadsheet
// 2. Look at the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
// 3. Copy the ID between /d/ and /edit
//
// Example:
const SPREADSHEET_ID = "1ABC123xyz-EXAMPLE-ID";
//
// Leave empty "" to use active spreadsheet (if bound to script)


// ============================================
// GOOGLE FORM URL CONFIGURATION
// ============================================
// Location: src/client/authorized/script.html (lines 4-5)
//
// How to get your Form URL:
// 1. Open your Google Form
// 2. Click the "Send" button
// 3. Click the link icon
// 4. Copy the entire URL
//
// Example:
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc-EXAMPLE-FORM-ID/viewform";


// ============================================
// REQUIRED GOOGLE SHEET STRUCTURE
// ============================================
//
// Sheet name: "Responses"
//
// Required columns (in any order):
// - Timestamp              (Timestamp)    Example: 2024-01-15 14:30:00
// - Date                   (Date)         Example: 2024-01-15
// - Item                   (Text)         Example: Grocery shopping
// - Amount                 (Number)       Example: 150.50
// - Who paid?              (Text)         Example: Bill
// - How is it split?       (Text)         Example: 50/50 or 60/40
//   (Paid by / Owed)


// ============================================
// DEPLOYMENT CHECKLIST
// ============================================
//
// [ ] Install CLASP: npm install -g @google/clasp
// [ ] Login: clasp login
// [ ] Update WHITELIST_EMAILS in src/server/main.js
// [ ] Update SPREADSHEET_ID in src/server/sheetsService.js
// [ ] Update GOOGLE_FORM_URL in src/client/authorized/script.html
// [ ] Create Google Sheet with "Responses" sheet
// [ ] Create Google Form for expense input
// [ ] Push code: clasp push
// [ ] Deploy: clasp deploy
// [ ] Test web app URL
// [ ] Verify access control works
// [ ] Test on mobile device
//
// Done! Your expense tracker is ready to use.


// ============================================
// CUSTOMIZATION OPTIONS
// ============================================

// Currency Symbol
// Location: src/client/authorized/script.html
// Default: ฿ (Thai Baht)
// Change to: $, €, £, ¥, etc.

// App Title
// Location: src/client/authorized/index.html (line 21)
// Default: "Expense Tracker"

// Colors
// Location: src/client/authorized/styles.html (lines 9-20)
// Modify CSS variables for custom theme

// Sheet Name
// Location: Throughout src/server/main.js
// Default: "Responses"
// Change if your sheet has a different name
