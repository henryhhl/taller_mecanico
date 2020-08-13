<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VehiculoImagen extends Model
{
    protected $table = 'vehiculoimagen';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idvehiculo', 'estado', 'imagen',
    ];
}
