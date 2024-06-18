<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $table = 'stages';
    protected $primaryKey = 'idStage';
    public $timestamps = false;
    protected $fillable = [
        'idEnseignant', //can be null
        'idOrganisme', // can be null
        'intitule',
        'dateDebut',
        'dateFin',
        'etatStage', //new
        'descriptif',
        'objectif', //new
        'specialite',
        'nbreStagaires',
    ];

    public function organisme(){
        return $this->belongsTo(\App\Models\Organisme::class, 'idOrganisme');
    }
    public function passerStage()
    {
        return $this->hasMany(\App\Models\PasserStage::class, 'idStage');
    }
    public function depose()
    {
        return $this->hasOne(\App\Models\StageDepose::class, 'idStage');
    }
    use HasFactory;
}
