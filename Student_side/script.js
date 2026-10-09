document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Check Login State Across All Student Pages & Update Navbar
  const isLoggedIn = localStorage.getItem("campus_user_logged_in") === "true";
  const accountType = localStorage.getItem("campus_account_type");

  if (isLoggedIn && navLinks) {
    if (accountType === "vendor") {
      navLinks.innerHTML = `
        <li><a href="../index.html">Home</a></li>
        <li><a href="../vendor_side/owner-dashboard.html?tab=owner-overview" class="active">Vendor Dashboard</a></li>
        <li><a href="#" onclick="handleLogout(event)" class="btn btn-outline" style="padding: 6px 14px;">Logout</a></li>
      `;
    } else {
      navLinks.innerHTML = `
        <li><a href="../index.html">Home</a></li>
        <li><a href="../Student_side/listings.html">Browse Hostels</a></li>
        <li><a href="../index.html#features">Why Us</a></li>
        <li><a href="../index.html#contact">Contact</a></li>
        <li><a href="../Student_side/student-dashboard.html" class="btn btn-outline" style="padding: 6px 14px;">My Dashboard</a></li>
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

// Handle Login Form Submission with Account Type routing
function handleLogin(event) {
  event.preventDefault();

  const accountType = document.getElementById("accountType").value;
  localStorage.setItem("campus_user_logged_in", "true");
  localStorage.setItem("campus_account_type", accountType);

  if (accountType === "vendor") {
    window.location.href = "../vendor_side/owner-dashboard.html";
  } else {
    window.location.href = "student-dashboard.html";
  }
}

// Handle Logout
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("campus_user_logged_in");
  localStorage.removeItem("campus_account_type");
  window.location.href = "../index.html";
}

// Dashboard Tab Switcher
function switchTab(event, tabId) {
  event.preventDefault();

  // Remove active state from all nav links
  const navLinks = document.querySelectorAll(".dashboard-nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  // Add active state to clicked link
  event.currentTarget.classList.add("active");

  // Hide all sections
  const sections = document.querySelectorAll(".dashboard-section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show target section
  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update URL without reloading page
  window.history.pushState({}, "", `student-dashboard.html?tab=${tabId}`);
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

// Payment Method Selector Toggle (Used on booking.html)
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

// Handle Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();
  alert(
    "Thank you for reaching out! Your message has been sent successfully. We will get back to you shortly.",
  );
  event.target.reset();
}