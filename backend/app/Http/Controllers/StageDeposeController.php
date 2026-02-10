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

class StageDeposeController extends Controller
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
    public function index(){
        return Stage::with('organisme.adresse','depose.etudiant.utilisateur')
                    ->join('stagedepose', 'stages.idStage', '=', 'stagedepose.idStage')
                    ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        try{
            $organisme = $this->organisme->create($request->only([
                'nomOrganisme','nomContact',
                'prenomContact','typeOrganisme',
                'telContact','emailContact',
            ]));

            $organisme->adresse()->create($request->only(['ville','rue','region']));

            $stage = $organisme->stage()->create($request->only([
                'intitule','dateDebut',
                'dateFin','descriptif',
                'objectif', 'specialite'
            ]));
            // $stage->nbreStagaires = 1;
            // $stage->save();

            $this->stagedepose->create([
                'idEtudiant' => $request->idEtudiant,
                'idStage' => $stage->idStage
            ]);

            return response()->json([
                'message' => "Le stage a été créé avec succès"
              ], 200);
        }catch(Throwable $e){
            return response()->json([
              'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stages = Stage::with('organisme.adresse', 'depose')
                    ->join('stagedepose', 'stages.idStage', '=', 'stagedepose.idStage')
                    ->where('stagedepose.idEtudiant', '=', $id)
                    ->get();
        if(!empty($stages)){
        return $stages;
        }else{
        return 'hi';
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        try{
            $this->organisme->find($id)->delete();
            return response()->json([
              'message' => "La déposition du stage a été annulée avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }

    public function getAcceptedStages(){
        // whereNull('stages.idEnseignant')
        $passerIds = PasserStage::pluck('idStage')->all();
        return Stage::with('organisme','depose.etudiant.utilisateur')
        ->join('stagedepose', 'stages.idStage', '=', 'stagedepose.idStage')
        ->where('stagedepose.etat', 'accepté')
        ->whereNotIn('stages.idStage', $passerIds)
        ->get();
    }

    public function accepter(Request $request){

        $idEtudiant = $request->input('idEtudiant');
        $idStage = $request->input('idStage');

        $record = StageDepose::where('idEtudiant', $idEtudiant)
                            ->where('idStage', $idStage)
                            ->first();
        try{
            $record->update(['etat' => 'accepté']);
            return response()->json([
                'message' => "Vous avez accepté le stage."
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }
    public function refuser(Request $request){

        $idEtudiant = $request->input('idEtudiant');
        $idStage = $request->input('idStage');

        $record = StageDepose::where('idEtudiant', $idEtudiant)
                            ->where('idStage', $idStage)
                            ->first();
        try{
            $record->update(['etat' => 'refusé']);
            return response()->json([
                'message' => "Vous avez refusé le stage."
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }
}
