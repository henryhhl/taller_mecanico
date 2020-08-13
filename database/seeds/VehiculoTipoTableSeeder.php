<?php

use App\VehiculoTipo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class VehiculoTipoTableSeeder extends Seeder
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
            VehiculoTipo::create($d);
        }
    }
    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'descripcion' => 'Motocicleta',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'descripcion' => 'Motocarro',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'descripcion' => 'Automovil de 3 ruedas',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'descripcion' => 'Quad',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'descripcion' => 'Autobus',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'descripcion' => 'Vehiculo Particular',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
        ];
    }
}
