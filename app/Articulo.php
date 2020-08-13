<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Articulo extends Model
{
    protected $table = 'articulo';

    protected $primaryKey = 'id';

    protected $fillable = [
        'descripcion', 'estado', 'fecha', 'hora',
    ];
}
