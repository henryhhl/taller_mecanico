<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    protected $table = 'modelo';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idmarca', 'descripcion', 'estado', 'fecha', 'hora'
    ];
}
