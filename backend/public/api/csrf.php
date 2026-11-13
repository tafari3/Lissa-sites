<?php
declare(strict_types=1);
try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        header('Allow: GET');
        http_response_code(405); exit;
    }
    $privateDir = getenv('SERINA_PRIVATE_DIR');
    if (!$privateDir || !is_file($privateDir . '/contact-lib.php')) throw new RuntimeException('Missing application configuration');
    require $privateDir . '/contact-lib.php';
    $privateDir = serina_private_dir();
    if (serina_env('SERINA_MAIL_READY') !== '1') throw new RuntimeException('Mail not commissioned');
    serina_session($privateDir);
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_time'] = time();
    session_write_close();
    serina_response(200, ['token' => $_SESSION['csrf_token'], 'expiresIn' => 900]);
} catch (Throwable $e) {
    error_log('Serina CSRF: unable to issue token');
    header('Cache-Control: no-store');
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo '{"error":"Enquiries are temporarily unavailable. Please use WhatsApp or telephone."}';
}
