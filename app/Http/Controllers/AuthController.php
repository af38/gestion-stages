<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Models\Utilisateur;
use App\Models\Etudiant;
use App\Models\Enseignant;
use App\Models\Admin;
use App\Models\Resp;

class AuthController extends Controller
{
    public function login(Request $request){
        try{
            $validateLogin = Validator::make($request->all(),
            [
              'password' => 'required',
              'email' => 'required|email',
            ]);

            //validation fails
            if($validateLogin->fails()){
                return response()->json([
                'status' => false,
                'message' => 'validation erreur',
                'errors' => $validateLogin->errors()
                ], 422);
            }

            $user = Utilisateur::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Mot de passe ou email incorrect'], 401);
            }

            switch ($user->role) {
                case 'student':
                    $user =Utilisateur::with('etudiant')->where('email', $request->email)->first();
                    break;
                case 'teacher':
                    $user = Utilisateur::with('enseignant')->where('email', $request->email)->first();
                    break;
            }
            return response()->json([
                'status' => true,
                'user' => $user,
                'message' => 'Login successful',
                'role' => $user->role,
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
