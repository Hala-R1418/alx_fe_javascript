const QUOTES_KEY = 'quotesData';
const SELECTED_CATEGORY_KEY = 'selectedCategory';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

let quotes = [
  { id: 1, text: "The only way to do great work is to love what you do.", category: "Motivation", updatedAt: Date.now() },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life", updatedAt: Date.now() },
  { id: 3, text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration", updatedAt: Date.now() }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// --- Local Storage Helpers ---
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_KEY);
  if (stored) {
    quotes = JSON.parse(stored);
  }
  updateLocalQuotesMap();
}

function saveQuotes() {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  updateLocalQuotesMap();
}

function saveSelectedCategory(category) {
  localStorage.setItem(SELECTED_CATEGORY_KEY, category);
}

function getSelectedCategory() {
  return localStorage.getItem(SELECTED_CATEGORY_KEY) || '';
}

// --- Show & Filter Quotes ---
function showRandomQuote(filtered = false) {
  const selectedCategory = getSelectedCategory();
  const filteredQuotes = filtered && selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.innerHTML = `
    <div class="quote">
      <p>"${quote.text}"</p>
      <small>— ${quote.category}</small>
    </div>
  `;

  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function loadLastQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `
      <div class="quote">
        <p>"${quote.text}"</p>
        <small>— ${quote.category}</small>
      </div>
    `;
  }
}

// --- Filtering ---
function populateCategories() {
  const selected = getSelectedCategory();
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selected) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);
  showRandomQuote(true);
}

// --- Quote Form ---
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Assign a unique id
  const maxId = quotes.length > 0 ? Math.max(...quotes.map(q => q.id || 0)) : 0;
  const newQuoteObj = {
    id: maxId + 1,
    text: newText,
    category: newCategory,
    updatedAt: Date.now()
  };

  quotes.push(newQuoteObj);
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added!");
}

function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  container.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = 'Add a New Quote';

  const inputQuote = document.createElement('input');
  inputQuote.id = 'newQuoteText';
  inputQuote.type = 'text';
  inputQuote.placeholder = 'Enter a new quote';

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteBtn';
  addButton.textContent = 'Add Quote';

  container.appendChild(heading);
  container.appendChild(inputQuote);
  container.appendChild(inputCategory);
  container.appendChild(addButton);

  addButton.addEventListener('click', addQuote);
}

// --- JSON Import/Export ---
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          // Assign id if missing to avoid duplicates
          if (!q.id) {
            const maxId = quotes.length > 0 ? Math.max(...quotes.map(qq => qq.id || 0)) : 0;
            q.id = maxId + 1;
          }
          q.updatedAt = Date.now();
          quotes.push(q);
        }
      });

      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
}

// --- Local quotes lookup ---
let localQuotesById = {};

function updateLocalQuotesMap() {
  localQuotesById = {};
  quotes.forEach(q => {
    if (q.id !== undefined) localQuotesById[q.id] = q;
  });
}

// --- Server Sync Functions ---
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Failed to fetch quotes from server');

    const data = await response.json();

    // Map posts to quotes structure (simulate)
    const serverQuotes = data.slice(0, 10).map(post => ({
      id: post.id,
      text: post.title,
      category: post.body || 'General',
      updatedAt: Date.now()
    }));

    return serverQuotes;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return null;
  }
}

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

  clearTimeout(notif.timeout);
  notif.timeout = setTimeout(() => {
    notif.textContent = '';
  }, 5000);
}

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
      // Conflict resolution: server wins if updatedAt is newer
      if (!local.updatedAt || sq.updatedAt > local.updatedAt) {
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
    filterQuotes();

    showNotification(`Data synced with server. ${conflictsResolved ? 'Conflicts resolved.' : ''} ${newDataAdded ? 'New quotes added.' : ''}`);
  }
}

function startPeriodicSync() {
  setInterval(async () => {
    const serverQuotes = await fetchQuotesFromServer();
    syncWithServer(serverQuotes);
  }, 30000);
}

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", () => showRandomQuote(true));
categoryFilter.addEventListener("change", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// --- Initialize App ---
loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastQuote();
filterQuotes();
startPeriodicSync();