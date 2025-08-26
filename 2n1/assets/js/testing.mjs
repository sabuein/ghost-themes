

/* This code is part of a calendar or scheduling interface where:

- Today's row gets special styling
- Form controls (select dropdowns) are disabled for dates that are too far in the past (more than 2 days ago)

*/

// Gets the current date
var today = new Date();

// Parses a date string (presumably in DD/MM/YYYY format) by splitting on "/" and converting to integers
var dateParts = value.split("/").map(function (s) { return parseInt(s) });

// Creates a Date object from the parsed parts (note: month is decremented by 1 since JavaScript months are 0-indexed)
var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

// DOM Element Selection
// Selects two grid elements (likely tables) using jQuery
// Determines the current row number based on the parent element's index
// Finds the corresponding rows in both grids
var visibleDatesGrid = $(P2_C45_);
var visibleGrid = $(P2_C5_);
var rowNum = $(this).parent().index() + 1;
var visibleDatesRow = visibleDatesGrid.find("tr:nth-child(" + rowNum + ")");
var visibleRow = visibleGrid.find("tr:nth-child(" + rowNum + ")");

// Compares the parsed date with today's date
// Adds a "todayRow" CSS class if it matches today, removes it otherwise
if (date.getDate() == today.getDate() && 
    date.getMonth() == today.getMonth() && 
    date.getFullYear() == today.getFullYear()) {
    visibleDatesRow.addClass("todayRow");
} else {
    visibleDatesRow.removeClass("todayRow");
}

// Form Control Management
// Calculates the date from two days ago
// Disables select elements in the row if the date is two or more days in the past
var dayBeforeYesterday = new Date().setDate(today.getDate() - 2);
visibleRow.find("select").prop("disabled", date <= dayBeforeYesterday);