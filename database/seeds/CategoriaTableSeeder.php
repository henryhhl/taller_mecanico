<?php

use App\Categoria;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CategoriaTableSeeder extends Seeder
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
            Categoria::create($d);
        }
    }
    private function _get_data() {
        $mytime = Carbon::now('America/La_paz');
        return [];
    }
}
