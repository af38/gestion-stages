<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdresseOrganisme extends Model
{
    protected $table = 'adresseOrganisme';
    protected $primaryKey = 'idOrganisme';
    public $timestamps = false;
    protected $fillable = [
        'ville',
        'rue',
        'region'
    ];

    public function organisme(){
        return $this->belongsTo(\App\Models\Organismes::class, 'idOrganisme');
    }
    use HasFactory;
}
