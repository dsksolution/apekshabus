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
      startingTown: row.c[0]?.v.trim() || "", // Starting Town
      departureTime: row.c[1]?.v || "", // Departure Time
      busNumber: row.c[2]?.v || "", // Bus Number
      otherDetails: row.c[3]?.v || "", // Other Details
      route: row.c[4]?.v.trim() || "" // Route
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
    resultsDiv.innerHTML = "<p>No buses found for this town or route.</p>";
    return;
  }

  data.forEach((bus, index) => {
    const busItem = document.createElement("div");
    busItem.className = "bus-item";
    busItem.innerHTML = `
      <span>${bus.startingTown}</span><br>
      <strong>Departure Time:</strong> ${formatTime(bus.departureTime)}
    `;
    busItem.onclick = () => openModal(bus); // Open modal on click
    resultsDiv.appendChild(busItem);
  });
}

// Format the departure time from Google Sheets
function formatTime(timeString) {
  if (!timeString) return "N/A"; // Handle missing time
  const match = timeString.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
  if (!match) return timeString; // Return as-is if not in expected format

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) + 1; // Months are zero-indexed
  const day = parseInt(match[3], 10);
  const hours = parseInt(match[4], 10);
  const minutes = parseInt(match[5], 10);

  // Create a formatted time string
  const date = new Date(year, month, day, hours, minutes);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Open modal with bus details
function openModal(bus) {
  const modal = document.getElementById("modal");
  const modalBusNumber = document.getElementById("modal-bus-number");
  const modalStartingTown = document.getElementById("modal-starting-town");
  const modalDepartureTime = document.getElementById("modal-departure-time");
  const modalRoute = document.getElementById("modal-route");
  const modalOtherDetails = document.getElementById("modal-other-details");

  // Populate modal fields
  modalBusNumber.textContent = bus.busNumber;
  modalStartingTown.textContent = bus.startingTown;
  modalDepartureTime.textContent = formatTime(bus.departureTime);
  modalRoute.textContent = bus.route;
  modalOtherDetails.textContent = bus.otherDetails;

  // Show modal
  modal.style.display = "block";

  // Close modal when clicking the close button or outside the modal
  const closeButton = document.querySelector(".close");
  closeButton.onclick = () => closeModal(modal);
  window.onclick = (event) => {
    if (event.target === modal) closeModal(modal);
  };
}

// Close modal
function closeModal(modal) {
  modal.style.display = "none";
}

// Filter buses based on search input
function filterBuses() {
  const query = document.getElementById("search-bar").value.toLowerCase().trim();
  const filteredData = busData.filter(bus =>
    bus.startingTown.toLowerCase().includes(query) || // Search in starting town
    bus.route.toLowerCase().includes(query) // Search in route
  );
  displayResults(filteredData);
}

// Initialize the app
fetchData();
