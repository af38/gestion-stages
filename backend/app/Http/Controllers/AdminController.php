<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\Utilisateur;
use App\Models\Admin;

use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordMail;

class AdminController extends Controller
{
    protected $admin;
    protected $utilisateur;

    protected $utilisateurtData;

    public function __construct(){
        $this->admin = new Admin();
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
        return $this->utilisateur->with('admin')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $password = $this->generatePassword(6);
        $hashedPassword = Hash::make($password);

        $utilisateurtData = [
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'password' => $hashedPassword,
            'email' => $request->email,
            'numTel' => $request->numTel,
            'role' => 'admin',
        ];

        try{
            $utilisateur = $this->utilisateur->create($utilisateurtData);
            $utilisateur->admin()->create([]);

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
                'message' => "le compte admin a été créé avec succès",
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
        return $this->utilisateur->with('admin')->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $utilisateur = $this->utilisateur->find($id);
        $utilisateur->update($request);

        return $utilisateur;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        $utilisateur = $this->utilisateur->find($id);
        return $utilisateur->delete();
    }
}
