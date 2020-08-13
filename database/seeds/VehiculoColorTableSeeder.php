<?php

use App\VehiculoColor;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class VehiculoColorTableSeeder extends Seeder
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
            VehiculoColor::create($d);
        }
    }
    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'descripcion' => 'Blanco',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'descripcion' => 'Negro',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'descripcion' => 'Plata',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'descripcion' => 'Gris',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'descripcion' => 'Azul',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'descripcion' => 'Rojo',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
            [
                'descripcion' => 'Beige',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //7
            [
                'descripcion' => 'Amarillo',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //8
            [
                'descripcion' => 'Verde',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //9
        ];
    }
}
