<?php
// General, non-confidential enquiry validation. Never accept will instructions here.
declare(strict_types=1);

function serina_value(array $data, string $key): string {
    return isset($data[$key]) && is_string($data[$key]) ? $data[$key] : '';
}
function serina_one_line(string $value, int $limit): string {
    if (str_contains($value, "\r") || str_contains($value, "\n")) throw new InvalidArgumentException("Invalid line breaks in field.");
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    if ($value === null) throw new InvalidArgumentException('Invalid text encoding.');
    $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
    if (strlen($value) > $limit) throw new InvalidArgumentException('Field is too long.');
    return $value;
}
function serina_validate(array $data): array {
    $name = serina_one_line(serina_value($data, 'name'), 100);
    $phone = serina_one_line(serina_value($data, 'phone'), 30);
    $email = serina_one_line(serina_value($data, 'email'), 160);
    $location = serina_one_line(serina_value($data, 'location'), 120);
    $service = serina_one_line(serina_value($data, 'service'), 50);
    $message = trim(serina_value($data, 'message'));
    if (!preg_match('//u', $message) || strlen($message) > 1200) {
        throw new InvalidArgumentException('Message must be valid text of at most 1200 bytes.');
    }
    $message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message);
    if ($message === null || !$message) throw new InvalidArgumentException('Please describe your enquiry.');
    if (strlen($name) < 2 || preg_match('/[\r\n]/', $name)) {
        throw new InvalidArgumentException('Please provide your full name.');
    }
    if (!preg_match('/^\+?[0-9() .-]{7,30}$/', $phone) || preg_match_all('/[0-9]/', $phone) < 7) {
        throw new InvalidArgumentException('Please provide a reachable phone number.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Please provide a valid email address or leave it blank.');
    }
    $allowed = ['general','land-planning','environment','sustainability','technical','estate','will-preparation','governance','auditing'];
    if (!in_array($service, $allowed, true)) throw new InvalidArgumentException('Please select a valid service.');
    if (serina_value($data, 'contact-consent') !== 'yes') {
        throw new InvalidArgumentException('Consent is required before sending an enquiry.');
    }
    return compact('name','phone','email','location','service','message');
}
function serina_session(string $privateDir): void {
    $sessions = $privateDir . '/sessions';
    if (!is_dir($sessions) || !is_writable($sessions)) {
        throw new RuntimeException('Private session directory unavailable');
    }
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_save_path($sessions);
        session_name('__Host-serina-csrf');
        session_start([
            'use_strict_mode' => 1,
            'use_only_cookies' => 1,
            'cookie_secure' => true,
            'cookie_httponly' => true,
            'cookie_samesite' => 'Strict',
            'cookie_path' => '/',
            'cache_limiter' => 'nocache',
        ]);
        if (session_status() !== PHP_SESSION_ACTIVE) throw new RuntimeException('Cannot start session');
    }
}
function serina_env(string $key): string {
    $v = getenv($key);
    if ($v === false) return '';
    return in_array($key, ['SERINA_SMTP_PASS', 'SERINA_RATE_SECRET'], true) ? $v : trim($v);
}
function serina_private_dir(): string {
    $path = serina_env('SERINA_PRIVATE_DIR');
    if ($path === '' || !str_starts_with($path, '/') || !is_dir($path)) {
        throw new RuntimeException('Private directory is not configured');
    }
    return rtrim($path, '/');
}
function serina_response(int $status, array $body): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('X-Frame-Options: DENY');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function serina_rate_allow(string $privateDir, string $ip, string $secret, int $limit = 5, int $window = 1800): bool {
    if ($ip === '' || strlen($secret) < 32) throw new RuntimeException('Rate-limit configuration is missing');
    $dir = $privateDir . '/rate-limits';
    if (!is_dir($dir) || !is_writable($dir)) throw new RuntimeException('Rate-limit directory unavailable');
    // Rotate the opaque key daily; never retain plaintext IP or user input.
    $id = hash_hmac('sha256', $ip . '|' . gmdate('Y-m-d'), $secret);
    $f = fopen($dir . '/' . $id . '.json', 'c+');
    if (!$f || !flock($f, LOCK_EX)) throw new RuntimeException('Rate-limit lock unavailable');
    try {
        $data = stream_get_contents($f);
        $raw = $data ? json_decode($data, true) : [];
        $now = time();
        $events = is_array($raw) ? array_filter($raw, fn($n) => is_int($n) && $n > $now - $window && $n <= $now) : [];
        if (count($events) >= $limit) return false;
        $events[] = $now;
        rewind($f);
        if (!ftruncate($f, 0) || fwrite($f, json_encode(array_values($events))) === false || !fflush($f)) {
            throw new RuntimeException('Rate-limit write failed');
        }
        return true;
    } finally {
        flock($f, LOCK_UN);
        fclose($f);
    }
}
