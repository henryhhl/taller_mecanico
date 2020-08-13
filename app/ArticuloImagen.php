<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArticuloImagen extends Model
{
    protected $table = 'articuloimagen';

    protected $primaryKey = 'id';

    protected $fillable = [
        'iddetallearticulo', 'imagen', 'estado', 'fecha', 'hora',
    ];
}
