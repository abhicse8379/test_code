const form = document.getElementById("registrationForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const dob = document.getElementById("dob");
const bloodGroup = document.getElementById("bloodGroup");
const address = document.getElementById("address");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const documentFile = document.getElementById("document");
const terms = document.getElementById("terms");

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

function clearErrors() {
    document.querySelectorAll(".error").forEach(function(error) {
        error.textContent = "";
    });

    document.getElementById("successMessage").textContent = "";
}

password.addEventListener("input", function() {
    const value = password.value;
    const strengthText = document.getElementById("passwordStrength");

    if (value.length === 0) {
        strengthText.textContent = "";
        return;
    }

    let strength = 0;

    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[@$!%*?&]/.test(value)) strength++;

    if (strength <= 2) {
        strengthText.textContent = "Password Strength: Weak";
        strengthText.style.color = "red";
    } else if (strength <= 4) {
        strengthText.textContent = "Password Strength: Medium";
        strengthText.style.color = "orange";
    } else {
        strengthText.textContent = "Password Strength: Strong";
        strengthText.style.color = "green";
    }
});

form.addEventListener("submit", function(event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;
    fullName.value = fullName.value.trim();
    email.value = email.value.trim();
    mobile.value = mobile.value.trim();
    address.value = address.value.trim();

    if (fullName.value === "") {
        document.getElementById("nameError").textContent = "Full name is required.";
        isValid = false;
    } else if (!nameRegex.test(fullName.value)) {
        document.getElementById("nameError").textContent = "Name should contain only letters and single spaces.";
        isValid = false;
    }

    if (email.value === "") {
        document.getElementById("emailError").textContent = "Email address is required.";
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if (mobile.value === "") {
        document.getElementById("mobileError").textContent = "Mobile number is required.";
        isValid = false;
    } else if (!mobileRegex.test(mobile.value)) {
        document.getElementById("mobileError").textContent = "Enter a valid 10-digit Indian mobile number.";
        isValid = false;
    }

    if (dob.value === "") {
        document.getElementById("dobError").textContent = "Date of birth is required.";
        isValid = false;
    } else if (new Date(dob.value) > new Date()) {
        document.getElementById("dobError").textContent = "Date of birth cannot be in the future.";
        isValid = false;
    }

    if (!document.querySelector('input[name="gender"]:checked')) {
        document.getElementById("genderError").textContent = "Please select your gender.";
        isValid = false;
    }

    if (bloodGroup.value === "") {
        document.getElementById("bloodError").textContent = "Please select your blood group.";
        isValid = false;
    }

    if (address.value === "") {
        document.getElementById("addressError").textContent = "Address is required.";
        isValid = false;
    } else if (address.value.length < 10) {
        document.getElementById("addressError").textContent = "Address must contain at least 10 characters.";
        isValid = false;
    }

    if (password.value === "") {
        document.getElementById("passwordError").textContent = "Password is required.";
        isValid = false;
    } else if (!passwordRegex.test(password.value)) {
        document.getElementById("passwordError").textContent = "Password must contain 8-30 characters, including uppercase, lowercase, number and special character.";
        isValid = false;
    }

    if (confirmPassword.value === "") {
        document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        isValid = false;
    }

    if (documentFile.files.length > 0) {
        const allowedExtensions = ["image/jpeg", "image/png", "application/pdf"];
        const selectedFile = documentFile.files[0];

        if (!allowedExtensions.includes(selectedFile.type)) {
            document.getElementById("fileError").textContent = "Only JPG, PNG, and PDF files are allowed.";
            isValid = false;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            document.getElementById("fileError").textContent = "File size must not exceed 5 MB.";
            isValid = false;
        }
    }

    if (!terms.checked) {
        document.getElementById("termsError").textContent = "You must confirm the information before registration.";
        isValid = false;
    }

    if (isValid) {
        document.getElementById("successMessage").textContent = "Patient registration completed successfully!";
    }
});
