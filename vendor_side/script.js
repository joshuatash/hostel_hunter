document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Check Login State Across All Pages & Update Navbar
    const isLoggedIn = localStorage.getItem('campus_user_logged_in') === 'true';
    if (isLoggedIn && navLinks) {
        const isVendorPage = window.location.pathname.includes('owner-dashboard');

        if (isVendorPage) {
            // Vendor Portal Navbar (Only Home, Vendor Dashboard, Logout)
            navLinks.innerHTML = `
                <li><a href="../index.html">Home</a></li>
                <li><a href="owner-dashboard.html?tab=owner-overview" class="active">Vendor Dashboard</a></li>
                <li><a href="../Student_side/login.html" onclick="handleLogout(event)" class="btn btn-outline" style="padding: 6px 14px;">Logout</a></li>
            `;
        } else {
            // Student / Public Portal Navbar
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
    const tab = urlParams.get('tab');
    if (tab) {
        const targetLink = document.getElementById(`nav-${tab}`);
        const targetSection = document.getElementById(tab);
        if (targetLink && targetSection) {
            document.querySelectorAll('.dashboard-nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            targetLink.classList.add('active');
            targetSection.classList.add('active');
        }
    }
});