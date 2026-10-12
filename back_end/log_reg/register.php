<?php
session_start();
header('Content-Type: application/json');

// XAMPP Database Connection Configuration
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
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP[span_0](start_span)[span_0](end_span).']);
    exit;
}

// Read JSON input from fetch POST request
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST; // Fallback for standard form posts[span_1](start_span)[span_1](end_span)
}

$fullName    = trim($data['full_name'] ?? '');
$email       = trim($data['email'] ?? '');
$password    = trim($data['password'] ?? '');
$accountType = trim($data['account_type'] ?? 'student');

// Validation checks
if (empty($fullName) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields[span_2](start_span)[span_2](end_span).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address format[span_3](start_span)[span_3](end_span).']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long[span_4](start_span)[span_4](end_span).']);
    exit;
}

// Check if email already exists[span_5](start_span)[span_5](end_span)
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'An account with this email address already exists[span_6](start_span)[span_6](end_span).']);
    exit;
}

// Hash password securely[span_7](start_span)[span_7](end_span)
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new user into database[span_8](start_span)[span_8](end_span)
$insertStmt = $pdo->prepare('INSERT INTO users (full_name, email, password, account_type) VALUES (?, ?, ?, ?)');
$inserted = $insertStmt->execute([$fullName, $email, $hashedPassword, $accountType]);

if ($inserted) {
    // Set active PHP session[span_9](start_span)[span_9](end_span)
    $_SESSION['user_logged_in'] = true;
    $_SESSION['user_id']        = $pdo->lastInsertId();
    $_SESSION['user_email']     = $email;
    $_SESSION['user_name']      = $fullName;
    $_SESSION['account_type']   = $accountType;

    // Direct redirection paths back to root dashboards
    $redirectUrl = ($accountType === 'vendor') ? 'owner-dashboard.html' : 'student-dashboard.html';

    echo json_encode([
        'success'      => true,
        'message'      => 'Account created successfully[span_10](start_span)[span_10](end_span)!',
        'account_type' => $accountType,
        'redirect'     => $redirectUrl
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register account. Please try again[span_11](start_span)[span_11](end_span).']);
}