<?php

use Illuminate\Support\Facades\Route;

// Test endpoint to verify server can make HTTP requests
Route::get('/test-http', function() {
    $url = 'https://api.restful-api.dev/objects';
    
    $results = [
        'server_ip' => $_SERVER['SERVER_ADDR'] ?? 'unknown',
        'php_version' => phpversion(),
        'curl_available' => function_exists('curl_init'),
        'allow_url_fopen' => ini_get('allow_url_fopen'),
    ];
    
    // Test 1: file_get_contents
    try {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        $results['file_get_contents'] = $response !== false ? 'SUCCESS' : 'FAILED';
        if ($response !== false) {
            $data = json_decode($response, true);
            $results['file_get_contents_data_count'] = is_array($data) ? count($data) : 0;
        }
    } catch (\Exception $e) {
        $results['file_get_contents'] = 'ERROR: ' . $e->getMessage();
    }
    
    // Test 2: cURL
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        $errno = curl_errno($ch);
        curl_close($ch);
        
        $results['curl_errno'] = $errno;
        $results['curl_error'] = $error ?: 'none';
        $results['curl_http_code'] = $httpCode;
        
        if ($errno === 0 && $httpCode === 200) {
            $results['curl'] = 'SUCCESS';
            $data = json_decode($response, true);
            $results['curl_data_count'] = is_array($data) ? count($data) : 0;
        } else {
            $results['curl'] = 'FAILED';
        }
    }
    
    // Test 3: Laravel HTTP Client
    try {
        $response = \Illuminate\Support\Facades\Http::withOptions([
            'verify' => false,
            'timeout' => 10,
        ])->get($url);
        
        $results['laravel_http'] = $response->successful() ? 'SUCCESS' : 'FAILED';
        $results['laravel_http_status'] = $response->status();
        if ($response->successful()) {
            $data = $response->json();
            $results['laravel_http_data_count'] = is_array($data) ? count($data) : 0;
        }
    } catch (\Exception $e) {
        $results['laravel_http'] = 'ERROR: ' . $e->getMessage();
    }
    
    // Test 4: DNS resolution
    $hostname = parse_url($url, PHP_URL_HOST);
    $ip = gethostbyname($hostname);
    $results['dns_resolution'] = $ip !== $hostname ? "SUCCESS ($ip)" : 'FAILED';
    
    return response()->json($results, 200, [], JSON_PRETTY_PRINT);
});
