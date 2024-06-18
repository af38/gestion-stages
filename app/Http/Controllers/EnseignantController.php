<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordMail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Models\Utilisateur;
use App\Models\Enseignant;
use App\Models\RejoindreComm;
use App\Models\SeanceEncadrement;
use App\Models\PasserStage;

class EnseignantController extends Controller
{
    protected $enseignant;
    protected $utilisateur;
    protected $rejoindre;

    public function __construct(){
        $this->enseignant = new Enseignant();
        $this->utilisateur = new Utilisateur();
        $this->rejoindre = new RejoindreComm();
    }
    // generate password fucntion
    function generatePassword($length){
        $characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $characterPoolSize = strlen($characters);

        $password = "";

        // Generate random characters from letters and numbers
        for ($i = 0; $i < $length; $i++) {
          $password .= $characters[rand(0, $characterPoolSize - 1)];
        }

        // Shuffle the characters for better randomness
        $password = str_shuffle($password);

        return $password;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(){
        return $this->enseignant->with('utilisateur')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){

        $password = $this->generatePassword(6);
        $hashedPassword = Hash::make($password);

        $utilisateurtData = [
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'password' => $hashedPassword,
            'email' => $request->email,
            'numTel' => $request->numTel,
            'role' => 'teacher',
        ];
        $enseignantData = [
            'departement' => $request->departement
        ];

        try{
            $utilisateur = $this->utilisateur->create($utilisateurtData);
            $utilisateur->enseignant()->create($enseignantData);

            Mail::to($utilisateur->email)->send(new PasswordMail(
                [
                    'nom' => $utilisateur->nom,
                    'prenom' => $utilisateur->prenom,
                    'email' => $utilisateur->email,
                    'password' => $password,
                ]
            ));

            return response()->json([
                'status' => true,
                'message' => "le compte enseignant a été créé avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé " . $e,
              ], 500);
        }



    }

    /**
     * Display the specified resource.
     */
    public function show(string $id){
        return $this->enseignant->with('utilisateur')->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
        $utilisateur = $this->utilisateur->find($id);
        $enseignant = $this->enseignant->find($id);
        try{
          $utilisateur->update($request->only(['nom', 'prenom', 'email', 'numTel',]));
          $enseignant->update($request->only(['departement']));

          return response()->json([
            'message' => "Le compte de l'enseignant a été mis à jour avec succès"
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
        try{
            $this->utilisateur->find($id)->delete();
            return response()->json([
              'message' => "Le compte de l'enseignant a été supprimé avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }

    // function to check if teacher is in commission
    public function isMember(string $id){
        $record = RejoindreComm::where('idEnseignant', $id)->first();

        if($record){
            return response()->json([
                'status' => true,
            ], 200);
        }
        return response()->json([
            'status' => false,
        ], 200);
    }

    public function seancesByTeacherId($id){
        // $seances = SeanceEncadrement::where('idEnseignant', $id)->get();
        // return $seances;

        $records = SeanceEncadrement::join('etudiant', 'etudiant.idEtudiant', '=', 'seanacesEncadrement.idEtudiant')
                                     ->join('utilisateur', 'utilisateur.idUser', '=', 'etudiant.idEtudiant')
                                     ->where('seanacesEncadrement.idEnseignant', $id)
                                     ->select('seanacesEncadrement.*', 'utilisateur.nom', 'utilisateur.prenom')
                                     ->get();

        return $records;
    }

    public function getDistinctDepatments(){
        $distinctFilieres = Enseignant::distinct()->pluck('departement');
        return response()->json($distinctFilieres);
    }

    public function setNote(Request $request){
        $idEtudiant = $request->input('idEtudiant');
        $idStage = $request->input('idStage');
        $note = $request->input('note');
        $record = PasserStage::where('idStage', $idStage)->where('idEtudiant', $idEtudiant)->first();
        try{
            $record->update(['note' => $request->note]);
            return response()->json([
                'message' => "Vous avez attribué la note avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
              'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
          }
    }

}
