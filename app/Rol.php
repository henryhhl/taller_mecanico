<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'rol';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre', 'descripcion', 'estado', 'delete', 'fecha', 'hora',
    ];
}
