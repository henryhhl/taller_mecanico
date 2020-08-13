<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'venta';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idusuario', 'idcliente', 'idvehiculo', 'codigo', 'nroficha', 'tipodescuento', 'tipoincremento',
        'descuento', 'incremento' ,'montototal', 'montodescuento', 'montoincremento', 'cantidadtotal', 'fechaventa',
        'horaventa', 'nota', 'estadoproceso', 'estado', 'fecha', 'hora',
    ];
}
