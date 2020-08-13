<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculoyearTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculoyear', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculoyear');
    }
}
