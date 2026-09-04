/**
 * Sufyan & Jana — RSVP backend.
 *
 * Receives each RSVP as a POST body from the invitation page, appends it as
 * one row in this spreadsheet, and emails a copy to NOTIFY_EMAIL. The sheet
 * write and the email are independent: a problem with one still lets the
 * other through, so a full inbox or a renamed tab never loses an RSVP
 * outright. Any failure gets written to the "Errors" tab of this same
 * spreadsheet, since the page itself can't tell you why a send failed - see
 * the repo README if that tab has rows in it.
 */
var NOTIFY_EMAIL = "attarsufyan@gmail.com, rony.saadehmisc@hotmail.com";

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  try {
    appendToSheet(data);
  } catch (sheetError) {
    logError("appendToSheet", sheetError);
  }

  try {
    sendNotification(data);
  } catch (emailError) {
    logError("sendNotification", emailError);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendToSheet(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVPs")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVPs");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted at", "Name", "Attending", "Party size",
      "Other guest names", "Note"
    ]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attending === "yes" ? "Yes" : "No",
    data.guests || 0,
    (data.guestNames || []).join(", "),
    data.note || ""
  ]);
}

function sendNotification(data) {
  var attending = data.attending === "yes";
  var guestNames = data.guestNames || [];

  var lines = [
    "Name: " + (data.name || "(not given)"),
    "Attending: " + (attending ? "Yes" : "No"),
    "Total guests: " + (attending ? (data.guests || 1) : 0)
  ];
  if (attending && guestNames.length) {
    lines.push("Guest names: " + guestNames.join(", "));
  }
  if (data.note) {
    lines.push("Note: " + data.note);
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "RSVP from " + (data.name || "a guest") + ": " + (attending ? "Attending" : "Not attending"),
    body: lines.join("\n")
  });
}

/* Writes straight into the spreadsheet rather than only the Apps Script
   execution log, since that log is easy to lose track of but this sheet
   isn't going anywhere. */
function logError(where, err) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors")
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Errors");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["When", "Where", "Error"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), where, String((err && err.message) || err)]);
  } catch (loggingError) {
    // If writing the error itself fails, there's nowhere left to report it.
  }
}
