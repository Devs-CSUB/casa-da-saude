<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\PublicAppointmentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // return Inertia::render('dashboard');
        return redirect('appointments');
    })->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('schedules', ScheduleController::class);
    Route::resource('procedures', ProcedureController::class);
    Route::resource('patients', PatientController::class);
    Route::resource('appointments', AppointmentController::class);
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'changeStatus'])
        ->name('appointment.change.status');
});

Route::prefix('/public/appointment')->group(function () {

    Route::get('/select-area', [PublicAppointmentController::class, 'selectArea'])->name('public.appointment.select-area');
    Route::get('/select-procedures/{area}', [PublicAppointmentController::class, 'selectProceduresByArea'])->name('public.appointment.select-procedures');

    Route::post('/add-procedures-to-cart', [PublicAppointmentController::class, 'addProceduresToCart'])->name('public.appointment.add-procedures-to-cart');

    Route::get('/select-datetime', [PublicAppointmentController::class, 'selectDateTime'])->name('public.appointment.select-datetime');
    Route::post('/add-datetime-to-cart', [PublicAppointmentController::class, 'addDateTimeToCart'])->name('public.appointment.add-datetime-to-cart');

    Route::get('/patient-form', [PublicAppointmentController::class, 'showPatientForm'])->name('public.appointment.patient-form');
    Route::post('/save-patient', [PublicAppointmentController::class, 'savePatient'])->name('public.appointment.save-patient');

    Route::get('/show-confirmation', [PublicAppointmentController::class, 'showConfirmation'])->name('public.appointment.show-confirmation');
    Route::get('/complete', [PublicAppointmentController::class, 'completeAppointment'])
        ->name('public.appointment.complete');

    Route::get('/success', [PublicAppointmentController::class, 'success'])
        ->name('public.appointment.success');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
