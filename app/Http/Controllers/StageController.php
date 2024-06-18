<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Stage;
use App\Models\Organisme;
use App\Models\Etudiant;
use App\Models\Enseignant;
use App\Models\PasserStage;
use App\Models\StageDepose;

class StageController extends Controller
{
    protected $stage;
    protected $organisme;
    protected $etudiant;
    protected $enseignant;
    protected $passerStage;
    protected $stagedepose;
    // constructor
    public function __construct(){
        $this->stage = new Stage();
        $this->organisme = new Organisme();
        $this->etudiant = new Etudiant();
        $this->enseignant = new Enseignant();
        $this->passerStage = new PasserStage();
        $this->stagedepose = new StageDepose();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->stage->all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $stageData = [
            'idOrganisme' => (int) $request ->idOrganisme,
            'intitule' => $request-> intitule,
            'dateDebut' => $request-> dateDebut,
            'dateFin' => $request-> dateFin,
            'objectif' => $request-> objectif,
            'descriptif' => $request-> descriptif,
            'specialite' => $request-> specialite,
            'nbreStagaires'	=> $request-> nbreStagaires
        ];

        try{
            $this->stage->create($stageData);
            return response()->json([
                'status' => true,
                'message' => 'stage a été créé avec succès.',
              ], 200);
        }catch(Throwable $e){
            return 'something went wrong' . $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->stage->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
        try{
            $this->stage->find($id)->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'le stage a été mis à jour  avec succès.',
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
              ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        $stage = $this->stage->find($id);
        return $stage->delete();
    }

    public function affectation(Request $request){
        $nombreStagiairesActuels = PasserStage::where('idStage', $request -> idStage)->count();
        $nbreStagaires = Stage::find($request->idStage)->nbreStagaires;
        if(count($request->students) >  ($nbreStagaires - $nombreStagiairesActuels)){
            return response()->json([
                'status' => false,
                'message' => "Le nombre de stagiaires du stage sélectionné est dépassé",
            ], 422);
        }

        try{
            $stage = $this->stage->find($request->idStage)->update(['idEnseignant' => $request -> idEnseignant]);

            foreach ($request->students  as $key => $studentId) {
                $this->passerStage->create([
                    'idEtudiant' => $studentId,
                    'idStage' => $request->idStage
                ]);
            }
            return response()->json([
                'message' => "L'affectation a été effectuée avec succès",
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
            ], 500);
        }
    }

    public function dissafecterStudent(string $id){
        try{
            $record = PasserStage::where('idEtudiant', $id)->delete();
            return response()->json([
                'message' => "L'étudiant(e) a été désaffecté(e) avec succès",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
            ], 500);
        }
    }

    // stages encadres par un enseignant
    public function enseignantStages(string $id){
        return DB::table('stages')
                    ->join('enseignants', 'stages.idEnseignant', '=', 'enseignants.idEnseignant')
                    ->where('enseignants.idEnseignant', '=', $id)
                    ->get();
    }

    // etudiants encadres par une enseignant
    public function etudiantsDeEns(string $id){
        return Etudiant::with('utilisateur')
                        -> join('passerStage', 'etudiant.idEtudiant', '=', 'passerStage.idEtudiant')
                        -> join('stages', 'stages.idStage', '=', 'passerStage.idStage')
                        ->join('enseignants', 'enseignants.idEnseignant', '=', 'stages.idEnseignant')
                        -> where('enseignants.idEnseignant', '=', $id)
                        ->select('etudiant.*')
                        -> get();
    }

    // etudiants passer une stage
    public function etudiantsParStage(string $id){
        return Etudiant::with('utilisateur')
                        ->join('passerStage', 'etudiant.idEtudiant', '=', 'passerStage.idEtudiant')
                        ->join('stages', 'stages.idStage', '=', 'passerStage.idStage')
                        ->where('stages.idStage', '=', $id)
                        ->select('etudiant.*')
                        ->get();
    }

    //trouver le stage passer par un etudiant
    public function stageByStudentId(int $id){
        // $stage = Stage::join('passerStage', 'passerStage.idStage', '=', '')
        try{
            $passer = PasserStage::where('idEtudiant', $id)->first();
            if($passer){
                $idStage = $passer->idStage;
                $stage = $this->stage->find($idStage);
                return response()->json([
                    'status' => true,
                    'message' => "stage a ete trouvee",
                    'stage' => $stage,
                ], 200);
            }else{
                return response()->json([
                    'status' => false,
                    'message' => "stage n'est pas trouve",
                    'stage' => [],
                ], 200);
            }
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }

    //le nombre de stagaires autorise pour une stage
    public function getAuthStagairesNumber(int $id){
        $nombreStagiairesActuels = PasserStage::where('idStage', $id)->count();
        $nbreStagaires = Stage::find($id)->nbreStagaires;
        return $nbreStagaires - $nombreStagiairesActuels;
    }
}