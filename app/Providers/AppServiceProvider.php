<?php

namespace App\Providers;

use App\Models\ACL\Permission;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\{Gate, Vite};
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        Vite::prefetch(concurrency: 3);

        Gate::before(function (User $user, $ability) {
            if ($user->isSupport()) {
                return true;
            }
        });

        Gate::after(function (User $user, $ability) {
            if (Permission::existsOnCache($ability)) {
                return $user->hasPermissionTo($ability);
            }
        });
    }
}
