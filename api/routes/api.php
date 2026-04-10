<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ApplicationStatsController;
use App\Http\Controllers\Api\ApplicationNoteController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\SkillCategoryController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\WorkModeController;
use App\Http\Controllers\Api\JobContractTypeController;
use App\Http\Controllers\Api\FollowUpController;
use App\Http\Controllers\Api\FollowUpEmailController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\GmailController;


Route::get('/health', [HealthController::class, 'check']);

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {

    Broadcast::routes();

    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user',    [AuthController::class, 'user']);
    });

    Route::prefix('applications')->group(function () {

        Route::get('stats',      [ApplicationStatsController::class, 'index']);
        Route::get('interviews', [ApplicationController::class, 'interviews']);

        Route::get('follow-ups',        [FollowUpController::class, 'index']);
        Route::post('check-follow-ups', [FollowUpController::class, 'checkFollowUps']);
        Route::get('follow-up-stats',   [FollowUpController::class, 'stats']);

        Route::prefix('{application}')->group(function () {

            Route::patch('status',             [ApplicationController::class, 'updateStatus']);
            Route::post('upload-cv',           [ApplicationController::class, 'uploadCV']);
            Route::post('upload-cover-letter', [ApplicationController::class, 'uploadCoverLetter']);

            Route::post('mark-follow-up-sent', [FollowUpController::class, 'markFollowUpSent']);
            Route::post('reset-follow-up',     [FollowUpController::class, 'resetFollowUp']);

            Route::get('follow-up-emails',     [FollowUpEmailController::class, 'index']);
            Route::post('follow-up-emails',    [FollowUpEmailController::class, 'store']);

            Route::get('notes',                [ApplicationNoteController::class, 'index']);
            Route::post('notes',               [ApplicationNoteController::class, 'store']);
            Route::delete('notes/{note}',      [ApplicationNoteController::class, 'destroy']);
        });
    });

    Route::apiResource('applications', ApplicationController::class);

    Route::get('applications-stats',      [ApplicationStatsController::class, 'index']);
    Route::get('applications-interviews', [ApplicationController::class, 'interviews']);

    Route::prefix('profile')->group(function () {
        Route::get('/',        [ProfileController::class, 'show']);
        Route::put('/',        [ProfileController::class, 'update']);
        Route::post('photo',   [ProfileController::class, 'updatePhoto']);
        Route::delete('photo', [ProfileController::class, 'deletePhoto']);
    });

    Route::get('documents',               [DocumentController::class, 'index']);
    Route::post('documents',              [DocumentController::class, 'store']);
    Route::delete('documents/{document}', [DocumentController::class, 'destroy']);

    Route::prefix('notifications')->controller(NotificationController::class)->group(function () {
        Route::get('/',                  'index');
        Route::get('unread',             'unread');
        Route::post('{id}/mark-as-read', 'markAsRead');
        Route::post('mark-all-as-read',  'markAllAsRead');
    });

    Route::apiResource('skill-categories',   SkillCategoryController::class);
    Route::apiResource('skills',             SkillController::class);
    Route::apiResource('job-contract-types', JobContractTypeController::class);
    Route::apiResource('work-modes',         WorkModeController::class);
    Route::apiResource('offers',             OfferController::class);
});

Route::get('/gmail/connect', [GmailController::class, 'redirect']);
Route::get('/gmail/callback', [GmailController::class, 'callback']);
Route::get('/gmail/mails', [GmailController::class, 'mails']);

Route::get('/test-followups', function () {
    Artisan::call('applications:check-followups', ['--force' => true]);
    return Artisan::output();
});