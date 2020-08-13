<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculo', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idcliente')->unsigned();
            $table->integer('idvehiculotipo')->unsigned();
            $table->integer('idmarca')->unsigned();
            $table->integer('idmodelo')->unsigned();
            $table->integer('idvehiculocolor')->unsigned();
            $table->integer('idvehiculoyear')->unsigned();
            $table->string('placa');
            $table->string('nroserie')->nullable();
            $table->string('observacion')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idcliente')->references('id')->on('cliente')->ondelete('cascade');
            $table->foreign('idvehiculotipo')->references('id')->on('vehiculotipo')->ondelete('cascade');
            $table->foreign('idmodelo')->references('id')->on('modelo')->ondelete('cascade');
            $table->foreign('idmarca')->references('id')->on('marca')->ondelete('cascade');
            $table->foreign('idvehiculocolor')->references('id')->on('vehiculocolor')->ondelete('cascade');
            $table->foreign('idvehiculoyear')->references('id')->on('vehiculoyear')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculo');
    }
}
