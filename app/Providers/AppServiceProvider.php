<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $host = request()->getHost();
        $isLocal = in_array($host, ['localhost', '127.0.0.1'], true)
            || str_ends_with($host, '.test')
            || str_ends_with($host, '.local');

        if (! $isLocal) {
            URL::forceScheme('https');
        }
    }
}