<?php
declare(strict_types=1);
require dirname(__DIR__) . '/backend/private/contact-lib.php';
function assertTrue(bool $condition, string $name): void {
    if (!$condition) { fwrite(STDERR, 'FAIL: ' . $name . "\n"); exit(1); }
    echo 'PASS: ' . $name . "\n";
}
function invalid(array $data): bool {
    try { serina_validate($data); return false; }
    catch (InvalidArgumentException $e) { return true; }
}
$valid = [
    'name' => 'Someone Tester', 'phone' => '+263 77 123 4567', 'email' => '',
    'service' => 'general', 'message' => 'Please call me about your services.',
    'contact-consent' => 'yes', 'location' => 'Harare'
];
$v=serina_validate($valid);
assertTrue($v['email'] === '' && $v['phone'] === $valid['phone'], 'phone-only enquiry accepted');
assertTrue(invalid(array_merge($valid, ['phone' => 'nope'])), 'missing or invalid phone rejected');
assertTrue(invalid(array_merge($valid, ['name' => ''])), 'empty name rejected');
assertTrue(invalid(array_merge($valid, ['email' => 'not-an-email'])), 'invalid optional email rejected');
assertTrue(invalid(array_merge($valid, ['message' => str_repeat('A', 1201)])), 'oversized message rejected');
assertTrue(invalid(array_merge($valid, ['contact-consent' => ''])), 'consent required');
assertTrue(invalid(array_merge($valid, ['service' => 'other'])), 'service allowlist enforced');
assertTrue(invalid(array_merge($valid, ['name' => "Bad\r\nBcc: victim@example.com" ])), 'header injection rejected');
assertTrue(invalid(array_merge($valid, ['phone' => ['array','attack']])), 'array-valued fields rejected');
$dir = sys_get_temp_dir() . '/serina-rate-' . bin2hex(random_bytes(8));
mkdir($dir, 0700, true); mkdir($dir . '/rate-limits', 0700, true);
$secret=str_repeat('r', 40);
for ($i=0;$i<5;$i++) assertTrue(serina_rate_allow($dir,'192.0.2.25',$secret), 'rate limit permits request '.$i);
assertTrue(!serina_rate_allow($dir,'192.0.2.25',$secret), 'rate limit rejects sixth request');
assertTrue(serina_rate_allow($dir,'192.0.2.26',$secret), 'different IP not blocked');
foreach(glob($dir.'/rate-limits/*') as $file) unlink($file);
rmdir($dir.'/rate-limits');rmdir($dir);
echo "Backend input/rate tests passed\n";
