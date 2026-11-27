<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Siapkan direktori writable di /tmp untuk serverless Vercel
$tmpDirs = [
    '/tmp/storage/app/public',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/testing',
    '/tmp/storage/framework/views',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($tmpDirs as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// Arahkan cache bootstrap Laravel ke /tmp/bootstrap/cache
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes-v7.php';
$_ENV['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';
$_SERVER['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
$_SERVER['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
$_SERVER['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes-v7.php';
$_SERVER['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';

require __DIR__ . '/../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->useStoragePath('/tmp/storage');

$app->handleRequest(Request::capture());