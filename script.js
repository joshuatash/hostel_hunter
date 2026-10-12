document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Check Login State Across All Pages & Update Navbar
  const isLoggedIn = localStorage.getItem("campus_user_logged_in") === "true";
  const accountType = localStorage.getItem("campus_account_type");

  if (isLoggedIn && navLinks) {
    const isVendorPage = window.location.pathname.includes("owner-dashboard");

    if (isVendorPage || accountType === "vendor") {
      navLinks.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="owner-dashboard.html?tab=owner-overview" class="active">Dashboard</a></li>
        <li><a href="#" onclick="handleLogout(event)" class="btn btn-outline" style="padding: 6px 14px;">Logout</a></li>
      `;
    } else {
      navLinks.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="listings.html">Browse Hostels</a></li>
        <li><a href="index.html#features">Why Us</a></li>
        <li><a href="index.html#contact">Contact</a></li>
        <li><a href="student-dashboard.html" class="btn btn-outline" style="padding: 6px 14px;">My Dashboard</a></li>
        <li><a href="#" onclick="handleLogout(event)" class="btn btn-primary" style="padding: 6px 14px;">Logout</a></li>
      `;
    }
  }

  // Restore Dashboard Tab from URL Parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");
  if (tab) {
    const targetLink = document.getElementById(`nav-${tab}`);
    const targetSection = document.getElementById(tab);
    if (targetLink && targetSection) {
      document
        .querySelectorAll(".dashboard-nav-link")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(".dashboard-section")
        .forEach((s) => s.classList.remove("active"));
      targetLink.classList.add("active");
      targetSection.classList.add("active");
    }
  }
});

// Toggle Password Visibility Feature for Login
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("loginPassword");
  const toggleBtn = document.getElementById("togglePasswordBtn");

  if (passwordInput && toggleBtn) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      toggleBtn.textContent = "Show";
    }
  }
}

// Toggle Password Visibility Feature for Register
function toggleRegisterPassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("toggleRegisterPasswordBtn");

  if (passwordInput && toggleBtn) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      toggleBtn.textContent = "Show";
    }
  }
}

// Handle Database-Connected Login Submission via AJAX Fetch
async function handleLogin(event) {
  event.preventDefault();

  const alertBox =
    document.getElementById("loginAlert") ||
    document.getElementById("errorMessage");
  const loginBtn = document.getElementById("loginBtn");
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const accountType = document.getElementById("accountType").value;

  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
  }
  if (alertBox) alertBox.style.display = "none";

  try {
    const response = await fetch("./back_end/log_reg/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        account_type: accountType,
      }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("campus_user_logged_in", "true");
      localStorage.setItem("campus_account_type", result.account_type);
      localStorage.setItem("campus_user_name", result.user_name);

      if (alertBox) {
        alertBox.style.display = "block";
        alertBox.style.background = "#dcfce7";
        alertBox.style.border = "1px solid #86efac";
        alertBox.style.color = "#15803d";
        alertBox.textContent = "Login successful! Redirecting...";
      }

      setTimeout(() => {
        window.location.href = result.redirect;
      }, 800);
    } else {
      throw new Error(result.message || "Invalid credentials.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    if (alertBox) {
      alertBox.style.display = "block";
      alertBox.style.background = "#fef2f2";
      alertBox.style.border = "1px solid #fecaca";
      alertBox.style.color = "#b91c1c";
      alertBox.textContent =
        error.message ||
        "Connection error. Make sure XAMPP Apache & MySQL are running.";
    }
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login to Portal";
    }
  }
}

