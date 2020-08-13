<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VehiculoYear extends Model
{
    protected $table = 'vehiculoyear';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'estado', 'fecha', 'hora'
    ];
}
