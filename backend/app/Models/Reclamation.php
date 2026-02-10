<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    protected $table = 'reclamations';
    protected $primaryKey = 'idReclamation';
    public $timestamps = false;
    protected $fillable = [
        'idEnseignant',
        'idEtudiant',
        'objet',
        'etat',
        'description'
    ];
    public function etudiant(){
        return $this->belongsTo(\App\Models\Etudiant::class, 'idEtudiant');
    }
    public function enseignant(){
        return $this->belongsTo(\App\Models\Enseignant::class, 'idEnseignant');
    }
    use HasFactory;
}
