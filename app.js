// Replace this with your actual Google Sheet JSON URL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1gUhMuNxbvQulFrBMUbyv_e7XUb7znhHO6t33wmCZs6A/gviz/tq?tqx=out:json";

let busData = [];

// Fetch and parse the data
async function fetchData() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    console.log("Raw JSON Response:", text); // Log raw JSON response

    // Clean up Google Sheets JSON
    const json = JSON.parse(text.substring(47).slice(0, -2));
    console.log("Parsed JSON Data:", json); // Log parsed JSON data

    // Map the rows to an array of objects
    busData = json.table.rows.map(row => ({
      startingTown: row.c[0]?.v.trim() || "", // Trim whitespace
      departureTime: row.c[1]?.v || "",
      busNumber: row.c[2]?.v || "",
      otherDetails: row.c[3]?.v || ""
    }));
    console.log("Mapped Bus Data:", busData); // Log mapped bus data

    displayResults(busData); // Display all buses initially
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("results").innerHTML = "<p>Error loading bus data.</p>";
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
  const query = document.getElementById("search-bar").value.toLowerCase().trim();
  const filteredData = busData.filter(bus =>
    bus.startingTown.toLowerCase().includes(query)
  );
  displayResults(filteredData);
}

// Initialize the app
fetchData();
