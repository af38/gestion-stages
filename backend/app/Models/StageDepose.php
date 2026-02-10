<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Thiagoprz\CompositeKey\HasCompositeKey;

class StageDepose extends Model{
    use HasFactory;
    use HasCompositeKey;

    protected $table = 'stagedepose';
    protected $primaryKey = ['idEtudiant','idStage'];
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = [
        'idEtudiant',
        'idStage',
        'etat',
    ];

    public function etudiant()
    {
        return $this->belongsTo(\App\Models\Etudiant::class, 'idEtudiant');
    }
}
