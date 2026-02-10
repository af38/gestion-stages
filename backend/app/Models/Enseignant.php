<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    protected $table = 'enseignants';
    protected $primaryKey = 'idEnseignant';
    public $timestamps = false;
    protected $fillable = [
        'departement'
    ];

    public function utilisateur(){
        return $this->hasOne(\App\Models\Utilisateur::class, 'idUser');
    }
    public function reclamation(){
        return $this->hasMany(\App\Models\Reclamation::class, 'idReclamation');
    }
    use HasFactory;
}
