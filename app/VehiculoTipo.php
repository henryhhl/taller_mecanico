<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VehiculoTipo extends Model
{
    protected $table = 'vehiculotipo';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'estado', 'fecha', 'hora',
    ];
}
