<?php

use App\Mecanico;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MecanicoTableSeeder extends Seeder
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
            Mecanico::create($d);
        }
    }
    private function _get_data()
    {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'ci' => '8250452',
                'nombre' => 'JULIO CESAR',
                'apellido' => 'ACUÑA AGUILERA',
                'telefono' => '68489221',
                'celular' => '75621697',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'El Quior',
                'email' => 'juli@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'ci' => '7822364',
                'nombre' => 'MIGUEL ANGEL',
                'apellido' => 'GUZMAN JIMENEZ',
                'telefono' => '334765112',
                'celular' => '69485621',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'Plan 3000',
                'email' => 'miki@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'ci' => '4622273',
                'nombre' => 'JORGE ANTONIO',
                'apellido' => 'MURILLO SANJINEZ',
                'telefono' => '34965524',
                'celular' => '6999748',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Ichilo',
                'direccion' => 'Av. Siempre Viva',
                'email' => 'antony@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'ci' => '6522165',
                'nombre' => 'SEBASTIAN',
                'apellido' => 'MENDEZ LOPEZ',
                'telefono' => '3365481',
                'celular' => '745622146',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Puerto Suarez',
                'direccion' => 'B/ 04 de Octubre',
                'email' => 'sebas@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'ci' => '3256859',
                'nombre' => 'EMILIO JUNIOR ',
                'apellido' => 'MENDEZ LOPEZ',
                'telefono' => '3337865',
                'celular' => '79846155',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'Av 21 de Septiembre',
                'email' => 'junior@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'ci' => '5406805',
                'nombre' => 'CARLOS LEONEL',
                'apellido' => 'NUÑEZ FLORES',
                'telefono' => '33648518',
                'celular' => '7546555',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'B/ Plan 4000',
                'email' => 'carlos@gmail.com',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
           
        ];
    }
}
