<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $table = 'marca';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'estado', 'fecha', 'hora'
    ];
}