<?php

use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\PublicAppointmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/professionals/search', [ProfessionalController::class, 'search'])
->name('professionals.search');

Route::post('/get-available-slots', [PublicAppointmentController::class, 'getAvailableSlots'])
->name('get-available-slots');