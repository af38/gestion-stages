<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';
    protected $primaryKey = 'idAdmin';
    public $timestamps = false;
    protected $fillable = [];

    public function utilisateur(){
        return $this->belongsTo(\App\Models\Utilisateur::class);
    }
    use HasFactory;
}
