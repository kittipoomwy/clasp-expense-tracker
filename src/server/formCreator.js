/**
 * Google Form Creator for Expense Tracker
 *
 * This script creates a pre-configured Google Form for expense tracking
 * that automatically saves responses to your Google Sheet.
 *
 * HOW TO USE:
 * 1. Open Apps Script editor: clasp open
 * 2. Run the function: createExpenseForm()
 * 3. Copy the form URL from the logs
 * 4. Update GOOGLE_FORM_URL in src/client/authorized/script.html
 * 5. Link form to your spreadsheet (see instructions below)
 */

/**
 * Creates a pre-configured expense tracking form
 * @returns {string} The URL of the created form
 */
function createExpenseForm() {
  try {
    // Create new form
    const form = FormApp.create("Expense Tracker - Add Expense");

    // Set form description
    form.setDescription(
      "Track your shared expenses. Fill out this form to add a new expense to the tracker."
    );

    // Configure form settings
    form.setCollectEmail(false);
    form.setLimitOneResponsePerUser(false);
    form.setShowLinkToRespondAgain(true);
    form.setConfirmationMessage("✅ Expense added successfully! Thank you.");

    // ========================================
    // SECTION 1: Expense Details
    // ========================================

    form
      .addSectionHeaderItem()
      .setTitle("Expense Information")
      .setHelpText("Enter the details of your expense");

    // Date field
    form
      .addDateItem()
      .setTitle("Date")
      .setHelpText("When was this expense made?")
      .setRequired(true);

    // Item/Description field
    form
      .addTextItem()
      .setTitle("Item")
      .setHelpText("What did you spend on? (e.g., Grocery, Restaurant, Gas)")
      .setRequired(true);

    // Amount field
    form
      .addTextItem()
      .setTitle("Amount")
      .setHelpText("How much did it cost? (numbers only, e.g., 150.50)")
      .setRequired(true)
      .setValidation(
        FormApp.createTextValidation()
          .setHelpText("Please enter a valid number (e.g., 150.50)")
          .requireNumber()
          .build()
      );

    // ========================================
    // SECTION 2: Payment Details
    // ========================================

    form
      .addSectionHeaderItem()
      .setTitle("Payment & Split Information")
      .setHelpText("Who paid and how should it be split?");

    // Who paid field (customize with your names)
    form
      .addMultipleChoiceItem()
      .setTitle("Who paid?")
      .setHelpText("Select the person who paid for this expense")
      .setChoiceValues(["User1", "User2"]) // CUSTOMIZE THIS with your names
      .setRequired(true);

    // Split ratio field
    form
      .addTextItem()
      .setTitle("How is it split? (Paid by / Owed)")
      .setHelpText("Enter split ratio (e.g., 50/50, 60/40, 70/30)")
      .setRequired(true)
      .setValidation(
        FormApp.createTextValidation()
          .setHelpText("Format: XX/YY (e.g., 50/50 or 60/40)")
          .requireTextMatchesPattern("\\d+/\\d+")
          .build()
      );

    // ========================================
    // SECTION 3: Additional Info (Optional)
    // ========================================

    form.addSectionHeaderItem().setTitle("Additional Information (Optional)");

    // Category field (optional)
    form
      .addMultipleChoiceItem()
      .setTitle("Category")
      .setHelpText("Categorize your expense (optional)")
      .setChoiceValues([
        "Food & Dining",
        "Groceries",
        "Transportation",
        "Entertainment",
        "Shopping",
        "Bills & Utilities",
        "Health & Wellness",
        "Other",
      ])
      .setRequired(false);

    // Notes field (optional)
    form
      .addParagraphTextItem()
      .setTitle("Notes")
      .setHelpText("Any additional notes about this expense? (optional)")
      .setRequired(false);

    // Get form URL and ID
    const formUrl = form.getPublishedUrl();
    const formId = form.getId();

    // Log the results
    Logger.log("✅ Form created successfully!");
    Logger.log("Form ID: " + formId);
    Logger.log("Form URL: " + formUrl);
    Logger.log("Edit URL: " + form.getEditUrl());

    // Return the URL
    return formUrl;
  } catch (error) {
    Logger.log("❌ Error creating form: " + error.message);
    throw error;
  }
}

/**
 * Links the form responses to your Google Spreadsheet
 *
 * INSTRUCTIONS:
 * 1. Run createExpenseForm() first
 * 2. Copy the Form ID from the logs
 * 3. Update the FORM_ID below
 * 4. Run this function: linkFormToSpreadsheet()
 */
function linkFormToSpreadsheet() {
  // CONFIGURATION - Update these values
  const FORM_ID = "YOUR_FORM_ID_HERE"; // Get this from createExpenseForm() logs
  const SPREADSHEET_ID = ""; // Leave empty to use active spreadsheet
  const SHEET_NAME = "Responses"; // Sheet name for form responses

  try {
    // Get form
    const form = FormApp.openById(FORM_ID);

    // Get spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    // Check if sheet exists, create if not
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Set form destination
    form.setDestination(
      FormApp.DestinationType.SPREADSHEET,
      spreadsheet.getId()
    );

    Logger.log("✅ Form linked to spreadsheet successfully!");
    Logger.log("Spreadsheet: " + spreadsheet.getName());
    Logger.log("Sheet: " + SHEET_NAME);
    Logger.log("Responses will be saved to: " + spreadsheet.getUrl());
  } catch (error) {
    Logger.log("❌ Error linking form: " + error.message);
    throw error;
  }
}

/**
 * Helper function to get form edit URL
 * Run this if you need to manually edit the form later
 */
function getFormEditUrl() {
  const FORM_ID = "YOUR_FORM_ID_HERE"; // Update with your form ID

  try {
    const form = FormApp.openById(FORM_ID);
    Logger.log("Form Edit URL: " + form.getEditUrl());
    Logger.log("Form Published URL: " + form.getPublishedUrl());
  } catch (error) {
    Logger.log("Error: " + error.message);
  }
}

/**
 * Customization function - Update form with your specific names
 * Run this after creating the form to customize names
 */
function customizeFormNames() {
  const FORM_ID = "YOUR_FORM_ID_HERE"; // Update with your form ID
  const YOUR_NAMES = ["Name1", "Name2", "Name3"]; // Add your names here

  try {
    const form = FormApp.openById(FORM_ID);
    const items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);

    // Find and update "Who paid?" question
    items.forEach((item) => {
      const mcItem = item.asMultipleChoiceItem();
      if (mcItem.getTitle() === "Who paid?") {
        mcItem.setChoiceValues(YOUR_NAMES);
        Logger.log("✅ Updated names to: " + YOUR_NAMES.join(", "));
      }
    });
  } catch (error) {
    Logger.log("Error: " + error.message);
  }
}
