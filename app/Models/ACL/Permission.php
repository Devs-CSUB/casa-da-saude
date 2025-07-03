<?php

namespace App\Models\ACL;

use Database\Factories\ACL\PermissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany};
use Illuminate\Database\Eloquent\{Collection, Model};
use Illuminate\Support\Facades\Cache;

class Permission extends Model
{
    /** @use HasFactory<PermissionFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'module_id',
        'guard',
    ];

    /**
     * Get the module that owns the permission.
     * @return BelongsTo<Module, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
    * The roles that belong to the permission.
    * @return BelongsToMany<Role, $this>
    */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Gets the permission by guard
     *
     * @param string $guard
     * @return Permission
     */
    public static function getPermission(string $guard): Permission
    {
        /** @var Permission $permission */
        $permission = self::getAllFromCache()->where('guard', $guard)->first();

        return $permission;
    }

    /**
     * Gets all permissions from cache or load from database
     *
     * @return Collection<int, static>
     */
    public static function getAllFromCache(): Collection
    {
        /** @var Collection<int, static> $permissions */
        $permissions = Cache::rememberForever('permissions', function () {
            return self::all();
        });

        return $permissions;
    }

    /**
     * Check if permission exists
     *
     * @param string $guard
     * @return boolean
     */
    public static function existsOnCache(string $guard): bool
    {
        return self::getAllFromCache()->where('guard', $guard)->isNotEmpty();
    }
}
