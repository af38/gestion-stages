<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $table = 'etudiant';
    protected $primaryKey = 'idEtudiant';
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = [
        'dateNaissance',
        'filiere',
        'niveauEtude',
        'cne',
        'specialite'
    ];

    public function utilisateur(){
        return $this->hasOne(\App\Models\Utilisateur::class, 'idUser');
    }
    public function reclamation(){
        return $this->hasMany(App\Models\Reclamation::class, 'idReclamation');
    }
    use HasFactory;
}
