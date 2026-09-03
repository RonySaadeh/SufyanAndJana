/**
 * Sufyan & Jana — RSVP backend.
 *
 * Receives each RSVP as a POST body from the invitation page and appends it
 * as one row in this spreadsheet. See the setup steps in the repo README.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVPs")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVPs");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted at", "Name", "Attending", "Party size",
      "Other guest names", "Note"
    ]);
    sheet.setFrozenRows(1);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attending === "yes" ? "Yes" : "No",
    data.guests || 0,
    (data.guestNames || []).join(", "),
    data.note || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
