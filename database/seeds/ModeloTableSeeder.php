<?php

use App\Modelo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ModeloTableSeeder extends Seeder
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
            Modelo::create($d);
        }
    }
    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [
            [   
                'idmarca'     => 1,
                'descripcion' => 'Wrangler',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [   
                'idmarca'     => 1,
                'descripcion' => 'Cherokee',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [   
                'idmarca'     => 1,
                'descripcion' => 'Renegade',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [   
                'idmarca'     => 1,
                'descripcion' => 'Compass',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [   
                'idmarca'     => 1,
                'descripcion' => 'Grand Cherokee',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            
            [   
                'idmarca'     => 2,
                'descripcion' => 'A7 Sportback',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
            [   
                'idmarca'     => 2,
                'descripcion' => 'A4',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //7
            [   
                'idmarca'     => 2,
                'descripcion' => 'A3/Sportback',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //8
            [   
                'idmarca'     => 2,
                'descripcion' => 'Q5',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //9
            [   
                'idmarca'     => 2,
                'descripcion' => 'Q7',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //10

            [   
                'idmarca'     => 3,
                'descripcion' => '458 Italia',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //11
            [   
                'idmarca'     => 3,
                'descripcion' => '488 GTB',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //12
            [   
                'idmarca'     => 3,
                'descripcion' => 'GTC4Lusso',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //13
            [   
                'idmarca'     => 3,
                'descripcion' => 'FF',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //14
            [   
                'idmarca'     => 3,
                'descripcion' => 'LaFerrari',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //15

            [   
                'idmarca'     => 4,
                'descripcion' => 'EcoSport',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //16
            [   
                'idmarca'     => 4,
                'descripcion' => 'Focus',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //17
            [   
                'idmarca'     => 4,
                'descripcion' => 'Fiesta',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //18
            [   
                'idmarca'     => 4,
                'descripcion' => 'B-Max',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //19
            [   
                'idmarca'     => 4,
                'descripcion' => 'C-MAX/Grand C-MAX',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //20

            [   
                'idmarca'     => 5,
                'descripcion' => 'Jazz',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //21
            [   
                'idmarca'     => 5,
                'descripcion' => 'CR-V',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //22
            [   
                'idmarca'     => 5,
                'descripcion' => 'Civic',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //23
            [   
                'idmarca'     => 5,
                'descripcion' => 'HR-V',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //24
            [   
                'idmarca'     => 5,
                'descripcion' => 'NSX',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //25

            [   
                'idmarca'     => 6,
                'descripcion' => 'Kona',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //26
            [   
                'idmarca'     => 6,
                'descripcion' => 'Tucson',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //27
            [   
                'idmarca'     => 6,
                'descripcion' => 'Ioniq',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //28
            [   
                'idmarca'     => 6,
                'descripcion' => 'i30',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //29
            [   
                'idmarca'     => 6,
                'descripcion' => 'i40',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //30

            [   
                'idmarca'     => 7,
                'descripcion' => 'Clase S',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //31
            [   
                'idmarca'     => 7,
                'descripcion' => 'Clase X',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //32
            [   
                'idmarca'     => 7,
                'descripcion' => 'Clase C',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //33
            [   
                'idmarca'     => 7,
                'descripcion' => 'Clase E',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //34
            [   
                'idmarca'     => 7,
                'descripcion' => 'Clase G',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //35

            [   
                'idmarca'     => 8,
                'descripcion' => 'Eclipse Cross',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //36
            [   
                'idmarca'     => 8,
                'descripcion' => 'ASX',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //37
            [   
                'idmarca'     => 8,
                'descripcion' => 'Outlander',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //38
            [   
                'idmarca'     => 8,
                'descripcion' => 'L200',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //39
            [   
                'idmarca'     => 8,
                'descripcion' => 'Montero',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //40

            [   
                'idmarca'     => 9,
                'descripcion' => 'Leaf',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //41
            [   
                'idmarca'     => 9,
                'descripcion' => 'Qashqai',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //42
            [   
                'idmarca'     => 9,
                'descripcion' => 'X-TRAIL',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //43
            [   
                'idmarca'     => 9,
                'descripcion' => 'Pulsar',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //44
            [   
                'idmarca'     => 9,
                'descripcion' => 'NP300 Navara',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //45

            [   
                'idmarca'     => 10,
                'descripcion' => 'Rav4',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //46
            [   
                'idmarca'     => 10,
                'descripcion' => 'C-hr',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //47
            [   
                'idmarca'     => 10,
                'descripcion' => 'Corolla',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //48
            [   
                'idmarca'     => 10,
                'descripcion' => 'Land Cruiser',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //49
            [   
                'idmarca'     => 10,
                'descripcion' => 'Hilux',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //50

            [   
                'idmarca'     => 11,
                'descripcion' => 'Swift',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //51
            [   
                'idmarca'     => 11,
                'descripcion' => 'Jimny',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //52
            [   
                'idmarca'     => 11,
                'descripcion' => 'Ignis',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //53
            [   
                'idmarca'     => 11,
                'descripcion' => 'Vitara',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //54
            [   
                'idmarca'     => 11,
                'descripcion' => 'SX4 S-Cross',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //55
        ];
    }
}
