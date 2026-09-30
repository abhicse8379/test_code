// ============================================
// 1. setTimeout()
// ============================================

setTimeout(function () {

    document.getElementById("offer").innerHTML =
        "🎉 Special Offer: Get 20% OFF on selected travel packages!";

}, 3000);


// ============================================
// 2. setInterval()
// ============================================

const offers = [
    "🎉 Get 20% OFF on selected packages!",
    "✈️ Free airport transfer on international packages!",
    "🏨 Book now and get complimentary hotel upgrades!",
    "🌍 Explore the world with WanderGo!"
];

let offerIndex = 0;

setInterval(function () {

    offerIndex++;

    if (offerIndex >= offers.length) {
        offerIndex = 0;
    }

    document.getElementById("offer").innerHTML =
        offers[offerIndex];

}, 5000);


// ============================================
// 3. CALLBACK FUNCTION
// ============================================

function authenticateUser(callback) {

    console.log("Authenticating user...");

    setTimeout(function () {

        console.log("User authentication completed.");

        callback();

    }, 1500);
}


function loadUserPreferences() {

    console.log("Loading user preferences...");

    const destination =
        localStorage.getItem("destination");

    if (destination) {

        document.getElementById("destination").value =
            destination;

        document.getElementById("savedMessage").innerHTML =
            "Previously selected destination: " + destination;
    }

    console.log("Preferences loaded.");
}


// Execute asynchronous operations in sequence

function startJourney() {

    document.getElementById("welcome").innerHTML =
        "Starting your journey...";

    authenticateUser(function () {

        loadUserPreferences();

        document.getElementById("welcome").innerHTML =
            "Welcome to WanderGo! Your journey is ready.";

    });
}


// ============================================
// 4. FETCH API
// ============================================

async function loadPackages() {

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("packageContainer");

    const error =
        document.getElementById("error");

    try {

        loading.style.display = "block";
        error.innerHTML = "";

        const response =
            await fetch("packages.json");

        if (!response.ok) {
            throw new Error(
                "Unable to retrieve package information."
            );
        }

        const packages =
            await response.json();

        displayPackages(packages);

    }
    catch (err) {

        error.innerHTML =
            "❌ Error: " + err.message;

    }
    finally {

        loading.style.display = "none";

    }
}


// ============================================
// 5. DISPLAY JSON DATA
// ============================================

function displayPackages(packages) {

    const container =
        document.getElementById("packageContainer");

    container.innerHTML = "";

    packages.forEach(function (pkg) {

        const card =
            document.createElement("div");

        card.className = "package";

        card.innerHTML = `
            <h3>${pkg.destination}</h3>

            <p>
                <strong>Duration:</strong>
                ${pkg.duration}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${pkg.price.toLocaleString("en-IN")}
            </p>

            <p>
                ${pkg.description}
            </p>

            <button onclick="selectDestination('${pkg.destination}')">
                Select Destination
            </button>
        `;

        container.appendChild(card);

    });
}


// ============================================
// 6. LOCAL STORAGE
// ============================================

function savePreference() {

    const destination =
        document.getElementById("destination").value;

    if (destination === "") {

        alert("Please select a destination.");

        return;
    }

    localStorage.setItem(
        "destination",
        destination
    );

    document.getElementById("savedMessage").innerHTML =
        "✅ Preference saved: " + destination;
}


// Select destination from package card

function selectDestination(destination) {

    document.getElementById("destination").value =
        destination;

    localStorage.setItem(
        "destination",
        destination
    );

    document.getElementById("savedMessage").innerHTML =
        "✅ " + destination +
        " has been saved as your preferred destination.";

}


// ============================================
// 7. SESSION STORAGE
// ============================================

function initializeSession() {

    let visitCount =
        sessionStorage.getItem("visitCount");

    if (visitCount === null) {

        visitCount = 1;

    } else {

        visitCount =
            parseInt(visitCount) + 1;
    }

    sessionStorage.setItem(
        "visitCount",
        visitCount
    );

    document.getElementById("sessionInfo").innerHTML =
        "Current browser session visit count: " +
        visitCount;
}


// ============================================
// 8. THEME USING LOCAL STORAGE
// ============================================

const themeButton =
    document.getElementById("themeBtn");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

});


// Retrieve saved theme

function loadTheme() {

    const theme =
        localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

}


// ============================================
// 9. PAGE INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    loadPackages();

    loadTheme();

    loadUserPreferences();

    initializeSession();

});