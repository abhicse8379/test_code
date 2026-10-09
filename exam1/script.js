// Get Generate Bill button
const generateBill = document.getElementById("generateBill");


// Add click event
generateBill.addEventListener("click", function () {

    // Read quantities
    const notebook = Number(
        document.getElementById("notebook").value
    );

    const backpack = Number(
        document.getElementById("backpack").value
    );

    const headphones = Number(
        document.getElementById("headphones").value
    );


    const message = document.getElementById("message");
    const billDetails = document.getElementById("billDetails");


    // Validate quantities
    if (
        !Number.isInteger(notebook) ||
        !Number.isInteger(backpack) ||
        !Number.isInteger(headphones) ||
        notebook < 0 ||
        backpack < 0 ||
        headphones < 0
    ) {

        message.textContent =
            "Please enter valid non-negative whole numbers.";

        return;
    }


    // Calculate individual amounts

    const notebookAmount = notebook * 100;

    const backpackAmount = backpack * 800;

    const headphonesAmount = headphones * 1200;


    // Calculate subtotal

    const subtotal =
        notebookAmount +
        backpackAmount +
        headphonesAmount;


    // Check if no products selected

    if (subtotal === 0) {

        message.textContent =
            "Please select at least one product.";

        billDetails.innerHTML =
            "<p>No products selected.</p>";

        return;
    }


    // Clear error message

    message.textContent = "";


    // Calculate discount

    let discount = 0;

    if (subtotal >= 2000) {

        discount = subtotal * 0.10;

    }


    // Calculate final bill

    const finalAmount = subtotal - discount;


    // Display bill

    billDetails.innerHTML = `

        <div class="bill-row">
            <span>Notebook (${notebook})</span>
            <span>₹${notebookAmount.toFixed(2)}</span>
        </div>

        <div class="bill-row">
            <span>Backpack (${backpack})</span>
            <span>₹${backpackAmount.toFixed(2)}</span>
        </div>

        <div class="bill-row">
            <span>Headphones (${headphones})</span>
            <span>₹${headphonesAmount.toFixed(2)}</span>
        </div>

        <div class="bill-row">
            <strong>Subtotal</strong>
            <strong>₹${subtotal.toFixed(2)}</strong>
        </div>

        <div class="bill-row discount">
            <strong>Discount (10%)</strong>
            <strong>- ₹${discount.toFixed(2)}</strong>
        </div>

        <div class="final">
            <span>Final Payable Amount</span>
            <span>₹${finalAmount.toFixed(2)}</span>
        </div>

    `;

});