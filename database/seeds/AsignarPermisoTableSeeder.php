<?php

use App\Detalle_Permiso;
use App\Permiso;
use Illuminate\Database\Seeder;

class AsignarPermisoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = Permiso::where('estado', '=', 'A')->orderBy('id', 'asc')->get();
        foreach ($data as $d) {
            $detalle = new Detalle_Permiso();
            $detalle->idpermiso = $d->id;
            $detalle->idrol = 1;
            $detalle->estado = 'A';
            $detalle->save();
        }
    }
}
