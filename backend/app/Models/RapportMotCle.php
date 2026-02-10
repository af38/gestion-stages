<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportMotCle extends Model
{
    use HasFactory;

    protected $table = 'rapportmotcle';
    protected $primaryKey = ['idRapport', 'idMotCle'];
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = ['idRapport', 'idMotCle'];

    public function rapport(){
        return $this->belongsto(\App\Models\Rapport::class, 'idRapport');
    }
    public function motcle(){
        return $this->belongsto(\App\Models\MotCle::class, 'idMotCle');
    }
}
