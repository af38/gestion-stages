<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Thiagoprz\CompositeKey\HasCompositeKey;

use Illuminate\Database\Eloquent\Model;

class PasserStage extends Model
{
    use HasFactory;
    use HasCompositeKey;

    protected $table = 'passerStage';
    protected $primaryKey = ['idEtudiant', 'idStage'];
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = [
        'idEtudiant',
        'idStage',
        'note',
    ];

    public function etudiant()
    {
        return $this->belongsTo(\App\Models\Etudiant::class, 'idEtudiant');
    }

    public function stage()
    {
        return $this->belongsTo(\App\Models\Stage::class, 'idStage');
    }
}
