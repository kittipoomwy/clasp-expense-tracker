# Expense Tracker

A beautiful, responsive web app for tracking shared expenses, built with Google Apps Script and deployed as a web application.

## ✨ Features

- 📊 **Real-time Dashboard** - View monthly and all-time expense summaries
- 👥 **Multi-user Support** - Track expenses for different people
- 🔐 **Email Whitelist** - Control access with email authentication
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean design with smooth animations
- 📝 **Google Forms Integration** - Easy expense entry via Google Form
- 🤖 **Automated Form Creation** - Built-in script to create pre-configured form
- 💰 **Split Calculator** - Automatically calculate split expenses
- ⚡ **Fast & Lightweight** - No database setup required

## 🚀 Quick Start

### Prerequisites

- Node.js and npm
- Google Account
- CLASP CLI: `npm install -g @google/clasp`

### Installation

```bash
# Clone the repository
git clone https://github.com/kittipoomwy/clasp-expense-tracker.git
cd clasp

# Login to Google
clasp login

# Configure the app
# 1. Edit src/server/main.js - Add your emails
# 2. Edit src/server/sheetsService.js - Add your Spreadsheet ID
# 3. Create form using formCreator.js or manually (see SETUP.md)
# 4. Edit src/client/authorized/script.html - Add your Form URL

# Deploy
clasp push
clasp deploy
```

📖 **Detailed Setup:** See [SETUP.md](SETUP.md) for step-by-step instructions

## 📋 Configuration

### Required Setup

| What            | Where                               | How                                          |
| --------------- | ----------------------------------- | -------------------------------------------- |
| Email Whitelist | `src/server/main.js`                | Add authorized emails                        |
| Spreadsheet ID  | `src/server/sheetsService.js`       | Get from Sheet URL                           |
| Google Form     | Use `formCreator.js`                | Run `createExpenseForm()` or create manually |
| Form URL        | `src/client/authorized/script.html` | Get from Form "Send" or logs                 |

📚 **Full Configuration Guide:** See [CONFIG.md](CONFIG.md)

## 📊 Google Sheet Structure

Your spreadsheet needs a sheet named **"Responses"** with these columns:

- `Timestamp` - Timestamp
- `Date` - Expense date
- `Item` - Description
- `Amount` - Cost
- `Who paid?` - Payer name
- `How is it split? (Paid by / Owed)` - Split ratio (e.g., "50/50")

## 🎯 Usage

1. **Access the Web App** - Use the deployment URL
2. **Select User** - Choose whose expenses to view
3. **View Dashboard** - See monthly and all-time summaries
4. **Add Expense** - Click button to open Google Form
5. **Track Balances** - See who owes whom

## 🏗️ Project Structure

```
clasp/
├── src/
│   ├── server/
│   │   ├── main.js              # Entry point & routing
│   │   ├── sheetsService.js     # Data operations
│   │   ├── formCreator.js       # Automated form creation
│   │   └── utils.js             # Helper functions
│   ├── client/
│   │   ├── authorized/          # Main app UI
│   │   │   ├── index.html
│   │   │   ├── styles.html
│   │   │   └── script.html
│   │   └── unauthorized/        # Access denied page
│   │       ├── index.html
│   │       ├── styles.html
│   │       └── script.html
│   └── appsscript.json          # Apps Script config
├── .clasp.json                  # CLASP configuration
├── README.md                    # This file
├── SETUP.md                     # Quick setup guide
├── CONFIG.md                    # Detailed configuration
├── CLAUDE.md                    # Development guide
└── config.template.js           # Configuration template
```

## 🎨 Customization

### Change Colors

Edit `src/client/authorized/styles.html` (lines 9-20):

```css
:root {
  --primary-color: hsl(189, 50%, 55%);
  --secondary-color: hsl(189, 50%, 65%);
  /* Customize more colors... */
}
```

### Change Currency

Edit `src/client/authorized/script.html` - Replace `฿` with `$`, `€`, `£`, etc.

### Change Sheet Name

If your sheet isn't named "Responses", update references in `src/server/main.js`

## 🔐 Security Features

- ✅ Email whitelist authentication
- ✅ Server-side access control
- ✅ No exposed credentials
- ✅ Secure session management
- ✅ Logout/account switching

## 📱 Responsive Design

The app is fully responsive with breakpoints at:

- Desktop: >1024px
- Tablet: 768-1024px
- Mobile: 480-768px
- Small Mobile: <480px

## 🛠️ Development

### Local Development

```bash
# Pull latest from Apps Script
clasp pull

# Make changes to files

# Push to Apps Script
clasp push

# View logs
clasp logs
```

### Deployment

```bash
# Create new deployment
clasp deploy --description "Version description"

# List all deployments
clasp deployments

# Open in Apps Script editor
clasp open
```

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Quick setup guide (10 minutes)
- **[CONFIG.md](CONFIG.md)** - Complete configuration guide
- **[CLAUDE.md](CLAUDE.md)** - Development workflow & architecture
- **[config.template.js](config.template.js)** - Configuration template

## 🐛 Troubleshooting

### Access Denied for Authorized User

- Verify email spelling in whitelist
- Clear browser cache
- Try incognito mode

### Data Not Loading

- Check Spreadsheet ID is correct
- Verify sheet name is "Responses"
- Check column headers match

### Form Button Not Working

- Verify Form URL is correct
- Check popup blocker settings

📚 More solutions in [CONFIG.md](CONFIG.md#troubleshooting)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Google Apps Script
- Styled with modern CSS
- Deployed with CLASP CLI

## 📞 Support

For issues, questions, or suggestions:

- Check [CONFIG.md](CONFIG.md) for detailed setup
- Review [SETUP.md](SETUP.md) for quick start
- Consult [CLAUDE.md](CLAUDE.md) for architecture

---
