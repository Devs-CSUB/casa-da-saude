<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    /**
     * Search for professionals by query.
     *
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        $professionals = User::professionals()
            ->when($query, function ($queryBuilder) use ($query) {
                $queryBuilder->where('name', 'like', "%{$query}%")
                             ->orWhere('email', 'like', "%{$query}%");
            })
            ->take(15)
            ->get(['id', 'name', 'email'])
            ->map(function ($professional) {
                return [
                    'value' => $professional->id,
                    'label' => "{$professional->name} ({$professional->email})",
                ];
            });

        return response()->json($professionals);
    }
}
