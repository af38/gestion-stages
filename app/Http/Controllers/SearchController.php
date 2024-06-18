<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use App\Models\Reclamation;
use App\Models\Organisme;
use App\Models\Etudiant;
use App\Models\Enseignant;
use App\Models\Resp;
use App\Models\Stage;
use App\Models\Rapport;
use App\Models\StageDepose;
use App\Models\PasserStage;

class SearchController extends Controller
{
    protected function includeKeyWords($records){
        foreach ($records as $record) {
            $motcles = $record->motcles->pluck('motCle');
            $record->motclesList = $motcles;
            unset($record->motcles);
        }
        return $records;
    }
    //le nombre de stagaires autorise pour une stage
    protected function getAuthStagairesNumber($id){
        $nombreStagiairesActuels = PasserStage::where('idStage', $id)->count();
        $nbreStagaires = Stage::find($id)->nbreStagaires;
        return $nbreStagaires - $nombreStagiairesActuels;
    }
    protected function getFiltredStages($stages){
        $filteredStages = $stages->filter(function($stage) {
            return $this->getAuthStagairesNumber($stage->idStage) !== 0;
        });
        return $filteredStages;
    }

    public function searchComms(string $query){
        $comms = DB::table('commissions')
                        ->where('filiere','LIKE', '%'.$query.'%')
                        ->get();
        return $comms;
    }

    public function searchOrganismes(Request $request){
        $query = $request->input('query');
        $type = $request->input('type');

        $basequery = DB::table('organismes')
        ->whereAny([
            'nomOrganisme',
            'nomContact',
            'prenomContact',
            'telContact',
            'emailContact',
        ], 'LIKE', '%'.$query.'%');

        if($query && !$type){
            $ids = $basequery->select('idOrganisme')->pluck('idOrganisme');
            return Organisme::with('adresse')->whereIn('idOrganisme', $ids)->get();
        }elseif($type && !$query){
            return Organisme::with('adresse')->where('typeOrganisme', $type)->get();
        }elseif($query && $type){
            $ids = $basequery->where('typeOrganisme', $type)->select('idOrganisme')->pluck('idOrganisme');
            return Organisme::with('adresse')->whereIn('idOrganisme', $ids)->get();
        }else{

            return Organisme::with('adresse')->get();
        }


    }

    public function searchReclamations(Request $request){

        $query = $request->input('query');
        $etat = $request->input('etat');

        //base query
        $basequery = DB::table('reclamations')
        ->join('enseignants', 'enseignants.idEnseignant', '=', 'reclamations.idEnseignant')
        ->join('etudiant', 'etudiant.idEtudiant', '=', 'reclamations.idEtudiant')
        ->join('utilisateur as enseignant_utilisateur', 'enseignant_utilisateur.idUser', '=', 'enseignants.idEnseignant')
        ->join('utilisateur as etudiant_utilisateur', 'etudiant_utilisateur.idUser', '=', 'etudiant.idEtudiant')
        ->whereAny([
            'enseignant_utilisateur.nom',
            'enseignant_utilisateur.prenom',
            'enseignant_utilisateur.email',
            'enseignant_utilisateur.numTel',
            'etudiant_utilisateur.nom',
            'etudiant_utilisateur.prenom',
            'etudiant_utilisateur.email',
            'etudiant_utilisateur.numTel',
            'objet',
            'description',
        ], 'LIKE', '%'.$query.'%');

        if($etat && !$query){
            return Reclamation::with(['etudiant.utilisateur', 'enseignant.utilisateur'])->where('etat', $etat)->get();
        }elseif($query && !$etat){
            $ids = $basequery->select('idReclamation')->pluck('idReclamation');
            return Reclamation::with(['etudiant.utilisateur', 'enseignant.utilisateur'])
            ->whereIn('idReclamation', $ids)->get();
        }elseif($query && $etat){
            $ids = $basequery->where('etat', $etat)->select('idReclamation')->pluck('idReclamation');
            return Reclamation::with(['etudiant.utilisateur', 'enseignant.utilisateur'])
            ->whereIn('idReclamation', $ids)->get();
        }else{
            return Reclamation::with(['etudiant.utilisateur', 'enseignant.utilisateur'])->get();
        }

    }

    public function searchStudents(Request $request){
        $query = $request->query('query');
        $filiere = $request->query('filiere');
        $resp = $request->query('resp');

        if($resp){
            $StudentsIds = DB::table('etudiant')
            ->join('passerStage', 'etudiant.idEtudiant','=', 'passerStage.idEtudiant')
            ->join('stages', 'stages.idStage', '=', 'passerStage.idStage')
            ->select('etudiant.idEtudiant')->pluck('etudiant.idEtudiant');

            return Etudiant::with('utilisateur')->whereNotIn('idEtudiant', $StudentsIds)->get();
        }

        $basequery = DB::table('etudiant')
        ->join('utilisateur', 'etudiant.idEtudiant', '=', 'utilisateur.idUser')
        ->whereAny([
            'filiere',
            'niveauEtude',
            'cne',
            'specialite',
            'nom',
            'prenom',
            'email',
            'numTel',
        ], 'LIKE', '%'.$query.'%');

        if($filiere && !$query){
            return Etudiant::with('utilisateur')->where('filiere', $filiere)->get();
        }elseif($query && !$filiere){
            $ids = $basequery->select('idEtudiant')->pluck('idEtudiant');
            return Etudiant::with('utilisateur')->whereIn('idEtudiant', $ids)->get();

        }elseif($filiere && $query){
            $ids = $basequery->where('filiere', $filiere)->select('idEtudiant')->pluck('idEtudiant');
            return Etudiant::with('utilisateur')->whereIn('idEtudiant', $ids)->get();
        }else{
            return Etudiant::with('utilisateur')->get();
        }

    }

