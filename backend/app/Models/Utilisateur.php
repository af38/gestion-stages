<?php

namespace App\Models;
// use Laravel\Sanctum\HasApiTokens; // new added
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'utilisateur';
    protected $primaryKey = 'idUser';
    public $timestamps = false;
    protected $fillable = [
        'nom',
        'prenom',
        'password',
        'email',
        'numTel',
        'role',
    ];

    public function etudiant(){
        return $this->hasOne(\App\Models\Etudiant::class, 'idEtudiant');
    }
    public function admin(){
        return $this->hasOne(\App\Models\Admin::class, 'idAdmin');
    }
    public function enseignant(){
        return $this->hasOne(\App\Models\Enseignant::class, 'idEnseignant');
    }
    public function resp(){
        return $this->hasOne(\App\Models\Resp::class, 'idResp');
    }

    protected $hidden = ['password'];

}
