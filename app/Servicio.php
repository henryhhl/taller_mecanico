<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'servicio';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'precio', 'costo', 'incremento', 'tipoincremento', 'tipo',
        'stockactual', 'stockmin', 'stockmax', 'idmarca', 'idcategoria', 'codigo',
        'comision', 'nota', 'imagen', 'estado', 'fecha', 'hora',
    ];
}
