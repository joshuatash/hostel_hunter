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
        <li><a href="owner-dashboard.html?tab=owner-overview" class="active">Vendor Dashboard</a></li>
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

// Handle Login Form Submission
function handleLogin(event) {
  event.preventDefault();

  const accountType = document.getElementById("accountType").value;
  localStorage.setItem("campus_user_logged_in", "true");
  localStorage.setItem("campus_account_type", accountType);

  if (accountType === "vendor") {
    window.location.href = "owner-dashboard.html";
  } else {
    window.location.href = "student-dashboard.html";
  }
}

// Handle Logout
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("campus_user_logged_in");
  localStorage.removeItem("campus_account_type");
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
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending Message...";
  alertBox.style.display = "none";

  // Using FormData guarantees ALL inputs are included in the email payload
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
      // Display green checkmark alert box
      alertBox.style.display = "flex";
      alertBox.style.background = "#dcfce7";
      alertBox.style.border = "1px solid #86efac";
      alertBox.style.color = "#15803d";
      alertBox.innerHTML = `
        <span style="font-size: 1.2rem; font-weight: bold;">&#10004;</span>
        <span>Message sent successfully! We will get back to you shortly.</span>
      `;
      form.reset();
    } else {
      throw new Error(result.message || "Form submission returned an error.");
    }
  } catch (error) {
    console.error("FormSubmit Error:", error);
    alertBox.style.display = "flex";
    alertBox.style.background = "#fef2f2";
    alertBox.style.border = "1px solid #fecaca";
    alertBox.style.color = "#b91c1c";
    alertBox.innerHTML = `
      <span style="font-size: 1.2rem; font-weight: bold;">&#10008;</span>
      <span>Unable to send message. Please try again.</span>
    `;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
}
// Register Service Worker for PWA Installation
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => {
        console.log("Service Worker registered successfully:", reg.scope);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}