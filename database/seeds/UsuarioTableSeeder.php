<?php

use App\User;
use Illuminate\Database\Seeder;

class UsuarioTableSeeder extends Seeder
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
            User::create($d);
        }
    }

    private function _get_data() {
        return [
            [
                'nombre'      => 'administrador',
                'apellido'    => 'administra',
                'usuario'     => 'admin',
                'password'    => bcrypt('123123'),
            ], //1
            [
                'nombre'      => 'henry',
                'apellido'    => 'huarachi laime',
                'usuario'     => 'henry',
                'password'    => bcrypt('123123'),
            ], //2
            [
                'nombre'      => 'milton',
                'apellido'    => '',
                'usuario'     => 'milton',
                'password'    => bcrypt('123123'),
            ], //3
        ];
    }

}
