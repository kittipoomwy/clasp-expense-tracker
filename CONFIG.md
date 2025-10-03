# Configuration Guide

This guide will help you set up and configure the Expense Tracker for your own use.

## Prerequisites

- Node.js and npm installed
- Google Account
- CLASP CLI installed (`npm install -g @google/clasp`)
- A Google Spreadsheet for storing expense data
- A Google Form for adding expenses

## Quick Setup Checklist

- [ ] Configure email whitelist
- [ ] Set up Google Spreadsheet ID
- [ ] Configure Google Form URL
- [ ] Deploy to Apps Script
- [ ] Configure deployment permissions

---

## Step 1: Configure Email Whitelist

Edit `src/server/main.js` (lines 7-13):

```javascript
const WHITELIST_EMAILS = [
  "your-email@gmail.com",
  "another-email@gmail.com"
];
```

**Options:**
- Leave array empty `[]` to allow all users
- Add specific emails to restrict access

---

## Step 2: Configure Google Spreadsheet

Edit `src/server/sheetsService.js` (line 6):

```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
```

**How to get your Spreadsheet ID:**
1. Open your Google Spreadsheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. Paste it into the `SPREADSHEET_ID` variable

**Leave empty** to use the active spreadsheet (if script is bound to a spreadsheet).

---

## Step 3: Create and Configure Google Form

### Option A: Automated Form Creation (Recommended)

The project includes `src/server/formCreator.js` for automated form setup.

**Steps:**
1. Ensure you've run `clasp push` to upload all files
2. Open Apps Script editor: `clasp open`
3. Open the `formCreator.js` file
4. Run `createExpenseForm()` function from the dropdown
5. Check execution logs for the form URL (View → Logs)
6. (Optional) Run `linkFormToSpreadsheet()` to automatically link responses
7. Copy the form URL and update `src/client/authorized/script.html` (lines 4-5)

**Form Creator Functions:**
- `createExpenseForm()` - Creates form with all required fields
- `linkFormToSpreadsheet()` - Links form responses to your sheet
- `customizeFormNames()` - Updates "Who paid?" dropdown options
- `getFormEditUrl()` - Gets the edit URL for an existing form

**What the automated form includes:**
- Date field (date picker)
- Item field (short text)
- Amount field (number)
- Who paid? (dropdown with customizable names)
- How is it split? (text field for ratios like 50/50)
- Pre-configured confirmation message
- Automatic timestamp

### Option B: Manual Form Creation

**Steps:**
1. Create a new Google Form
2. Add the following fields:
   - Date (Date)
   - Item (Short answer)
   - Amount (Short answer)
   - Who paid? (Multiple choice or Dropdown)
   - How is it split? (Short answer)
3. Click "Send" button
4. Copy the link
5. Link form to your spreadsheet (Responses → Link to Sheets → Select "Responses" sheet)

**Update the Form URL:**

Edit `src/client/authorized/script.html` (lines 4-5):

```javascript
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";
```

---

## Step 4: Set Up Google Sheet Structure

Your Google Spreadsheet should have a sheet named **"Responses"** with the following columns:

| Column Name | Description | Example |
|------------|-------------|---------|
| Timestamp | Timestamp | 2024-01-15 14:30:00 |
| Date | Expense date | 2024-01-15 |
| Item | Description | Grocery shopping |
| Amount | Cost | 150.50 |
| Who paid? | Payer name | Bill |
| How is it split? (Paid by / Owed) | Split ratio | 50/50 or 60/40 |

---

## Step 5: Initial CLASP Setup

If this is your first time using CLASP:

```bash
# Login to Google Account
clasp login

# Create new Apps Script project
clasp create --title "Expense Tracker" --type webapp

# Or clone existing project
clasp clone YOUR_SCRIPT_ID
```

---

## Step 6: Deploy the Application

```bash
# Push files to Apps Script
clasp push

# Deploy as web app
clasp deploy

# Get deployment URL
clasp deployments
```

---

## Step 7: Configure Deployment Settings

1. Open Apps Script editor:
   ```bash
   clasp open
   ```

2. Click **Deploy** → **New deployment**

3. Configure settings:
   - **Type:** Web app
   - **Execute as:** Me (your email)
   - **Who has access:**
     - Anyone (if whitelist is configured)
     - Anyone with Google account
     - Only myself

4. Click **Deploy**

5. Copy the **Web app URL**

---

## Configuration Summary

### Files to Configure:

| File | Purpose | Line Numbers |
|------|---------|--------------|
| `src/server/main.js` | Email whitelist | 7-13 |
| `src/server/sheetsService.js` | Spreadsheet ID | 6 |
| `src/client/authorized/script.html` | Form URL | 4-5 |

---

## Testing Your Setup

1. Open the web app URL in your browser
2. Verify:
   - ✅ Authorized email can access
   - ✅ Unauthorized email sees access denied page
   - ✅ Data loads from spreadsheet
   - ✅ "Add Expense" button opens form
   - ✅ Responsive design works on mobile

---

## Troubleshooting

### Issue: "Access Denied" for authorized email
- Check email spelling in whitelist
- Clear browser cache and cookies
- Try incognito mode
- Verify deployment permissions

### Issue: Data not loading
- Verify `SPREADSHEET_ID` is correct
- Check sheet name is "Responses"
- Verify column headers match expected format
- Check Apps Script execution logs: `clasp logs`

### Issue: Form button not working
- Verify `GOOGLE_FORM_URL` is correct
- Check browser popup blocker settings

### Issue: Form creation errors
- Verify you have permission to create forms in your Google account
- Check execution logs: `clasp logs` or View → Logs in Apps Script
- Ensure `SPREADSHEET_ID` is set correctly in `sheetsService.js`
- If `linkFormToSpreadsheet()` fails, check that sheet name is "Responses"

### Issue: Mobile layout broken
- Clear cache and hard refresh
- Verify viewport meta tag is present
- Check `clasp push` was successful

---

## Updating the Application

After making changes:

```bash
# Push changes
clasp push

# View logs (if needed)
clasp logs

# Create new version
clasp deploy --description "Updated features"
```

---

## Security Best Practices

1. **Never commit sensitive data:**
   - Keep `.clasp.json` in `.gitignore`
   - Don't expose Spreadsheet IDs publicly
   - Use environment-specific configs

2. **Use email whitelist** for production

3. **Review Apps Script permissions** before deployment

4. **Monitor access logs** regularly

---

## Support & Customization

For customization help, refer to:
- `CLAUDE.md` - Project architecture and development workflow
- `PLAN.md` - Original project plan and structure
- Apps Script Documentation: https://developers.google.com/apps-script

---

## Quick Reference Commands

```bash
# Login
clasp login

# Push changes
clasp push

# Pull remote changes
clasp pull

# Open in browser
clasp open

# View logs
clasp logs

# Deploy
clasp deploy

# List deployments
clasp deployments
```
