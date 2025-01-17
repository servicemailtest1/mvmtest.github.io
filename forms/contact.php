<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

// CORS sorunlarını önlemek için başlık ekleyin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Gelen POST verilerini alın
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo 'Error: Form verileri eksik.';
    exit;
}

// SMTP ayarları
$smtpHost = 'smtp.gmail.com';
$smtpPort = 465;
$smtpUsername = 'servicemailtest1@gmail.com';
$smtpPassword = 'iqgs kvvh vorv ucmn';
$smtpSsl = true;

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = $smtpPort;

    // Gönderen bilgisi
    $mail->setFrom($smtpUsername, 'MVM');
    $mail->addAddress($smtpUsername); // Alıcı adresi

    // E-posta içeriği
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = "
        <html>
        <head><style>body { font-family: Arial; }</style></head>
        <body>
            <h1>$subject</h1>
            <p>$message</p>
            <p><strong>Gönderen:</strong> $name</p>
            <p><strong>Gönderen E-posta:</strong> $email</p>
        </body>
        </html>
    ";

    $mail->send();
    echo 'OK'; // Başarılı yanıt
} catch (Exception $e) {
    echo 'Error: ' . htmlspecialchars($mail->ErrorInfo);
}
?>
