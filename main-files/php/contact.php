<?php
// Set response headers for AJAX JSON submission
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Configuration: Change this email to the buyer's target email address
$recipient_email = "your-email@domain.com"; // <-- Replace this with your actual email address
$email_subject_prefix = "[AuraAI Template Inquiry]";

// Input Sanitization
$name    = filter_var(trim($_POST['name'] ?? ''), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = filter_var(trim($_POST['subject'] ?? 'New Contact Form Submission'), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$topic   = filter_var(trim($_POST['inquiry_type'] ?? 'General'), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_var(trim($_POST['message'] ?? ''), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Validation Check
if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields with a valid email address.']);
    exit;
}

// Construct Email Headers & Content
$email_subject = "$email_subject_prefix " . ucfirst($topic) . ": " . $subject;

$email_content  = "You have received a new message from your template contact form:\n\n";
$email_content .= "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Topic: " . ucfirst($topic) . "\n";
$email_content .= "Subject: $subject\n\n";
$email_content .= "Message:\n$message\n";

$headers  = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send Mail Process
if (@mail($recipient_email, $email_subject, $email_content, $headers)) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Thank you! Your message has been sent successfully. We will get back to you shortly.'
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Unable to send message due to a server configuration issue. Please contact support.'
    ]);
}
?>