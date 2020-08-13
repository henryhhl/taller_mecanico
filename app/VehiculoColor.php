<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VehiculoColor extends Model
{
    protected $table = 'vehiculocolor';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'estado', 'fecha', 'hora'
    ];
}
