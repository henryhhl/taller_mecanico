<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mecanico extends Model
{
    protected $table = 'mecanico';

    protected $primaryKey = 'id';

    protected $fillable = [
        'ci', 'nombre', 'apellido', 'te1efono', 'ciudad', 'provincia', 'direccion', 'email',
        'celular', 'imagen', 'genero', 'estado', 'fecha', 'hora',
    ];
}
