/**
 * Main entry point for the web app
 * Handles HTTP requests and routing
 */

// Email whitelist configuration
const WHITELIST_EMAILS = [
  // Add your whitelisted emails here
  // "user@example.com",
  // "another@example.com"
];

// Google Sheet configuration
const SHEET_NAME = "Responses";

/**
 * Include helper function for HTML templates
 * @param {string} filename - Name of the file to include
 * @returns {string} File content
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Check if user email is whitelisted
 * @returns {Object} {authorized: boolean, email: string, message: string}
 */
function checkAccess() {
  try {
    const userEmail = Session.getActiveUser().getEmail();

    console.log("Checking access for user:", userEmail);

    // If whitelist is empty, allow all users
    if (WHITELIST_EMAILS.length === 0) {
      return {
        authorized: true,
        email: userEmail,
        message: "Access granted (no whitelist configured)",
      };
    }

    // Check if user email is in whitelist
    const isAuthorized = WHITELIST_EMAILS.includes(userEmail);

    return {
      authorized: isAuthorized,
      email: userEmail,
      message: isAuthorized ? "Access granted" : "Access denied",
    };
  } catch (error) {
    Logger.log("Error checking access: " + error.message);
    return {
      authorized: false,
      email: "unknown",
      message: "Error verifying access",
    };
  }
}

/**
 * Get current user email
 * @returns {string} User email or effective user email
 */
function getUserEmail() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (email) {
      return email;
    }
    // Fallback to effective user if active user is not available
    return Session.getEffectiveUser().getEmail();
  } catch (error) {
    Logger.log("Error getting user email: " + error.message);
    return "Unknown User";
  }
}

/**
 * Handles GET requests - serves the web app
 * @param {Object} e - Event object containing request parameters
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  try {
    // Check access authorization
    const accessCheck = checkAccess();

    if (!accessCheck.authorized) {
      // Serve unauthorized page
      return HtmlService.createTemplateFromFile("client/unauthorized/index")
        .evaluate()
        .setTitle("Access Denied - Expense Tracker")
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
      // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // Get query parameters
    const params = e.parameter;

    // Handle different routes/actions via query params
    if (params.action) {
      return handleGetAction(params);
    }

    // Default: serve main web app HTML
    return HtmlService.createTemplateFromFile("client/authorized/index")
      .evaluate()
      .setTitle("Expense Tracker")
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
    //   .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    Logger.log("Error in doGet: " + error.message);
    return HtmlService.createHtmlOutput(
      "<h1>Error</h1><p>" + error.message + "</p>"
    );
  }
}

/**
 * Handles POST requests - for API calls and webhooks
 * @param {Object} e - Event object containing POST data
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
// function doPost(e) {
//   try {
//     const data = JSON.parse(e.postData.contents)
//   }
// }

/**
 * Handle GET request actions (like API endpoints)
 * @param {Object} params - Query parameters
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function handleGetAction(params) {
  let result;

  switch (params.action) {
    case "get":
      result = getData(params.sheetName || "Sheet1");
      break;
    case "sheets":
      result = getAllSheetNames();
      break;
    default:
      result = { success: false, message: "Invalid action" };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Calculate split amounts based on split ratio
 * @param {number} amount - Total amount
 * @param {string} splitRatio - Split ratio (e.g., "50/50", "60/40")
 * @returns {Object} {payer: amount, other: amount}
 */
function calculateSplit(amount, splitRatio) {
  if (!splitRatio || !splitRatio.includes("/")) {
    return { payer: amount / 2, other: amount / 2 };
  }

  const parts = splitRatio.split("/").map((p) => parseFloat(p.trim()));
  const total = parts[0] + parts[1];

  return {
    payer: (amount * parts[0]) / total,
    other: (amount * parts[1]) / total,
  };
}

/**
 * Client-callable function to get monthly summary for a specific user
 * @param {string} username - Username to calculate for (e.g., "Bill" or "Mook")
 * @returns {Object} Summary data for current month
 */
