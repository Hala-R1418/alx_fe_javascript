let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Build Add Quote Form using createElement & appendChild
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  container.innerHTML = ''; // Clear any existing content

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

  // Append elements
  container.appendChild(heading);
  container.appendChild(inputQuote);
  container.appendChild(inputCategory);
  container.appendChild(addButton);

  // Attach event listener
  addButton.addEventListener('click', addQuote);
}

// ✅ Populate categories (still using innerHTML for brevity)
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  let optionsHTML = `<option value=''>All</option>`;
  categories.forEach(category => {
    optionsHTML += `<option value="${category}">${category}</option>`;
  });
  categoryFilter.innerHTML = optionsHTML;
}

// ✅ Display a random quote using innerHTML
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory
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
}

// ✅ Add a quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  alert("New quote added!");
}

// ✅ Initial setup
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);
populateCategories();
createAddQuoteForm(); // <-- now uses createElement + appendChild