<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Detalle_Rol extends Model
{
    protected $table = 'detalle_rol';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idrol', 'idusuario', 'estado'
    ];
}
