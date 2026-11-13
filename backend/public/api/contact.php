<?php
declare(strict_types=1);
try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST'); http_response_code(405); exit;
    }
    if (($_SERVER['CONTENT_LENGTH'] ?? 0) > 6000 ||
        !str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/x-www-form-urlencoded')) {
        http_response_code(413); exit;
    }
    $privateDir = getenv('SERINA_PRIVATE_DIR');
    if (!$privateDir || !is_file($privateDir . '/contact-lib.php')) throw new RuntimeException('Missing application configuration');
    require $privateDir . '/contact-lib.php';
    $privateDir = serina_private_dir();
    if (serina_env('SERINA_MAIL_READY') !== '1') throw new RuntimeException('Mail not commissioned');
    // Require exact HTTPS Origin; don't trust user-supplied Host or proxy headers.
    $expectedOrigin = serina_env('SERINA_ORIGIN');
    if ($expectedOrigin === '' || !str_starts_with($expectedOrigin, 'https://')) throw new RuntimeException('Site origin missing');
    if (!hash_equals($expectedOrigin, $_SERVER['HTTP_ORIGIN'] ?? '')) {
        serina_response(403, ['error' => 'Invalid request origin.']);
    }
    serina_session($privateDir);
    $provided = serina_value($_POST, 'csrf_token');
    $issued = $_SESSION['csrf_token'] ?? '';
    $issuedAt = $_SESSION['csrf_time'] ?? 0;
    unset($_SESSION['csrf_token'], $_SESSION['csrf_time']);
    session_write_close();
    if (!is_string($issued) || strlen($issued) !== 64 || !hash_equals($issued, $provided) ||
        !is_int($issuedAt) || $issuedAt < time() - 900 || $issuedAt > time()) {
        serina_response(403, ['error' => 'Form session expired. Please retry.']);
    }
    $fields = serina_validate($_POST);
    if (serina_value($_POST, 'bot-field') !== '') {
        // Bot trap: do not send to the recipient or disclose spam filtering.
        serina_response(422, ['error' => 'The enquiry could not be processed. Please contact the team directly.']);
    }
    if (!serina_rate_allow($privateDir, $_SERVER['REMOTE_ADDR'] ?? '', serina_env('SERINA_RATE_SECRET'))) {
        serina_response(429, ['error' => 'Too many enquiries. Please try again later or call us.']);
    }
    require $privateDir . '/smtp-mailer.php';
    serina_send_email($fields, $privateDir);
    serina_response(200, ['ok' => true]);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['error' => $e->getMessage()], JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $e) {
    error_log('Serina contact: delivery unavailable');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    http_response_code(503);
    echo '{"error":"Enquiries are temporarily unavailable. Please call or message the team."}';
}
