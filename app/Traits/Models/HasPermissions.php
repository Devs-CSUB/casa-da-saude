<?php

namespace App\Traits\Models;

use App\Models\ACL\{Permission, Role};
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\{Auth, Cache};

trait HasPermissions
{
    public const SUPPORT = 1;

    /**
    * @param Builder<User> $query
    * @return void
    */
    public function scopeCheckSupport(Builder $query): void
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->isSupport()) {
            $query->whereKeyNot(1)->whereDoesntHave('roles', function (Builder $query) {
                return $query->where('roles.is_support', true);
            });
        }
    }

    /**
     * return true or false if user contains support role
     */
    public function isSupport(): bool
    {
        return $this->roles->where('id', self::SUPPORT)->isNotEmpty() or $this->roles->where('is_support', true)->isNotEmpty();
    }

    /**
     * Get all roles from user
     *
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->BelongsToMany(Role::class);
    }

    /**
     * Add role to user
     *
     * @param integer $role_id
     * @return void
     */
    public function setRole(int $role_id): void
    {
        $this->roles()->syncWithoutDetaching([$role_id]);
    }

    /**
     * Remove role from user
     *
     * @param integer $role_id
     * @return void
     */
    public function removeRole(int $role_id): void
    {
        $this->roles()->detach($role_id);
    }

    /**
     * Get all permissions from user
     *
     * @return array<int, string>
     */
    public function permissions(): array
    {
        $permissions = Cache::rememberForever(
            $this->getPermissionCacheKey(),
            function () {
                $permissions = [];

                if ($this->isSupport()) {
                    foreach (Permission::all() as $permission) {
                        $permissions[] = $permission->guard;
                    }
                } else {
                    foreach ($this->roles as $role) {
                        foreach ($role->permissions as $permission) {
                            $permissions[] = $permission->guard;
                        }
                    }
                }

                return $permissions;
            }
        );

        return $permissions;
    }

    /**
     * Check if user has permission
     *
     * @param string $key
     * @return boolean
     */
    public function hasPermissionTo(string $key): bool
    {
        return in_array($key, $this->permissions());
    }

    /**
     * Remove user permissions from cache
     *
     * @return void
     */
    public function forgetPermissionCache(): void
    {
        Cache::forget('permissions');
        Cache::forget($this->getPermissionCacheKey());
    }

    private function getPermissionCacheKey(): string
    {
        return "user::{$this->id}::permissions";
    }
}