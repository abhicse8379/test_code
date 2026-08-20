const feedback = document.getElementById("feedback");
const productGrid = document.getElementById("productGrid");
const shoppingList = document.getElementById("shoppingList");
const cartCount = document.getElementById("cartCount");
const previewImage = document.querySelector("#previewImage");
const previewName = document.querySelector("#previewName");
const productCards = document.getElementsByClassName("product-card");
const navigationButtons = document.querySelectorAll(".nav-link");
const listItems = document.getElementsByTagName("li");
let itemCount = 0;
let feedbackTimer;

function showFeedback(message) {
    feedback.textContent = message;
    feedback.classList.add("visible");
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedback.classList.remove("visible"), 2600);
}

function previewProduct(card) {
    document.querySelector(".product-card.selected")?.classList.remove("selected");
    card.classList.add("selected");
    previewImage.src = card.dataset.image;
    previewImage.alt = `${card.dataset.name} preview`;
    previewName.innerHTML = `${card.dataset.name} <span>${card.dataset.price}</span>`;
}

productGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    previewProduct(card);
    if (event.target.classList.contains("add-button")) addToList(card.dataset.name);
    else showFeedback(`Previewing ${card.dataset.name}.`);
});

productGrid.addEventListener("dblclick", (event) => {
    const card = event.target.closest(".product-card");
    if (card) addToList(card.dataset.name);
});

productGrid.addEventListener("mouseover", (event) => {
    const card = event.target.closest(".product-card");
    if (card) card.querySelector(".add-button").textContent = "Click to add";
});

productGrid.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".product-card");
    if (card) card.querySelector(".add-button").textContent = "Add to list";
});

function addToList(name) {
    shoppingList.querySelector(".empty-item")?.remove();
    const item = document.createElement("li");
    item.className = "list-item";
    item.textContent = name;
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    item.append(" ", removeButton);
    shoppingList.appendChild(item);
    itemCount++;
    cartCount.textContent = itemCount;
    showFeedback(`${name} added to your list.`);
}

shoppingList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-button")) return;
    event.target.parentElement.remove();
    itemCount--;
    cartCount.textContent = itemCount;
    if (!shoppingList.children.length) shoppingList.innerHTML = '<li class="empty-item">Your list is empty.</li>';
    showFeedback("Item removed from your list.");
});

document.getElementById("clearButton").addEventListener("click", () => {
    shoppingList.innerHTML = '<li class="empty-item">Your list is empty.</li>';
    itemCount = 0;
    cartCount.textContent = itemCount;
    showFeedback("Your shopping list has been cleared.");
});

document.getElementById("themeButton").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    showFeedback("Theme switched.");
});

document.getElementById("highlightButton").addEventListener("click", () => {
    Array.from(productCards).forEach((card) => card.classList.toggle("highlighted"));
    showFeedback("Product cards highlighted.");
});

navigationButtons.forEach((button) => button.addEventListener("click", () => {
    navigationButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showFeedback(`${button.textContent} selected.`);
}));

const emailInput = document.getElementById("emailInput");
const typingHint = document.getElementById("typingHint");
emailInput.addEventListener("keydown", () => typingHint.textContent = "Key pressed. Keep typing...");
emailInput.addEventListener("keyup", () => typingHint.textContent = `${emailInput.value.length} characters entered.`);
emailInput.addEventListener("change", () => showFeedback("Email field updated."));
document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!emailInput.validity.valid) { showFeedback("Enter a valid email address."); return; }
    showFeedback(`Thanks! Updates will go to ${emailInput.value}.`);
    event.target.reset();
    typingHint.textContent = "Start typing your email.";
});

console.log(`ShopEase loaded with ${productCards.length} product cards and ${listItems.length} list items.`);