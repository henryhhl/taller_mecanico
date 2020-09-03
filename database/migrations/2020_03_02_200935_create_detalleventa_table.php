<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDetalleventaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalleventa', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idventa')->unsigned();
            $table->integer('idservicio')->unsigned();
            $table->integer('idmecanico')->unsigned()->nullable();
            $table->integer('idpromociondetalle')->unsigned()->nullable();
            $table->decimal('precio', 12, 2);
            $table->decimal('cantidad', 12, 2);
            $table->decimal('descuento', 12, 2);
            $table->decimal('montodescuento', 12, 2);
            $table->enum('tipodescuento', ['P', 'F'])->default('P');
            $table->text('nota')->nullable();
            $table->enum('estadoproceso', ['P', 'E', 'F'])->default('F');
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idventa')->references('id')->on('venta')->ondelete('cascade');
            $table->foreign('idservicio')->references('id')->on('servicio')->ondelete('cascade');
            $table->foreign('idmecanico')->references('id')->on('mecanico')->ondelete('cascade');
            $table->foreign('idpromociondetalle')->references('id')->on('detalle_promocion')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalleventa');
    }
}
