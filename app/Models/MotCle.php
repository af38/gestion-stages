<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotCle extends Model
{
    protected $table = 'motscles';
    protected $primaryKey = 'idMotCle';
    public $timestamps = false;
    protected $fillable = [
        'motCle'
    ];

    public function rapports()
    {
        return $this->belongsToMany(\App\Models\Rapport::class, 'rapportmotcle', 'idMotCle', 'idRapport');
    }
    use HasFactory;
}
