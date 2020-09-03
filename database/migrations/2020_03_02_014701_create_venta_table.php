<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVentaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venta', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idusuario')->unsigned();
            $table->integer('idcliente')->unsigned()->nullable();
            $table->integer('idvehiculo')->unsigned()->nullable();
            $table->string('codigo')->nullable();
            $table->string('nroficha')->nullable();
            $table->enum('tipodescuento', ['F', 'P', 'N'])->default('N');
            $table->enum('tipoincremento', ['F', 'P', 'N'])->default('N');
            $table->decimal('descuento', 12, 2);
            $table->decimal('incremento', 12, 2);
            $table->decimal('montototal', 12, 2);
            $table->decimal('montodescuento', 12, 2);
            $table->decimal('montoincremento', 12, 2);
            $table->decimal('cantidadtotal', 12, 2);
            $table->date('fechaventa')->nullable();
            $table->time('horaventa')->nullable();
            $table->text('nota')->nullable();
            $table->enum('estadoproceso', ['P', 'E', 'F'])->default('F');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idusuario')->references('id')->on('users')->ondelete('cascade');
            $table->foreign('idcliente')->references('id')->on('cliente')->ondelete('cascade');
            $table->foreign('idvehiculo')->references('id')->on('vehiculo')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('venta');
    }
}
