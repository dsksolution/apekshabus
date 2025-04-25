// Fetch data from Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/<sheet-id>/gviz/tq?tqx=out:json";

let busData = [];

// Fetch and parse the data
async function fetchData() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2)); // Clean up Google Sheets JSON
    busData = json.table.rows.map(row => ({
      startingTown: row.c[0]?.v || "",
      departureTime: row.c[1]?.v || "",
      busNumber: row.c[2]?.v || "",
      otherDetails: row.c[3]?.v || ""
    }));
    displayResults(busData); // Display all buses initially
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display bus results
function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (data.length === 0) {
    resultsDiv.innerHTML = "<p>No buses found for this town.</p>";
    return;
  }

  data.forEach(bus => {
    const busItem = document.createElement("div");
    busItem.className = "bus-item";
    busItem.innerHTML = `
      <strong>Bus Number:</strong> ${bus.busNumber}<br>
      <strong>Starting Town:</strong> ${bus.startingTown}<br>
      <strong>Departure Time:</strong> ${bus.departureTime}<br>
      <strong>Other Details:</strong> ${bus.otherDetails}
    `;
    resultsDiv.appendChild(busItem);
  });
}

// Filter buses based on search input
function filterBuses() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const filteredData = busData.filter(bus =>
    bus.startingTown.toLowerCase().includes(query)
  );
  displayResults(filteredData);
}

// Initialize the app
fetchData();
