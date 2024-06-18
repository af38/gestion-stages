<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Commission;
use App\Models\RejoindreComm;

class CommissionController extends Controller
{
    protected $commission;
    protected $rejoindre;

    public function __construct(){
        $this->commission = new Commission();
        $this->rejoindre = new RejoindreComm();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->commission->all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        try{
            return $this->commission->create($request -> all());
            return response()->json([
                'status' => true,
                'message' => "La commission a été créée avec succès",
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
        return $this->commission->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
        try{
            $this->commission->find($id)->update($request->all());
            return response()->json([
                'status' => true,
                'message' => "La commission a été miss a jour avec succès",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        try{
            $this->commission->find($id)->delete();
            return response()->json([
              'message' => "La commission a été supprimé avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
              ], 500);
        }
    }


    public function rejoindre(Request $request){
        try{
            $this->rejoindre->create($request->all());
            return response()->json([
                'status' => true,
                'message' => "l'enseignant a été ajouté avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
            ], 500);
        }
    }

    public function disaffecter(int $teacherId)
    {
        try {
            $record = RejoindreComm::where('idEnseignant', $teacherId)->first();

            // $record = RejoindreComm::find([
            //     'idEnseignant' => $teacherId,
            //     'idCommission' => $commId,
            // ]);

            // return $record;

            if ($record) {
                $record->delete();
                return response()->json([
                    'status' => true,
                    'message' => "L'enseignant(e) a été désaffecté(e) avec succès.",
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => "Enregistrement non trouvé.",
                ], 404);
            }
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => "Quelque chose s'est mal passé.",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // get commisions by  teacher
    public function commByTeacher(string $id){
        $records = DB::table('commissions')
                   ->join('rejoindrecomm', 'commissions.idCommission', '=', 'rejoindrecomm.idCommission')
                   ->join('enseignants', 'enseignants.idEnseignant','=', 'rejoindrecomm.idEnseignant')
                   ->where('rejoindrecomm.idEnseignant', $id)
                   ->select('commissions.*')
                   ->get();

        return $records;
    }
}
