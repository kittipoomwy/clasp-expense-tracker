/**
 * Sheets Service - Handles all Google Sheets data operations
 */

// Configuration - Update with your spreadsheet ID or use active spreadsheet
const SPREADSHEET_ID = ""; // Leave empty to use active spreadsheet

/**
 * Get the spreadsheet instance
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID) {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (error) {
    Logger.log("Error getting spreadsheet: " + error.message);
    throw new Error("Unable to access spreadsheet");
  }
}

/**
 * Get sheet by name
 * @param {string} sheetName - Name of the sheet
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  return sheet;
}

/**
 * Get column headers from a sheet
 * @param {string} sheetName - Name of the sheet
 * @returns {Array<string>} Array of header names
 */
function getHeaders(sheetName) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.filter((header) => header !== ""); // Remove empty headers
}

/**
 * Get data from sheet
 * @param {string} sheetName - Name of the sheet
 * @param {string} range - Optional range (e.g., "A1:D10"). If not provided, gets all data
 * @param {boolean} asObjects - Return data as objects with headers as keys (default: true)
 * @returns {Array} Array of data
 */
function getData(sheetName, range = null, asObjects = true) {
  try {
    const sheet = getSheet(sheetName);
    let data;

    if (range) {
      data = sheet.getRange(range).getValues();
    } else {
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();

      if (lastRow === 0 || lastCol === 0) {
        return [];
      }

      data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    }

    if (asObjects && data.length > 0) {
      const headers = data[0];
      return data.slice(1).map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
    }

    return data;
  } catch (error) {
    Logger.log("Error getting data: " + error.message);
    throw error;
  }
}

/**
 * Add new data to sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Object|Array} data - Data to add (object or array of values)
 * @returns {Object} Result object with success status
 */
function addData(sheetName, data) {
  try {
    const sheet = getSheet(sheetName);
    const headers = getHeaders(sheetName);

    // Convert object to array based on headers
    let rowData;
    if (typeof data === "object" && !Array.isArray(data)) {
      rowData = headers.map((header) => data[header] || "");
    } else if (Array.isArray(data)) {
      rowData = data;
    } else {
      throw new Error("Invalid data format");
    }

    // Validate data
    if (!validateData(rowData, headers)) {
      throw new Error("Data validation failed");
    }

    // Append row
    sheet.appendRow(rowData);

    return {
      success: true,
      message: "Data added successfully",
      rowNumber: sheet.getLastRow(),
    };
  } catch (error) {
    Logger.log("Error adding data: " + error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Validate data before insertion
 * @param {Array} data - Data array to validate
 * @param {Array} headers - Header array for reference
 * @returns {boolean} True if valid
 */
function validateData(data, headers) {
  // Basic validation - check if data has values
  if (!data || data.length === 0) {
    return false;
  }

  // Check if data length matches headers
  if (data.length !== headers.length) {
    Logger.log("Warning: Data length does not match headers length");
  }

  // Add custom validation rules here
  // Example: check required fields, data types, etc.

  return true;
}

/**
 * Get all sheet names in the spreadsheet
 * @returns {Array<string>} Array of sheet names
 */
function getAllSheetNames() {
  const ss = getSpreadsheet();
  return ss.getSheets().map((sheet) => sheet.getName());
}

/**
 * Update existing data in sheet
 * @param {string} sheetName - Name of the sheet
 * @param {string|number} id - ID to match (first column value)
 * @param {Object} data - Updated data object
 * @returns {Object} Result object with success status
 */
function updateData(sheetName, id, data) {
  try {
    const sheet = getSheet(sheetName);
    const headers = getHeaders(sheetName);
    const allData = sheet.getDataRange().getValues();

    // Find row with matching ID (first column)
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] == id) {
        rowIndex = i + 1; // +1 for 1-based indexing
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("Record not found");
    }

    // Convert object to array based on headers
    const rowData = headers.map((header) => data[header] || "");

    // Update the row
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowData]);

    return {
      success: true,
      message: "Data updated successfully",
      rowNumber: rowIndex,
    };
  } catch (error) {
    Logger.log("Error updating data: " + error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Delete data from sheet
 * @param {string} sheetName - Name of the sheet
 * @param {string|number} id - ID to match (first column value)
 * @returns {Object} Result object with success status
 */
function deleteData(sheetName, id) {
  try {
    const sheet = getSheet(sheetName);
    const allData = sheet.getDataRange().getValues();

    // Find row with matching ID (first column)
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] == id) {
        rowIndex = i + 1; // +1 for 1-based indexing
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("Record not found");
    }

    // Delete the row
    sheet.deleteRow(rowIndex);

    return {
      success: true,
      message: "Data deleted successfully",
    };
  } catch (error) {
    Logger.log("Error deleting data: " + error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}
