<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleVenta extends Model
{
    protected $table = 'detalleventa';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idventa', 'idservicio', 'idmecanico', 'precio', 'cantidad', 'montodescuento',
        'descuento', 'tipodescuento', 'nota', 'estadoproceso', 'estado', 'fecha', 'hora',
    ];
}
