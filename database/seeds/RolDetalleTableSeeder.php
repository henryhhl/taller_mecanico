<?php

use App\Detalle_Rol;
use Illuminate\Database\Seeder;

class RolDetalleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = $this->_get_data();
        foreach ($data as $d) {
            Detalle_Rol::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                'idusuario'   => 1,
                'idrol'       => 1,
                'estado'      => 'A',
            ], //1
        ];
    }

}
