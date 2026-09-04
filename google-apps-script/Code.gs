/**
 * Sufyan & Jana — RSVP backend.
 *
 * Receives each RSVP as a POST body from the invitation page, appends it as
 * one row in this spreadsheet, and emails a copy to NOTIFY_EMAIL. The sheet
 * write and the email are independent: a problem with one still lets the
 * other through, so a full inbox or a renamed tab never loses an RSVP
 * outright. See the setup steps in the repo README.
 */
var NOTIFY_EMAIL = "attarsufyan@gmail.com";

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  try {
    appendToSheet(data);
  } catch (sheetError) {
    // The email below is the fallback, so a sheet problem shouldn't stop it.
  }

  try {
    sendNotification(data);
  } catch (emailError) {
    // Likewise, an email problem shouldn't cost the sheet row above.
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
