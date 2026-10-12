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
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Ensure Apache & MySQL are running in XAMPP.[span_0](start_span)[span_0](end_span)']);
    exit;
}

// Read JSON input from fetch request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST; // Fallback for standard form submissions[span_1](start_span)[span_1](end_span)
}

$email       = trim($data['email'] ?? '');
$password    = trim($data['password'] ?? '');
$accountType = trim($data['account_type'] ?? 'student');

// Basic Validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in both email and password fields.[span_2](start_span)[span_2](end_span)']);
    exit;
}

// Fetch user record by email and account type[span_3](start_span)[span_3](end_span)
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND account_type = ?');
$stmt->execute([$email, $accountType]);
$userRecord = $stmt->fetch();

// Verify password against hashed record[span_4](start_span)[span_4](end_span)
if ($userRecord && password_verify($password, $userRecord['password'])) {
    // Save session parameters[span_5](start_span)[span_5](end_span)
    $_SESSION['user_logged_in'] = true;
    $_SESSION['user_id']        = $userRecord['id'];
    $_SESSION['user_email']     = $userRecord['email'];
    $_SESSION['user_name']      = $userRecord['full_name'];
    $_SESSION['account_type']   = $userRecord['account_type'];

    // Route based on role (stepping up two folders to root dashboards)[span_6](start_span)[span_6](end_span)
    $redirectUrl = ($accountType === 'vendor') ? 'owner-dashboard.html' : 'student-dashboard.html';

    echo json_encode([
        'success'      => true,
        'message'      => 'Login successful[span_7](start_span)[span_7](end_span)!',
        'account_type' => $accountType,
        'user_name'    => $userRecord['full_name'],
        'redirect'     => $redirectUrl
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email address, password, or account role selection.[span_8](start_span)[span_8](end_span)']);
}