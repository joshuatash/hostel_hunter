<?php
session_start();
header('Content-Type: application/json');

// XAMPP Database Connection
$host = 'localhost';
$db   = 'campushostels_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP.']);
    exit;
}

// Read JSON input from fetch POST request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST; // Fallback for standard form posts
}

$fullName    = trim($data['full_name'] ?? '');
$email       = trim($data['email'] ?? '');
$password    = trim($data['password'] ?? '');
$accountType = trim($data['account_type'] ?? 'student');

// Validation checks
if (empty($fullName) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address format.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'An account with this email address already exists.']);
    exit;
}

// Hash password securely
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new user into database
$insertStmt = $pdo->prepare('INSERT INTO users (full_name, email, password, account_type) VALUES (?, ?, ?, ?)');
$inserted = $insertStmt->execute([$fullName, $email, $hashedPassword, $accountType]);

if ($inserted) {
    // Set active PHP session
    $_SESSION['user_logged_in'] = true;
    $_SESSION['user_email']     = $email;
    $_SESSION['user_name']      = $fullName;
    $_SESSION['account_type']   = $accountType;

    $redirectUrl = ($accountType === 'vendor') ? 'owner-dashboard.html' : 'student-dashboard.html';

    echo json_encode([
        'success'      => true,
        'message'      => 'Account created successfully!',
        'account_type' => $accountType,
        'redirect'     => $redirectUrl
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register account. Please try again.']);
}