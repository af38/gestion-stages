<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Models\Utilisateur;
use App\Models\Resp;

use App\Mail\PasswordMail;
use Illuminate\Support\Facades\Mail;

class RespController extends Controller
{
    protected $resp;
    protected $utilisateur;

    public function __construct(){
        $this->resp = new Resp();
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
    public function index(){
        return $this->resp->with('utilisateur')->get();
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
            'role' => 'resp',
        ];
        try{
            $utilisateur = $this->utilisateur->create($utilisateurtData);
            $utilisateur->resp()->create([]);
            $utilisateur->role = 'resp';

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
                'message' => "le compte responsable administratif a été créé avec succès.",
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
        return $this->utilisateur->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $utilisateur = $this->utilisateur->find($id);

        try{
            $utilisateur->update($request->all());
            return response()->json([
              'message' => "Le compte de responsable administratif a été mis à jour avec succès"
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
    public function destroy(string $id)
    {
        try{
            $this->utilisateur->find($id)->delete();
            return response()->json([
              'message' => "Le compte de la responsable a été supprimé avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }


    // search to be deleted
    public function search(string $query){
        $resps = DB::table('utilisateur')
        ->join('resps', 'resps.idResp', '=', 'utilisateur.idUser')
        ->whereAny([
          'nom',
          'prenom',
          'email',
          'numTel'
        ], 'LIKE', '%'.$query.'%')->get();

        // Transform the results
        $formattedResults = $resps->map(function ($item) {
        return [
            'idResp'=> $item->idResp,
            'utilisateur' => [
                'idUser' => $item->idUser,
                'nom' => $item->nom,
                'prenom' => $item->prenom,
                'email' => $item->email,
                'numTel' => $item->numTel,
            ]
        ];});

        return response()->json($formattedResults);
    }
}
