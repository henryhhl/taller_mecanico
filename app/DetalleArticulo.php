<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleArticulo extends Model
{
    protected $table = 'detallearticulo';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idventa', 'idarticulo', 'cantidad', 'estado',
        'observacion', 'fecha', 'hora', 'estadoarticulo',
    ];
}
