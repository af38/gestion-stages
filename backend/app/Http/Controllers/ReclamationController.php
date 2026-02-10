<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Reclamation;
use App\Models\Etudiant;
use App\Models\Enseignant;

class ReclamationController extends Controller
{
    protected $reclamation;
    protected $etudiant;
    protected $enseignant;

    public function __construct(){
        $this->reclamation = new Reclamation();
        $this->etudiant = new Etudiant();
        $this->enseignant = new Enseignant();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->reclamation->with('etudiant.utilisateur', 'enseignant.utilisateur')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $this->reclamation->create($request->all());

            return response()->json([
                'status' => true,
                'message' => "L'étudiant a été réclamé avec succès",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->reclamation->with('etudiant.utilisateur', 'enseignant.utilisateur')->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->reclamation->find($id)->update(['etat' => $request->etat]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $this->reclamation->find($id)->delete();
            return response()->json([
                'status' => true,
                'message' => "la reclamation a été annulée avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }

    // getRespReclamations()
    public function getRespReclamations(){
        $reclamations = Reclamation::where('etat', '!=', 'annulle')->with('etudiant.utilisateur', 'enseignant.utilisateur')->get();
        return $reclamations;
    }

    // get reclamations made by a teacher
    public function reclmationsByEns(string $id){
        try{
            $reclamations = Reclamation::with('etudiant.utilisateur')
                            ->join('etudiant', 'etudiant.idEtudiant', '=', 'reclamations.idEtudiant')
                            ->where('reclamations.idEnseignant', '=', $id)
                            ->select('reclamations.*')
                            ->get();
            return $reclamations;
        }catch(Throwable $e){
            return 'something went wrong' . $e;
        }
    }
}
