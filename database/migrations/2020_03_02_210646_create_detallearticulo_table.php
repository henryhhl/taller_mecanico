<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDetallearticuloTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detallearticulo', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idventa')->unsigned();
            $table->integer('idarticulo')->unsigned();
            $table->decimal('cantidad', 12, 2);
            $table->string('estadoarticulo')->nullable();
            $table->string('observacion')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->timestamps();
            $table->foreign('idventa')->references('id')->on('venta')->ondelete('cascade');
            $table->foreign('idarticulo')->references('id')->on('articulo')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detallearticulo');
    }
}