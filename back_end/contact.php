<?php
header('Content-Type: application/json');

// Read JSON input from fetch request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill out all fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Your destination email address
$to = 'support@hostelhunter.ac.ug'; // Replace with your actual email
$subject = "New Contact Inquiry from " . $name;
$emailBody = "You have received a new message from the HostelHunter contact form:\n\n";
$emailBody .= "Name: $name\n";
$emailBody .= "Email: $email\n\n";
$emailBody .= "Message:\n$message\n";

$headers = "From: no-reply@hostelhunter.ac.ug\r\n";
$headers .= "Reply-To: $email\r\n";


$mailSent = @mail($to, $subject, $emailBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
]);