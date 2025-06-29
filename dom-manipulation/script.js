// Add this at the top along with your other constants
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulated server URL

// For demo purposes, we simulate quotes server-side as posts
// We'll map posts => { id, text: title, category: body }

// A map of local quotes by id (simulate server-side id)
let localQuotesById = {};

// Helper: build localQuotesById for quick lookup
function buildLocalQuotesMap() {
  localQuotesById = {};
  quotes.forEach(q => {
    if (q.id !== undefined) localQuotesById[q.id] = q;
  });
}

// Call this whenever quotes array changes (e.g., after loadQuotes or addQuote)
function updateLocalQuotesMap() {
  buildLocalQuotesMap();
}

// Call initially
updateLocalQuotesMap();

// Function to fetch quotes from "server"
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Failed to fetch server data');

    const data = await response.json();

    // Map server data to quote format, example mapping:
    // serverQuote = { id, title, body }
    const serverQuotes = data.slice(0, 10).map(post => ({
      id: post.id,
      text: post.title,
      category: post.body || 'General',
      updatedAt: Date.now()  // simulate timestamp
    }));

    return serverQuotes;

  } catch (error) {
    console.error('Error fetching server quotes:', error);
    return null;
  }
}

// Conflict resolution & merging
function syncWithServer(serverQuotes) {
  if (!serverQuotes) return;

  let conflictsResolved = false;
  let newDataAdded = false;

  updateLocalQuotesMap();

  serverQuotes.forEach(sq => {
    const local = localQuotesById[sq.id];

    if (!local) {
      // New quote from server — add it locally
      quotes.push(sq);
      newDataAdded = true;
    } else {
      // Conflict: if server updatedAt is newer, overwrite local
      // (Here we assume local quotes have no updatedAt so server always wins)
      if (!local.updatedAt || sq.updatedAt > local.updatedAt) {
        // Replace local quote with server quote
        const index = quotes.indexOf(local);
        if (index !== -1) {
          quotes[index] = sq;
          conflictsResolved = true;
        }
      }
    }
  });

  if (conflictsResolved || newDataAdded) {
    saveQuotes();
    populateCategories();
    filterQuotes(); // update displayed quote based on filter

    // Notify user
    showNotification(`Data synced with server. ${conflictsResolved ? 'Conflicts resolved.' : ''} ${newDataAdded ? 'New quotes added.' : ''}`);
  }
}

// Simple notification UI
function showNotification(message) {
  let notif = document.getElementById('notificationBar');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificationBar';
    notif.style.position = 'fixed';
    notif.style.top = '0';
    notif.style.left = '0';
    notif.style.right = '0';
    notif.style.backgroundColor = '#ffc';
    notif.style.color = '#333';
    notif.style.padding = '10px';
    notif.style.textAlign = 'center';
    notif.style.zIndex = '1000';
    notif.style.borderBottom = '1px solid #aaa';
    document.body.appendChild(notif);
  }
  notif.textContent = message;

  // Hide notification after 5 seconds
  clearTimeout(notif.timeout);
  notif.timeout = setTimeout(() => {
    notif.textContent = '';
  }, 5000);
}

// Periodic syncing every 30 seconds
function startPeriodicSync() {
  setInterval(async () => {
    const serverQuotes = await fetchServerQuotes();
    syncWithServer(serverQuotes);
  }, 30000); // 30 sec
}

// On page load, start syncing
window.addEventListener('load', () => {
  startPeriodicSync();
});