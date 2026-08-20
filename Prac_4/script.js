    /* =========================================
    1. DOM ACCESS METHODS
    ========================================= */
    // getElementById()
    const storeTitle =
        document.getElementById("storeTitle");
    const themeBtn =
        document.getElementById("themeBtn");
    const cartCount =
        document.getElementById("cartCount");
    const searchInput =
        document.getElementById("searchInput");
    // getElementsByClassName()
    const productCards =
        document.getElementsByClassName("product-card");
    // getElementsByTagName()
    const navigationItems =
        document.getElementsByTagName("li");
    // querySelector()
    const welcomeText =
        document.querySelector(".hero h2");
    // querySelectorAll()
    const addCartButtons =
        document.querySelectorAll(".addCart");


    /* =========================================
    2. CLICK EVENT – THEME SWITCHING
    ========================================= */
    let darkMode = false;
    themeBtn.addEventListener("click", function () {
        darkMode = !darkMode;
        document.body.classList.toggle("dark");
        if (darkMode) {
            themeBtn.textContent = "Light Mode";
            welcomeText.textContent =
                "Welcome to ShopEase – Dark Mode";
        } else {
            themeBtn.textContent = "Dark Mode";
            welcomeText.textContent =
                "Welcome to ShopEase";
        }
    });


    /* =========================================
    3. CLICK EVENT – ADD TO CART
    ========================================= */
    let cart = 0;
    addCartButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            cart++;
            cartCount.textContent = cart;   
            button.textContent = "Added ✓";
            button.style.backgroundColor = "green";
            setTimeout(function() {
                button.textContent = "Add to Cart";
                button.style.backgroundColor =
                    "#2878f0";
            }, 1000);
        });
    });


    /* =========================================
    4. MOUSEOVER AND MOUSEOUT EVENTS
    ========================================= */

    for (let i = 0; i < productCards.length; i++) {
        productCards[i].addEventListener(
            "mouseover",
            function() {
                this.classList.add("highlight");
                this.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.25)";
            }
        );
        productCards[i].addEventListener(
            "mouseout",
            function() {
                this.classList.remove("highlight");
                this.style.boxShadow =
                    "0 3px 12px rgba(0,0,0,0.12)";
            }
        );
    }


    /* =========================================
    5. DOUBLE CLICK EVENT
    ========================================= */

    storeTitle.addEventListener(
        "dblclick",
        function() {
            storeTitle.textContent =
                "ShopEase Online Store 🛒";
            storeTitle.style.color =
                "yellow";
        }
    );


    /* =========================================
    6. KEYDOWN EVENT
    ========================================= */

    searchInput.addEventListener(
        "keydown",
        function(event) {
            if (event.key === "Enter") {
                document.getElementById(
                    "searchMessage"
                ).textContent =
                    "Searching for: " +
                    searchInput.value;
            }
        }
    );


    /* =========================================
    7. KEYUP EVENT – LIVE SEARCH
    ========================================= */

    searchInput.addEventListener(
        "keyup",
        function() {

            const searchValue =
                searchInput.value.toLowerCase();

            let visibleProducts = 0;

            for (let i = 0;
                i < productCards.length;
                i++) {

                const productName =
                    productCards[i]
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();

                if (productName.includes(searchValue)) {

                    productCards[i].style.display =
                        "block";

                    visibleProducts++;

                } else {

                    productCards[i].style.display =
                        "none";
                }

            }


            const message =
                document.getElementById(
                    "searchMessage"
                );

            if (searchValue === "") {

                message.textContent = "";

            } else {

                message.textContent =
                    visibleProducts +
                    " product(s) found";

            }

        }
    );


    /* =========================================
       8. CHANGE EVENT
    ========================================= */

    const category =
        document.getElementById("category");

    category.addEventListener(
        "change",
        function() {

            const formMessage =
                document.getElementById(
                    "formMessage"
                );

            if (this.value !== "") {

                formMessage.textContent =
                    "You selected: " +
                    this.options[
                        this.selectedIndex
                    ].text;

                formMessage.style.color =
                    "#2878f0";

            }

        }
    );


    /* =========================================
       9. FORM SUBMISSION
    ========================================= */

    const feedbackForm =
        document.getElementById("feedbackForm");

    feedbackForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const selectedCategory =
                category.value;

            const message =
                document.getElementById(
                    "formMessage"
                );


            if (
                name === "" ||
                email === "" ||
                selectedCategory === ""
            ) {

                message.textContent =
                    "Please complete all fields.";

                message.style.color = "red";

                return;
            }


            message.textContent =
                "Thank you, " +
                name +
                "! Your feedback has been submitted successfully.";

            message.style.color = "green";

            feedbackForm.reset();

        }
    );


    /* =========================================
       10. IMAGE PREVIEW
    ========================================= */

    const productImages =
        document.querySelectorAll(
            ".product-card img"
        );

    const imagePreview =
        document.getElementById(
            "imagePreview"
        );

    const previewImage =
        document.getElementById(
            "previewImage"
        );

    const closePreview =
        document.getElementById(
            "closePreview"
        );


    productImages.forEach(function(image) {

        image.addEventListener(
            "click",
            function() {

                previewImage.src =
                    this.src;

                imagePreview.style.display =
                    "flex";

            }
        );

    });


    closePreview.addEventListener(
        "click",
        function() {

            imagePreview.style.display =
                "none";

        }
    );


    /* =========================================
       11. DYNAMIC MENU
    ========================================= */

    const menuBtn =
        document.getElementById("menuBtn");

    const menuItems =
        document.getElementById("menuItems");

    menuBtn.addEventListener(
        "click",
        function() {

            if (
                menuItems.style.display ===
                "block"
            ) {

                menuItems.style.display =
                    "none";

                menuBtn.textContent =
                    "☰ Show Menu";

            } else {

                menuItems.style.display =
                    "block";

                menuBtn.textContent =
                    "✕ Hide Menu";

            }

        }
    );


    /* =========================================
       12. DYNAMIC ELEMENT CREATION
    ========================================= */

    const productContainer =
        document.getElementById(
            "productContainer"
        );


    const newProduct =
        document.createElement("div");

    newProduct.className =
        "product-card";

    newProduct.innerHTML = `

        <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
            alt="Laptop"
        >

        <h3>Premium Laptop</h3>

        <p class="price">₹49,999</p>

        <button class="addCart">
            Add to Cart
        </button>

    `;

    productContainer.appendChild(
        newProduct
    );


    /* =========================================
       13. DYNAMIC ELEMENT REPLACEMENT
    ========================================= */

    const description =
        document.getElementById(
            "description"
        );

    const replacementText =
        document.createElement("span");

    replacementText.textContent =
        "Enjoy a smarter and faster shopping experience!";

    description.replaceChildren(
        replacementText
    );


    /* =========================================
       14. DYNAMIC ELEMENT REMOVAL
    ========================================= */

    // Demonstration of remove()

    const temporaryMessage =
        document.createElement("p");

    temporaryMessage.textContent =
        "Temporary promotional message";

    temporaryMessage.id =
        "temporaryMessage";

    document.querySelector(".hero")
        .appendChild(temporaryMessage);


    setTimeout(function() {

        temporaryMessage.remove();

    }, 5000);


    /* =========================================
       15. NAVIGATION EVENTS
    ========================================= */

    for (
        let i = 0;
        i < navigationItems.length;
        i++
    ) {

        navigationItems[i].addEventListener(
            "click",
            function() {

                alert(
                    "You selected: " +
                    this.textContent
                );

            }
        );

    }


    /* =========================================
       16. DYNAMIC ATTRIBUTE MODIFICATION
    ========================================= */

    storeTitle.setAttribute(
        "title",
        "ShopEase Online Shopping"
    );


    /* =========================================
       17. DOM STYLE MANIPULATION
    ========================================= */

    welcomeText.style.letterSpacing =
        "1px";