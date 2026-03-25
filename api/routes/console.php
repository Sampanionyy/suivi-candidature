<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('interviews:send-reminders')
    ->dailyAt('09:00')
    ->timezone('Europe/Paris')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/interview-reminders.log'))
    ->description('Rappels d\'entretien (TEST)');

Schedule::command('applications:check-followups')
    ->dailyAt('11:48')
    ->timezone('Europe/Paris') 
    ->onSuccess(function () {
        info('Vérification des relances effectuée avec succès');
    })
    ->onFailure(function () {
        error('Erreur lors de la vérification des relances');
    });

Schedule::command('gmail:check')
    ->everyFiveMinutes()
    ->onSuccess(function () {
        info('Vérification de la boîte Gmail effectuée avec succès');
    })
    ->onFailure(function () {
        error('Erreur lors de la vérification de la boîte Gmail');
    });