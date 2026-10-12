document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Function to toggle mobile menu
    function toggleMenu() {
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    }

    // Attach click handler to hamburger button
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== menuToggle) {
            navLinks.classList.remove('active');
        }
    });

    // Check Login State Across All Pages & Update Navbar
    const isLoggedIn = localStorage.getItem('campus_user_logged_in') === 'true';
    if (isLoggedIn && navLinks) {
        const isVendorPage = window.location.pathname.includes('owner-dashboard');

        if (isVendorPage) {
            // Vendor Portal Navbar
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="owner-dashboard.html?tab=owner-overview" class="active">Dashboard</a></li>
                <li><a href="login.html" onclick="handleLogout(event)" class="btn btn-outline" style="padding: 6px 14px;">Logout</a></li>
            `;
        } else {
            // Student / Public Portal Navbar
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="listings.html">Browse Hostels</a></li>
                <li><a href="index.html#features">Why Us</a></li>
                <li><a href="index.html#contact">Contact</a></li>
                <li><a href="student-dashboard.html" class="btn btn-outline" style="padding: 6px 14px;">My Dashboard</a></li>
                <li><a href="login.html" onclick="handleLogout(event)" class="btn btn-primary" style="padding: 6px 14px;">Logout</a></li>
            `;
        }
    }

    // Auto-close mobile drawer when any link inside navLinks is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
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