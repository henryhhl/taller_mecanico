<?php

use App\VehiculoYear;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class VehiculoYearTableSeeder extends Seeder
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
            VehiculoYear::create($d);
        }
    }
    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'descripcion' => '1991',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'descripcion' => '1996',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'descripcion' => '2000',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'descripcion' => '2001',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'descripcion' => '2004',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'descripcion' => '2007',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
            [
                'descripcion' => '2010',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //7
            [
                'descripcion' => '2014',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //8
            [
                'descripcion' => '2016',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //9
            [
                'descripcion' => '2018',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //10
            [
                'descripcion' => '2019',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //11
            [
                'descripcion' => '2020',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //12
        ];
    }
}
