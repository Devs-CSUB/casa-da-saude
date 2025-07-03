<?php

namespace App\Models\ACL;

use App\Models\User;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\{Builder, Model};
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property string $name
 * @property string|bool $is_support
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Role extends Model
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'is_support',
    ];

    /**
    * @param Builder<Role> $query
    * @return void
    */
    public function scopeCheckSupport(Builder $query): void
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->isSupport()) {
            $query->where('is_support', false)->whereKeyNot(1);
        }
    }

    /**
    * The users that belong to the role.
    * @return BelongsToMany<User, $this>
    */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The permissions that belong to the role.
     * @return BelongsToMany<Permission, $this>
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * @param array<int, int> $keys
     */
    public function storePermissions(array $keys): void
    {
        $this->permissions()->sync($keys);
    }

    /**
     * @return Paginator<Role>
     */
    public function search(?string $filter = null): Paginator
    {
        $result = $this->where('name', 'LIKE', "%{$filter}%")->where('id', '<>', 1)->paginate(15);

        return $result;
    }
}