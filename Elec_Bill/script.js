const billForm = document.getElementById("billForm");
billForm.addEventListener("submit", function (event) {
    // Prevent page reload
    event.preventDefault();
    // Read values using DOM methods
    const name = document.getElementById("consumerName").value.trim();
    const number = document.getElementById("consumerNumber").value.trim();
    const units = Number(document.getElementById("units").value);
    const error = document.getElementById("error");
    // Validation
    if (name === "") {
        error.textContent = "Please enter consumer name.";
        return;
    }
    if (number === "") {
        error.textContent = "Please enter consumer number.";
        return;
    }
    if (units < 0 || isNaN(units)) {
        error.textContent = "Units consumed cannot be negative.";
        return;
    }
    // Clear error
    error.textContent = "";
    // Slab-wise energy charge
    let energyCharge = 0;
    if (units <= 100) {
        energyCharge = units * 2;
    } else if (units <= 200) {
        energyCharge = (100 * 2) + ((units - 100) * 3);
    } else {
        energyCharge = (100 * 2) + (100 * 3) + ((units - 200) * 5);
    }
    // Fixed service charges
    const serviceCharge = 50;
    // Total bill
    const totalBill = energyCharge + serviceCharge;
    // Display result dynamically
    document.getElementById("displayName").textContent = name;
    document.getElementById("displayNumber").textContent = number;
    document.getElementById("displayUnits").textContent = units;
    document.getElementById("energyCharge").textContent =
        energyCharge.toFixed(2);
    document.getElementById("serviceCharge").textContent =
        serviceCharge.toFixed(2);
    document.getElementById("totalBill").textContent =
        totalBill.toFixed(2);
});