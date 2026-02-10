<?php

namespace App\Observers;

use Carbon\Carbon;
use App\Models\Stage;

class StageObserver
{
    /**
     * Handle the Stage "created" event.
     */
    public function created(Stage $stage): void
    {
        $this->updateEtatstage($stage);
    }

    /**
     * Handle the Stage "updated" event.
     */
    public function updated(Stage $stage): void
    {
        $this->updateEtatstage($stage);
    }

    /**
     * Handle the Stage "deleted" event.
     */
    public function deleted(Stage $stage): void
    {
        //
    }

    /**
     * Handle the Stage "restored" event.
     */
    public function restored(Stage $stage): void
    {
        //
    }

    /**
     * Handle the Stage "force deleted" event.
     */
    public function forceDeleted(Stage $stage): void
    {
        //
    }
    protected function updateEtatstage(Stage $stage){
        $currentDate = Carbon::now();
        $dateDebut = Carbon::parse($stage->dateDebut);
        $dateFin = Carbon::parse($stage->dateFin);

        if ($currentDate->lessThan($dateDebut)) {
            $stage->etatstage = 'pas commencé"';
        } elseif ($currentDate->between($dateDebut, $dateFin)) {
            $stage->etatstage = 'en cours';
        } elseif ($currentDate->greaterThan($dateFin)) {
            $stage->etatstage = 'terminé';
        }
    }
}
