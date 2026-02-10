<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SeanceEncadrement;

class SeanceEncadrementController extends Controller
{
    protected $seance;

    public function __construct(){
        $this->seance = new SeanceEncadrement();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->seance->all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $this->seance->create($request->all());
            return response()->json([
                'status' => true,
                'message' => "La séance d'encadrement a été planifiée avec succès.",
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'status' => false,
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function destroy(string $id)
    {
        //
    }
}
