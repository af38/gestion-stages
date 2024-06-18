<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use \App\Models\MotCle;

class Rapport extends Model
{
    protected $table = 'rapports';
    protected $primaryKey = 'idRapport';
    public $timestamps = false;
    protected $fillable = [
        'titre',
        'filiere',
        'specialite',
        'annee',
        'lien'
    ];

    public function motcles(){
        return $this->belongsToMany(MotCle::class, 'rapportmotcle', 'idRapport', 'idMotCle');
    }
    use HasFactory;
}