function getMonthlySummary(username = null) {
  try {
    const expenses = getData(SHEET_NAME, null, true);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses for current month
    const monthlyExpenses = expenses.filter((expense) => {
      if (!expense.Date) return false;
      const expenseDate = new Date(expense.Date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    if (!username) {
      // Total for everyone
      const totalSpending = monthlyExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.Amount || 0),
        0
      );
      return {
        totalSpending,
        transactions: monthlyExpenses.length,
        balanceOwed: 0,
      };
    }

    // Calculate for specific user
    let totalPaid = 0;
    let totalOwed = 0;

    monthlyExpenses.forEach((exp) => {
      const amount = parseFloat(exp.Amount || 0);
      const payer = exp["Who paid?"];
      const split = calculateSplit(
        amount,
        exp["How is it split? (Paid by / Owed)"]
      );

      if (payer === username) {
        // User paid this expense
        totalPaid += amount;
        totalOwed += split.payer; // Their share of what they paid
      } else {
        // Someone else paid
        totalOwed += split.other; // User's share of what they owe
      }
    });

    const balanceOwed = totalPaid - totalOwed; // Positive = others owe user, Negative = user owes others

    return {
      totalSpending: totalOwed, // Total amount user is responsible for
      transactions: monthlyExpenses.length,
      balanceOwed: balanceOwed,
    };
  } catch (error) {
    Logger.log("Error getting monthly summary: " + error.message);
    return {
      totalSpending: 0,
      transactions: 0,
      balanceOwed: 0,
    };
  }
}

/**
 * Client-callable function to get all-time summary for a specific user
 * @param {string} username - Username to calculate for (e.g., "Bill" or "Mook")
 * @returns {Object} Summary data for all time
 */
function getAllTimeSummary(username = null) {
  try {
    const expenses = getData(SHEET_NAME, null, true);

    if (!username) {
      // Total for everyone
      const totalSpending = expenses.reduce(
        (sum, exp) => sum + parseFloat(exp.Amount || 0),
        0
      );
      return {
        totalSpending,
        transactions: expenses.length,
        balanceOwed: 0,
      };
    }

    // Calculate for specific user
    let totalPaid = 0;
    let totalOwed = 0;

    expenses.forEach((exp) => {
      const amount = parseFloat(exp.Amount || 0);
      const payer = exp["Who paid?"];
      const split = calculateSplit(
        amount,
        exp["How is it split? (Paid by / Owed)"]
      );

      if (payer === username) {
        // User paid this expense
        totalPaid += amount;
        totalOwed += split.payer; // Their share of what they paid
      } else {
        // Someone else paid
        totalOwed += split.other; // User's share of what they owe
      }
    });

    const balanceOwed = totalPaid - totalOwed; // Positive = others owe user, Negative = user owes others

    return {
      totalSpending: totalOwed, // Total amount user is responsible for
      transactions: expenses.length,
      balanceOwed: balanceOwed,
    };
  } catch (error) {
    Logger.log("Error getting all-time summary: " + error.message);
    return {
      totalSpending: 0,
      transactions: 0,
      balanceOwed: 0,
    };
  }
}

/**
 * Get list of all users
 * @returns {Array<string>} Array of usernames
 */
function getAllUsers() {
  try {
    const expenses = getData(SHEET_NAME, null, true);
    const users = new Set();

    expenses.forEach((exp) => {
      if (exp["Who paid?"]) {
        users.add(exp["Who paid?"]);
      }
    });

    return Array.from(users).sort();
  } catch (error) {
    Logger.log("Error getting users: " + error.message);
    return [];
  }
}

/**
 * Client-callable function to get recent expenses
 * @returns {Array<Object>} Array of expense objects
 */
function getRecentExpenses() {
  try {
    const expenses = getData(SHEET_NAME, null, true);
    Logger.log(`Received ${expenses.length} expenses`);
    if (!expenses || !Array.isArray(expenses)) {
      return ["No expenses found"];
    }
    const recentExpenses = expenses
      .slice(-10)
      .reverse()
      .map((expense) => {
        delete expense["Timestamp"];
        return {
          ...expense,
          Date: expense.Date ? new Date(expense.Date).toISOString() : null,
        };
      });
    console.log("Recent expenses:", recentExpenses);
    return recentExpenses;
  } catch (error) {
    Logger.log("Error in getRecentExpenses: " + error.message);
    return ["Error loading expenses: " + error.message];
  }
}
