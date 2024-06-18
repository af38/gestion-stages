<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\MotCle;
use App\Models\RapportMotCle;

use App\Models\Rapport;
// use App\Models\Organisme;

class RapportController extends Controller
{
    protected $rapport;
    protected $motCle;
    protected $motCleRapport;

    // constructor
    public function __construct(){
        $this->rapport = new Rapport();
        $this->motCle = new MotCle();
        $this->motCleRapport = new RapportMotCle();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->rapport->all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $rapport = $this->rapport->create($request->only(['annee', 'filiere', 'lien', 'specialite', 'titre']));

            foreach ($request->keywords as $key => $value) {
               $motcle =  $this->motCle->updateOrCreate(['motCle' => $value], []);
                $this->motCleRapport->create([
                    'idRapport' => $rapport->idRapport,
                    'idMotCle' => $motcle->idMotCle
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => "le rapport a été créé avec succès",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé ",
              ], 500);
          }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->rapport->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            $rapport = $this->rapport->find($id);
            $rapport->update($request->only(['annee', 'filiere', 'lien', 'specialite', 'titre']));

            foreach ($request->keywords as $key => $value) {
                $motcle =  $this->motCle->updateOrCreate(['motCle' => $value], []);
                 $this->motCleRapport->create([
                     'idRapport' => $rapport->idRapport,
                      'idMotCle' => $motcle->idMotCle
                 ]);

                 return response()->json([
                    'message' => "Le document a été mis à jour avec succès"
                  ], 200);
             }
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
              ], 500);
          }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $this->rapport->find($id)->delete();
            return response()->json([
                'message' => "Le rapport a été supprimé avec succès"
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
              ], 500);
          }
    }


}
