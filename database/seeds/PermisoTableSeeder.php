<?php

use App\Permiso;
use Illuminate\Database\Seeder;

class PermisoTableSeeder extends Seeder
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
            Permiso::create($d);
        }
    }
    private function _get_data() {
        return [
            [
                'idpermiso' => null,
                'nombre'    => 'paquete-seguridad',
            ], //1

            [
                'idpermiso' => 1,
                'nombre'    => 'gestionar-usuario',
            ], //2

            [
                'idpermiso' => 2,
                'nombre'    => 'crear-usuario',
            ], //3
            [
                'idpermiso' => 2,
                'nombre'    => 'editar-usuario',
            ], //4
            [
                'idpermiso' => 2,
                'nombre'    => 'delete-usuario',
            ], //5

            [
                'idpermiso' => 1,
                'nombre'    => 'gestionar-rol',
            ], //6
            [
                'idpermiso' => 6,
                'nombre'    => 'crear-rol',
            ], //7
            [
                'idpermiso' => 6,
                'nombre'    => 'editar-rol',
            ], //8
            [
                'idpermiso' => 6,
                'nombre'    => 'delete-rol',
            ], //9

            [
                'idpermiso' => null,
                'nombre'    => 'paquete-servicio',
            ], //10
            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-servicio',
            ], //11
            [
                'idpermiso' => 11,
                'nombre'    => 'crear-servicio',
            ], //12
            [
                'idpermiso' => 11,
                'nombre'    => 'editar-servicio',
            ], //13
            [
                'idpermiso' => 11,
                'nombre'    => 'delete-servicio',
            ], //14

            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-mecanico',
            ], //15
            [
                'idpermiso' => 15,
                'nombre'    => 'crear-mecanico',
            ], //16
            [
                'idpermiso' => 15,
                'nombre'    => 'editar-mecanico',
            ], //17
            [
                'idpermiso' => 15,
                'nombre'    => 'delete-mecanico',
            ], //18

            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-vehiculo',
            ], //19
            [
                'idpermiso' => 19,
                'nombre'    => 'crear-vehiculo',
            ], //20
            [
                'idpermiso' => 19,
                'nombre'    => 'editar-vehiculo',
            ], //21
            [
                'idpermiso' => 19,
                'nombre'    => 'delete-vehiculo',
            ], //22

            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-cliente',
            ], //23
            [
                'idpermiso' => 23,
                'nombre'    => 'crear-cliente',
            ], //24
            [
                'idpermiso' => 23,
                'nombre'    => 'editar-cliente',
            ], //25
            [
                'idpermiso' => 23,
                'nombre'    => 'delete-cliente',
            ], //26

            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-tipovehiculo',
            ], //27
            [
                'idpermiso' => 27,
                'nombre'    => 'crear-tipovehiculo',
            ], //28
            [
                'idpermiso' => 27,
                'nombre'    => 'editar-tipovehiculo',
            ], //29
            [
                'idpermiso' => 27,
                'nombre'    => 'delete-tipovehiculo',
            ], //30

            [
                'idpermiso' => 10,
                'nombre'    => 'gestionar-articulo',
            ], //31
            [
                'idpermiso' => 31,
                'nombre'    => 'crear-articulo',
            ], //32
            [
                'idpermiso' => 31,
                'nombre'    => 'editar-articulo',
            ], //33
            [
                'idpermiso' => 31,
                'nombre'    => 'delete-articulo',
            ], //34
        ];
    }
}
