# Quick Setup Guide

Get your Expense Tracker running in 10 minutes!

## Prerequisites

```bash
npm install -g @google/clasp
clasp login
```

## 5-Step Setup

### 1️⃣ Configure Email Whitelist

**File:** `src/server/main.js` (line 7-13)

```javascript
const WHITELIST_EMAILS = ["your-email@gmail.com", "friend@gmail.com"];
```

💡 Leave empty `[]` to allow everyone

---

### 2️⃣ Set Spreadsheet ID

**File:** `src/server/sheetsService.js` (line 6)

```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
```

📋 Get ID from URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`

---

### 3️⃣ Create Google Form

#### Option A: Automated Form Creation (Recommended) 🤖

1. Run `clasp push` to upload all files
2. Run `clasp open` to open Apps Script editor
3. Open `formCreator.js` file
4. Run the `createExpenseForm()` function
5. Copy the form URL from the execution logs
6. (Optional) Run `linkFormToSpreadsheet()` to link form responses
7. Update `GOOGLE_FORM_URL` in `src/client/authorized/script.html` (line 4-5)

💡 The automated form includes all required fields: Date, Item, Amount, Who paid?, Split ratio

#### Option B: Manual Form Creation

1. Create a Google Form manually
2. Add fields matching your sheet structure
3. Link form to "Responses" sheet (Form → Responses → Link to Sheets)
4. Get URL from Form → Send → Link
5. Update the form URL:

**File:** `src/client/authorized/script.html` (line 4-5)

```javascript
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";
```

---

### 4️⃣ Create Sheet Structure

Create a sheet named **"Responses"** with these columns:

| Column                            | Example             |
| --------------------------------- | ------------------- |
| Timestamp                         | 2024-01-15 14:30:00 |
| Date                              | 2024-01-15          |
| Item                              | Grocery             |
| Amount                            | 150.50              |
| Who paid?                         | Bill                |
| How is it split? (Paid by / Owed) | 50/50               |

---

### 5️⃣ Deploy

```bash
# Push code to Apps Script
clasp push

# Deploy as web app
clasp deploy

# Open in browser (optional)
clasp open
```

Then in Apps Script:

1. Click **Deploy** → **New deployment**
2. Set **Execute as:** Me
3. Set **Who has access:** Anyone (or as needed)
4. Click **Deploy**
5. Copy the **Web app URL** 🎉

---

## Test Your App

Visit your Web app URL and verify:

- ✅ Authorized users can login
- ✅ Data displays correctly
- ✅ "Add Expense" opens form
- ✅ Works on mobile

---

## Need Help?

- 📖 Full guide: `CONFIG.md`
- 📝 Template: `config.template.js`
- 🏗️ Architecture: `CLAUDE.md`

---

## Quick Commands

```bash
clasp push          # Upload changes
clasp pull          # Download changes
clasp open          # Open in browser
clasp logs          # View logs
clasp deploy        # Deploy new version
```

---

**That's it! Your Expense Tracker is ready to use! 🚀**
