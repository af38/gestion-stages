<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Stage;
use Carbon\Carbon;

class UpdateStageStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-stage-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the etatstage column based on current date';

    /**
     * Execute the console command.
     */
    public function handle(){
        $currentDate = Carbon::now();

        $stages = Stage::all();

        foreach ($stages as $stage) {
            $dateDebut = Carbon::parse($stage->date_debut);
            $dateFin = Carbon::parse($stage->date_fin);

            if ($currentDate->lessThan($dateDebut)) {
                $stage->etatstage = 'pas commencé';
            } elseif ($currentDate->between($dateDebut, $dateFin)) {
                $stage->etatstage = 'en cours';
            } elseif ($currentDate->greaterThan($dateFin)) {
                $stage->etatstage = 'terminé';
            }

            $stage->save();
        }

        return 0;
    }
}
