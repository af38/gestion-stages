<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeanceEncadrement extends Model
{
    use HasFactory;

    protected $table = 'seanacesEncadrement';
    protected $primaryKey = 'idSeance';
    public $timestamps = false;
    protected $fillable = [
        'idEnseignant',
        'idEtudiant',
        'dateSeance',
        'heureSeance'
    ];
}