    public function searchTeachers(Request $request){
        $query = $request->input('query');
        $d = $request->input('d');

        $basequery = DB::table('enseignants')
        ->join('utilisateur', 'enseignants.idEnseignant', '=', 'utilisateur.idUser')
        ->whereAny([
            'nom',
            'prenom',
            'email',
            'numTel',
        ], 'LIKE', '%'.$query.'%');

        if($d && !$query){
            return Enseignant::with('utilisateur')->where('departement', $d)->get();
        }elseif($query && !$d){
            $ids = $basequery->select('idEnseignant')->pluck('idEnseignant');
            return Enseignant::with('utilisateur')->whereIn('idEnseignant', $ids)->get();

        }elseif($d && $query){
            $ids = $basequery->where('departement', $d)->select('idEnseignant')->pluck('idEnseignant');
            return Enseignant::with('utilisateur')->whereIn('idEnseignant', $ids)->get();
        }else{
            return Enseignant::with('utilisateur')->get();
        }
    }

    public function searchResps(Request $request){
        $query = $request->query('query');

        $basequery = DB::table('resps')
        ->join('utilisateur', 'resps.idResp', '=', 'utilisateur.idUser')
        ->whereAny([
            'nom',
            'prenom',
            'email',
            'numTel',
        ], 'LIKE', '%'.$query.'%');

        if($query){
            $ids = $basequery->select('idResp')->pluck('idResp');
            return Resp::with('utilisateur')->whereIn('idResp', $ids)->get();
        }

        return Resp::with('utilisateur')->get();
    }

    public function searchStages(Request $request){
        $query = $request->input('query');
        $organisme = $request->input('organisme');
        $deposeIds = StageDepose::pluck('idStage')->toArray();

        $basequery = DB::table('stages')
        ->whereAny([
            'intitule',
            'dateDebut',
            'dateFin',
            'descriptif',
            'objectif',
            'specialite',
            'nbreStagaires'
        ], 'LIKE', '%'.$query.'%')
        ->whereNotIn('idStage', $deposeIds);

        if($query && !$organisme){
            $ids = $basequery->select('idStage')->pluck('idStage');
            $stages = Stage::with('organisme')->whereIn('idStage', $ids)->get();
            return $this->getFiltredStages($stages);

        }elseif(!$query && $organisme){
            $stages = Stage::with('organisme')->where('idOrganisme', $organisme)->get();
            return $this->getFiltredStages($stages);
        }elseif($query && $organisme){
            $ids = $basequery->where('idOrganisme', $organisme)->select('idStage')->pluck('idStage');
            $stages = Stage::with('organisme')->whereIn('idStage', $ids)->get();
            return $this->getFiltredStages($stages);

        }else{
            $stages = Stage::with('organisme')->whereNotIn('idStage', $deposeIds)->get();
            return $this->getFiltredStages($stages);
        }
    }

    public function searchNormaleStages(Request $request){
        $query = $request->input('query');
        $organisme = $request->input('organisme');
        $deposeIds = StageDepose::pluck('idStage')->toArray();

        $basequery = DB::table('stages')
        ->whereAny([
            'intitule',
            'dateDebut',
            'dateFin',
            'descriptif',
            'objectif',
            'specialite',
            'nbreStagaires'
        ], 'LIKE', '%'.$query.'%')
        ->whereNotIn('idStage', $deposeIds);

        if($query && !$organisme){
            $ids = $basequery->select('idStage')->pluck('idStage');
            $stages = Stage::with('organisme')->whereIn('idStage', $ids)->get();
            return $stages;

        }elseif(!$query && $organisme){
            $stages = Stage::with('organisme')->where('idOrganisme', $organisme)->get();
            return $stages;
        }elseif($query && $organisme){
            $ids = $basequery->where('idOrganisme', $organisme)->select('idStage')->pluck('idStage');
            $stages = Stage::with('organisme')->whereIn('idStage', $ids)->get();
            return $stages;

        }else{
            $stages = Stage::with('organisme')->whereNotIn('idStage', $deposeIds)->get();
            return $stages;
        }
    }

    public function searchRapport(Request $request){
        $query = $request->input('query');
        $keyword = $request->input('keyword');

        if($keyword){
            $rapports1= Rapport::with('motcles')
                        ->join('rapportmotcle', 'rapports.idRapport', '=', 'rapportmotcle.idRapport')
                        ->join('motscles', 'rapportmotcle.idMotCle', '=', 'motscles.idMotCle')
                        ->where('motscles.motCle', 'like', '%'.$keyword.'%')
                        ->select('rapports.*')
                        ->get();
            return $this->includeKeyWords($rapports1);
        }elseif($query){
            $rapports2 =Rapport::with('motcles')
                    ->whereAny([
                        'titre',
                        'filiere',
                        'specialite',
                        'annee'
                    ], 'like', '%'.$query.'%')
                    ->get();
            return $this->includeKeyWords($rapports2);
        }

        $rapports = Rapport::with('motcles')->get();
        return $this->includeKeyWords($rapports);
    }

}
