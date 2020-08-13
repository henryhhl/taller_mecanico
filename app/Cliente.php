<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'cliente';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre', 'apellido', 'nit', 'te1efono', 'razonsocial', 'celular', 'ciudad', 'provincia',
        'direccion', 'email', 'imagen', 'genero', 'estado', 'fecha', 'hora',
    ];
}
