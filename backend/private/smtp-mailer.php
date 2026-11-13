<?php
// SMTP transport depends on the maintained PHPMailer package installed privately
// with Composer. No credentials, mailer library or private user data go in webroot.
declare(strict_types=1);
function serina_send_email(array $fields, string $privateDir): void {
    $autoload = $privateDir . '/vendor/autoload.php';
    if (!is_file($autoload)) throw new RuntimeException('SMTP dependency missing');
    require_once $autoload;
    $keys = ['SERINA_SMTP_HOST','SERINA_SMTP_PORT','SERINA_SMTP_USER','SERINA_SMTP_PASS','SERINA_MAIL_TO','SERINA_MAIL_FROM'];
    foreach ($keys as $key) if (serina_env($key) === '') throw new RuntimeException('SMTP configuration incomplete');
    $port = (int) serina_env('SERINA_SMTP_PORT');
    if ($port !== 465 && $port !== 587) throw new RuntimeException('SMTP port must be 465 or 587');
    $to = serina_env('SERINA_MAIL_TO');
    $from = serina_env('SERINA_MAIL_FROM');
    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('SMTP mail addresses invalid');
    }
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = serina_env('SERINA_SMTP_HOST');
    $mail->Port = $port;
    $mail->SMTPAuth = true;
    $mail->Username = serina_env('SERINA_SMTP_USER');
    $mail->Password = serina_env('SERINA_SMTP_PASS');
    $mail->SMTPSecure = $port === 465
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAutoTLS = true;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]];
    $mail->Timeout = 12;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($from, 'Serina Bhasera Website');
    $mail->addAddress($to);
    if ($fields['email'] !== '') $mail->addReplyTo($fields['email'], $fields['name']);
    $mail->isHTML(false);
    $mail->Subject = 'Website enquiry - ' . $fields['service'];
    $mail->Body = "General website enquiry (not a will intake)\n\n"
        . "Name: {$fields['name']}\nPhone: {$fields['phone']}\n"
        . "Email: {$fields['email']}\nService: {$fields['service']}\n"
        . "Location: {$fields['location']}\n\nMessage:\n{$fields['message']}\n";
    $mail->send();
}