// Handle Database-Connected Registration Submission via AJAX Fetch
async function handleRegister(event) {
  event.preventDefault();

  const errorBox = document.getElementById("errorMessage");
  const registerBtn = document.getElementById("registerBtn");

  if (errorBox) errorBox.style.display = "none";
  if (registerBtn) {
    registerBtn.disabled = true;
    registerBtn.textContent = "Creating Account...";
  }

  const accountType = document.getElementById("accountType").value;
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("./back_end/log_reg/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        account_type: accountType,
      }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("campus_user_logged_in", "true");
      localStorage.setItem("campus_account_type", result.account_type);
      localStorage.setItem("campus_user_name", fullName);

      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.style.background = "#dcfce7";
        errorBox.style.border = "1px solid #86efac";
        errorBox.style.color = "#15803d";
        errorBox.textContent = "Account created successfully! Redirecting...";
      }

      setTimeout(() => {
        window.location.href = result.redirect;
      }, 800);
    } else {
      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.style.background = "#fef2f2";
        errorBox.style.border = "1px solid #fecaca";
        errorBox.style.color = "#dc2626";
        errorBox.textContent =
          result.message || "Registration failed. Please check your details.";
      }
      if (registerBtn) {
        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";
      }
    }
  } catch (error) {
    console.error("Registration Error:", error);
    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.style.background = "#fef2f2";
      errorBox.style.border = "1px solid #fecaca";
      errorBox.style.color = "#dc2626";
      errorBox.textContent =
        "Unable to connect to the server. Please ensure Server is running!";
    }
    if (registerBtn) {
      registerBtn.disabled = false;
      registerBtn.textContent = "Create Account";
    }
  }
}

// Handle Logout
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("campus_user_logged_in");
  localStorage.removeItem("campus_account_type");
  localStorage.removeItem("campus_user_name");
  window.location.href = "index.html";
}

// Dashboard Tab Switcher
function switchTab(event, tabId) {
  event.preventDefault();

  const navLinks = document.querySelectorAll(".dashboard-nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  event.currentTarget.classList.add("active");

  const sections = document.querySelectorAll(".dashboard-section");
  sections.forEach((section) => section.classList.remove("active"));

  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  window.history.pushState({}, "", `${currentPage}?tab=${tabId}`);
}

// Handle Settings Form Submission
function handleSettingsUpdate(event) {
  event.preventDefault();
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.add("active");
  }
}

// Close Modal Popup
function closeModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Payment Method Selector Toggle
function togglePaymentForm(method) {
  const options = document.querySelectorAll(".payment-card-option");
  options.forEach((opt) => opt.classList.remove("selected"));

  const momoBox = document.getElementById("mobile-money-box");
  const bankBox = document.getElementById("bank-box");

  if (method === "mtn" || method === "airtel") {
    const selectedOpt = document.getElementById(`opt-${method}`);
    if (selectedOpt) selectedOpt.classList.add("selected");
    if (momoBox) momoBox.classList.add("active");
    if (bankBox) bankBox.classList.remove("active");
  } else if (method === "bank") {
    const bankOpt = document.getElementById("opt-bank");
    if (bankOpt) bankOpt.classList.add("selected");
    if (bankBox) bankBox.classList.add("active");
    if (momoBox) momoBox.classList.remove("active");
  }
}

// Complete AJAX Submission for FormSubmit
async function handleAjaxContactSubmit(event) {
  event.preventDefault();

  const alertBox = document.getElementById("contactAlert");
  const submitBtn = document.getElementById("contactBtn");
  const form = document.getElementById("contactForm");

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending Message...";
  }
  if (alertBox) alertBox.style.display = "none";

  const formData = new FormData(form);

  try {
    const response = await fetch(
      "https://formsubmit.co/ajax/okutajoshuatash256@gmail.com",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      },
    );

    const result = await response.json();

    if (response.ok || result.success === "true" || result.success === true) {
      if (alertBox) {
        alertBox.style.display = "flex";
        alertBox.style.background = "#dcfce7";
        alertBox.style.border = "1px solid #86efac";
        alertBox.style.color = "#15803d";
        alertBox.innerHTML = `
          <span style="font-size: 1.2rem; font-weight: bold;">&#10004;</span>
          <span>Message sent successfully! We will get back to you shortly.</span>
        `;
      }
      if (form) form.reset();
    } else {
      throw new Error(result.message || "Form submission returned an error.");
    }
  } catch (error) {
    console.error("FormSubmit Error:", error);
    if (alertBox) {
      alertBox.style.display = "flex";
      alertBox.style.background = "#fef2f2";
      alertBox.style.border = "1px solid #fecaca";
      alertBox.style.color = "#b91c1c";
      alertBox.innerHTML = `
        <span style="font-size: 1.2rem; font-weight: bold;">&#10008;</span>
        <span>Unable to send message. Please try again.</span>
      `;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }
}

