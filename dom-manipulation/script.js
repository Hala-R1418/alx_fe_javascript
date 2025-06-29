// Initial quote array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Populate category dropdown using innerHTML
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  let optionsHTML = `<option value=''>All</option>`;
  categories.forEach(category => {
    optionsHTML += `<option value="${category}">${category}</option>`;
  });
  categoryFilter.innerHTML = optionsHTML;
}

// Display a random quote using innerHTML
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <div class="quote">
      <p>"${quote.text}"</p>
      <small>— ${quote.category}</small>
    </div>
  `;
}

// Add a new quote and refresh UI
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  alert("New quote added!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
populateCategories();
