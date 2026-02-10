<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $table = 'commissions';
    protected $primaryKey = 'idCommission';
    public $timestamps = false;
    protected $fillable = [
        'filiere',
        'dateFin'
    ];
    use HasFactory;
}
