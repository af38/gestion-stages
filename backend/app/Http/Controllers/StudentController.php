<?php

namespace App\Http\Controllers;

use App\Mail\PasswordMail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\Utilisateur;
use App\Models\Etudiant;
use App\Models\SeanceEncadrement;

class StudentController extends Controller
{

  protected $etudiant;
  protected $utilisateur;
  protected $etudiantData;
  protected $utilisateurData;
  public function __construct(){
    $this->etudiant = new Etudiant();
    $this->utilisateur = new Utilisateur();
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
    public function index()
    {
      return $this->etudiant->with('utilisateur')->get();
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
      $validateStudent = Validator::make($request->all(),[
        'nom' => 'required',
        'prenom' => 'required',
        'email' => 'required|email|unique:utilisateur,email|',
        'numTel' => 'required',
        'dateNaissance' => 'required',
        'filiere' => 'required|alpha',
        'niveauEtude' => 'required',
        'cne' => 'required',
        'specialite' => 'required'
      ]);

      if($validateStudent->fails()){
        return response()->json([
          'status' => false,
          'message' => 'erreur de validation',
          'errors' => $validateStudent->errors()
        ], 422);
      }

      $password = $this->generatePassword(6);
      $hashedPassword = Hash::make($password);

      $utilisateurtData = [
          'nom' => $request->nom,
          'prenom' => $request->prenom,
          'password' => $hashedPassword,
          'email' => $request->email,
          'numTel' => $request->numTel,
          'role' => 'student',
      ];

        try{

          $utilisateur = $this->utilisateur->create($utilisateurtData);
          $utilisateur->etudiant()->create($request->only([
            'dateNaissance', 'filiere', 'niveauEtude', 'cne', 'specialite'
          ]));

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
            'message' => "le compte étudiant a été créé avec succès",
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
    public function show(string $id)
    {
        // $student = $this->etudiant->find($id);

        $student = $this->etudiant->with('utilisateur')->find($id);
        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
      $utilisateur = $this->utilisateur->find($id);
      $etudiant = $this->etudiant->find($id);
      try{
        $utilisateur->update($request->only([
          'nom', 'prenom', 'email', 'numTel',
        ]));
        $etudiant->update($request->only([
          'dateNaissance', 'filier', 'niveauEtude', 'cne', 'specialite',
        ]));
        return response()->json([
          'message' => "Le compte de l'étudiant a été mise à jour avec succès"
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
        $utilisateur = $this->utilisateur->find($id);
        $utilisateur->delete();
        return response()->json([
          'message' => "Le compte de l'étudiant a été supprimé avec succès"
        ], 200);
      }catch(Throwable $e){
        return response()->json([
            'message' => "quelque chose s'est mal passé :" . $e,
          ], 500);
      }
    }

    public function isIntern(int $id){
      $record = DB::table('etudiant')->join('passerStage', 'etudiant.idEtudiant', '=', 'passerStage.idEtudiant')->where('etudiant.idEtudiant', $id)->first();
      try{
        if ($record) {
          return response()->json([
              'status' => true,
          ], 200);
      } else {
          return response()->json([
              'status' => false,
          ], 200);
      }
      }catch (Throwable $e) {
        return response()->json([
            'status' => false,
            'message' => "Quelque chose s'est mal passé.",
            'error' => $e->getMessage()
        ], 500);
    }


  }
  public function seancesByStudentId(int $id){
    $seances = SeanceEncadrement::where('idEtudiant', $id)->get();
    return $seances;
  }

  public function getDistinctFilieres(){
      $distinctFilieres = Etudiant::distinct()->pluck('filiere');
      return response()->json($distinctFilieres);
  }

  //students without stage
  public function getDisaffectedStudents(){
    $ids = DB::table('etudiant')
              ->join('passerStage', 'etudiant.idEtudiant','=', 'passerStage.idEtudiant')
              ->join('stages', 'stages.idStage', '=', 'passerStage.idStage')
              ->select('etudiant.idEtudiant')->pluck('etudiant.idEtudiant');

    return Etudiant::with('utilisateur')->whereNotIn('idEtudiant', $ids)->get();
  }

  //get student stage history
  public function getHistory(Request $request){
    $id = $request->input('id');
    return $record = DB::table('stages')
              ->join('passerStage', 'stages.idStage', '=', 'passerStage.idStage')
              ->join('etudiant', 'passerStage.idEtudiant', '=', 'etudiant.idEtudiant')
              ->where('passerStage.idEtudiant', $id)
              ->select('stages.intitule', 'stages.dateFin', 'passerStage.note')->get();
  }
}
