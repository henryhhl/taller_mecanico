<?php

use App\Articulo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ArticuloTableSeeder extends Seeder
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
            Articulo::create($d);
        }
    }
    private function _get_data()
    {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'descripcion' => 'Discos de freno',
                'precio' => '50.0',
                'stock' => '10',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'descripcion' => 'Liquidos de Freno',
                'precio' => '20.0',
                'stock' => '50',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'descripcion' => 'Pasador de Pastillas de Freno',
                'precio' => '30.0',
                'stock' => '15',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'descripcion' => 'Filtro de Aire',
                'precio' => '40.0',
                'stock' => '14',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'descripcion' => 'Filtro de Aceite',
                'precio' => '60.0',
                'stock' => '8',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'descripcion' => 'Varilla de Aceite',
                'precio' => '30.0',
                'stock' => '13',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
            [
                'descripcion' => 'Juego de Juntas de Culata',
                'precio' => '50.0',
                'stock' => '10',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //7
            [
                'descripcion' => 'Bomba Aceite',
                'precio' => '40.0',
                'stock' => '7',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //8
            [
                'descripcion' => 'Cojinete de Rueda',
                'precio' => '20.0',
                'stock' => '16',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //9
            [
                'descripcion' => 'Mangueta',
                'precio' => '15.0',
                'stock' => '2',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //10
            [
                'descripcion' => 'Puente',
                'precio' => '40.0',
                'stock' => '50',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //11
            [
                'descripcion' => 'Faros Delanteros',
                'precio' => '50.0',
                'stock' => '9',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //12
            [
                'descripcion' => 'Paso de Rueda',
                'precio' => '40.0',
                'stock' => '8',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //13
            [
                'descripcion' => 'Amortiguadores de Capo',
                'precio' => '70.0',
                'stock' => '5',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //14
        ];
    }
}
