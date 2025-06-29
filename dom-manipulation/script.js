const QUOTES_KEY = 'quotesData';
const SELECTED_CATEGORY_KEY = 'selectedCategory';

let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// --- Local Storage Helpers ---
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_KEY);
  if (stored) quotes = JSON.parse(stored);
}

function saveQuotes() {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
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

  quotes.push({ text: newText, category: newCategory });
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

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", () => showRandomQuote(true));
document.getElementById("exportBtn").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// --- Initialize App ---
loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastQuote();
filterQuotes();  // apply last selected filter on load