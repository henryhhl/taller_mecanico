<?php

use App\Cliente;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ClienteTableSeeder extends Seeder
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
            Cliente::create($d);
        }
    }
    private function _get_data()
    {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'ci' => '3235589',
                'nombre' => 'MERCEDES INGRID',
                'apellido' => 'PARADA JUSTINIANO',
                'nit' => '4046285',
                'telefono' => '74651255',
                'celular' => '67465187',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'B/ Villa Rosario',
                'email' => 'merecedes21@gmail.com',
                'genero' => 'F',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'ci' => '7780912',
                'nombre' => 'BRIGUITTE GABRIELA',
                'apellido' => 'GUZMAN JIMENEZ',
                'razonsocial' => '215175530',
                'telefono' => '349815878',
                'celular' => '68746512',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'Av Centenario',
                'email' => 'gaby77@gmail.com',
                'genero' => 'F',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'ci' => '7836435',
                'nombre' => 'ROLANDO',
                'apellido' => 'PARADA LOZA',
                'telefono' => '86451278',
                'celular' => '67899978',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Ichilo',
                'direccion' => 'Los Lotes',
                'email' => 'roly@gmail.com',
                'genero' => 'M',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'ci' => '6522165',
                'nombre' => 'SANTIAGO',
                'apellido' => 'MENDEZ LOPEZ',
                'nit' => '213200961',
                'telefono' => '9846525',
                'celular' => '98798462',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Puerto Suarez',
                'direccion' => 'B/ Hilanderia',
                'email' => 'santi984@gmail.com',
                'genero' => 'M',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
            [
                'ci' => '4598339',
                'nombre' => 'FERNANDO',
                'apellido' => 'SEGOVIA CLAROS',
                'nit' => '212020587',
                'telefono' => '33549852',
                'celular' => '69875612',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'La Campana',
                'email' => 'fernando@gmail.com',
                'genero' => 'M',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //5
            [
                'ci' => '9784039',
                'nombre' => 'NEYDER ARIEL ',
                'apellido' => 'NUÑEZ FLORES',
                'nit' => '216049792',
                'telefono' => '65122788',
                'celular' => '69647856',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'Palmira 10',
                'email' => 'meider645@gmail.com',
                'genero' => 'M',   
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //6
            [
                'ci' => '7842096',
                'nombre' => 'ALBERTO JOSE',
                'apellido' => 'TAPIA QUIROZ',
                'nit' => '216088501',
                'telefono' => '68794657',
                'celular' => '76514625',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'B/ Cortez. Zona sur',
                'email' => 'jose856s@gmail.com',
                'genero' => 'M',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //7
            [
                'ci' => '6323276',
                'nombre' => 'MODESTO',
                'apellido' => 'PEREZ QUISPE',
                'nit' => '209048697',
                'telefono' => '365483456',
                'celular' => '78946512',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'B/ Copper C. Galaxia',
                'email' => 'modesto65sa@gmail.com',
                'genero' => 'M',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //8
            [
                'ci' => '10311829',
                'nombre' => 'BENITA',
                'apellido' => 'PADILLA CABA ',
                'nit' => '211070998',
                'telefono' => '65122788',
                'celular' => '69647856',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'B/ Urkupiñaa',
                'email' => 'benitacaba@gmail.com',
                'genero' => 'F',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //9
            [
                'ci' => '7694190',
                'nombre' => 'JANETH',
                'apellido' => 'CALDERON NUÑEZ',
                'nit' => '210005505',
                'telefono' => '+965984651',
                'celular' => '788465126',
                'ciudad' => 'Santa Cruz',
                'provincia' => 'Andrez Ibañez',
                'direccion' => 'Av.Luis Arce',
                'genero' => 'F',
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //10
           
        ];
    }
}
