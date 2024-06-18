<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Thiagoprz\CompositeKey\HasCompositeKey;

class RejoindreComm extends Model
{
    use HasCompositeKey;
    use HasFactory;

    protected $table = 'rejoindrecomm';
    protected $primaryKey = ['idCommission', 'idEnseignant'];
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'idCommission',
        'idEnseignant',
    ];

}
