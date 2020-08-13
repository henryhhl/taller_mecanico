<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Detalle_Permiso extends Model
{
    protected $table = 'detalle_permiso';

    protected $primaryKey = 'id';

    protected $fillable = [
        'idpermiso', 'idrol', 'estado',
    ];
}
