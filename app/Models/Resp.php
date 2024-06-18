<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Resp extends Model
{
    use HasFactory;

    protected $table = 'resps';
    protected $primaryKey = 'idResp';
    public $timestamps = false;
    protected $fillable = [];

    public function utilisateur(){
        return $this->hasOne(\App\Models\Utilisateur::class, 'idUser');
    }
}
