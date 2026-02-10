<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Etudiant;
use App\Models\Organisme;
use App\Models\Stage;
use App\Models\Enseignant;
use App\Models\Etablissement;

use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

use Illuminate\Http\Request;

class pdfController extends Controller
{
    protected $etudiant;
    protected $utilisateur;
    protected $organisme;

    public function __construct(){
      $this->etudiant = new Etudiant();
      $this->utilisateur = new Utilisateur();
      $this->organisme = new Organisme();
    }

    public function convention(string $id){
        // get student by id
        $student = $this->etudiant->with('utilisateur')->find($id);

        // get stage by student id
        $stage = DB::table('stages')
                    ->join('passerStage', 'stages.idStage', '=', 'passerStage.idStage')
                    ->where('passerStage.idEtudiant', '=', $id)
                    ->select('stages.*')
                    ->get();

        $organisme = $this->organisme->find($stage[0]->idOrganisme);
        $teacher = Enseignant::with('utilisateur')->find($stage[0]->idEnseignant);
        $logo =  Etablissement::get()->first() ? Etablissement::get()->first()->logo : '';

        $data = [
            'student' => $student,
            'stage' => $stage[0],
            'organisme' => $organisme,
            'teacher' => $teacher,
            'logo' => $logo,
        ];

        $pdf = Pdf::loadView('convention', $data);
        return $pdf->download('convention.pdf');
    }

    public function fiche(string $id){
        //ENTREPRISE D’ACCUEIL
        $etablissement = Etablissement::with('organisme')->first();

        $student = $this->etudiant->with('utilisateur')->find($id);

        $stage = DB::table('stages')
                    ->join('passerStage', 'stages.idStage', '=', 'passerStage.idStage')
                    ->where('passerStage.idEtudiant', '=', $id)
                    ->select('stages.*')
                    ->first();

        $organisme = $this->organisme->find($stage->idOrganisme);
        $teacher = Enseignant::with('utilisateur')->find($stage->idEnseignant);
        $logo =  Etablissement::get()->first() ? Etablissement::get()->first()->logo : '';

        $data = [
            'student' => $student,
            'stage' => $stage,
            'organisme' => $organisme,
            'teacher' => $teacher,
            'logo' => $logo,
        ];

        $pdf = Pdf::loadView('fiche', $data);
        return $pdf->download('fiche.pdf');
    }
}
