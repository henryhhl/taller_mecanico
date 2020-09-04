<?php
use App\Servicio;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ServicioTableSeeder extends Seeder
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
            Servicio::create($d);
        }
    }
    private function _get_data()
    {
        $mytime = Carbon::now('America/La_paz');
        return [
            [
                'idmarca' => 1,
                'idcategoria' => 1,
                'descripcion' => 'INSTLACION DE CLUTCH',
                'codigo' => '164',
                'categoria' => 'AUTOMOVILES',
                'precio' => 75.0,
                'costo' => 40.0,
                'incremento' => 0,
                'comision' => 0,
                'stockactual' => 10,
                'stockmin' => 4,
                'stockmax' => 20,
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //1
            [
                'idmarca' => 2,
                'idcategoria' => 2,
                'descripcion' => 'TUNE UPS',
                'codigo' => '165',
                'categoria' => 'FILTRO',
                'precio' => 100.0,
                'costo' => 50.0,
                'incremento' => 0,
                'comision' => 0,
                'stockactual' => 10,
                'stockmin' => 4,
                'stockmax' => 20,
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //2
            [
                'idmarca' => 3,
                'idcategoria' => 3,
                'descripcion' => 'CAMBIOS DE ACEITE',
                'codigo' => '168',
                'categoria' => 'MOTOR',
                'precio' => 85.0,
                'costo' => 40.0,
                'incremento' => 0,
                'comision' => 0,
                'stockactual' => 10,
                'stockmin' => 4,
                'stockmax' => 20,
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //3
            [
                'idmarca' => 4,
                'idcategoria' => 10,
                'descripcion' => 'R. T. V',
                'codigo' => '168',
                'categoria' => 'EMBRAGUE',
                'precio' => 40.0,
                'costo' => 40.0,
                'incremento' => 0,
                'comision' => 0,
                'stockactual' => 10,
                'stockmin' => 4,
                'stockmax' => 20,
                'fecha'       => $mytime->toDateString(),
                'hora'        => $mytime->toTimeString(),
            ], //4
           
        ];
    }
}
