<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    use HasFactory;
    protected $table = 'etablissement';
    protected $primaryKey = 'idEtablissement';
    public $timestamps = false;
    // public $incrementing = false;
    protected $fillable = [
        'idEtablissement',
        'logo'
    ];

    public function organisme(){
        return $this->hasOne(\App\Models\Organisme::class, 'idOrganisme');
    }
}
