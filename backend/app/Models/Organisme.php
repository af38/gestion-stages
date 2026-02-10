<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisme extends Model
{
    protected $table = 'organismes';
    protected $primaryKey = 'idOrganisme';
    public $timestamps = false;
    protected $fillable = [
        'nomOrganisme',
        'nomContact',
        'prenomContact',
        'typeOrganisme',
        'telContact',
        'emailContact',
    ];

    public function adresse(){
        return $this->hasOne(\App\Models\AdresseOrganisme::class, 'idOrganisme');
    }
    public function etablissement(){
        return $this->hasOne(\App\Models\Etablissement::class, 'idEtablissement');
    }
    public function stage(){
        return $this->hasMany(\App\Models\Stage::class, 'idOrganisme');
    }

    use HasFactory;
}
