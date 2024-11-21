// script.js

// DOM elements
const labelInput = document.getElementById("labelInput");
const dateInput = document.getElementById("dateInput");
const addButton = document.getElementById("addButton");
const countdownList = document.getElementById("countdownList");

// Load countdowns from local storage
let countdowns = JSON.parse(localStorage.getItem("countdowns")) || [];

// Initialize the app
function init() {
  countdownList.innerHTML = ""; // Clear existing DOM to prevent duplication
  countdowns.forEach(addCountdownToDOM);
  updateCountdowns();
  setInterval(updateCountdowns, 1000); // Update all countdowns every second
}

// Add countdown
addButton.addEventListener("click", () => {
  const label = labelInput.value || "Unnamed Countdown";
  let dateValue = dateInput.value || getDefaultMidnight();

  const countdown = {
    id: Date.now(),
    label,
    targetDate: dateValue,
  };

  countdowns.push(countdown);
  localStorage.setItem("countdowns", JSON.stringify(countdowns));
  addCountdownToDOM(countdown);
  labelInput.value = "";
  dateInput.value = "";
});

// Add countdown to DOM
function addCountdownToDOM({ id, label, targetDate }) {
  const countdownItem = document.createElement("div");
  countdownItem.classList.add("countdown-item");
  countdownItem.dataset.id = id;

  const labelSpan = document.createElement("span");
  labelSpan.textContent = `${label} - `;

  const countdownSpan = document.createElement("span");
  countdownSpan.classList.add("countdown-time");
  countdownSpan.dataset.targetDate = targetDate;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => deleteCountdown(id, countdownItem));

  countdownItem.appendChild(labelSpan);
  countdownItem.appendChild(countdownSpan);
  countdownItem.appendChild(deleteButton);

  countdownList.appendChild(countdownItem);
}

// Update countdowns in the DOM
function updateCountdowns() {
  const countdownItems = document.querySelectorAll(".countdown-item");
  countdownItems.forEach((item) => {
    const countdownSpan = item.querySelector(".countdown-time");
    const targetDate = new Date(countdownSpan.dataset.targetDate);
    const timeLeft = targetDate - new Date();

    if (timeLeft <= 0) {
      countdownSpan.textContent = "Time's up!";
    } else {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      countdownSpan.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  });
}

// Delete countdown
function deleteCountdown(id, element) {
  countdowns = countdowns.filter((c) => c.id !== id);
  localStorage.setItem("countdowns", JSON.stringify(countdowns));
  countdownList.removeChild(element);
}

// Default midnight value
function getDefaultMidnight() {
  const now = new Date();
  now.setHours(24, 0, 0, 0); // Set to midnight of the next day
  return now.toISOString().slice(0, 16);
}

// Initialize the app
init();
