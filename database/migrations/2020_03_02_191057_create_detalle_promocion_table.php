<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDetallePromocionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalle_promocion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idpromocion')->unsigned()->nullable();
            $table->integer('idservicio')->unsigned()->nullable();
            $table->decimal('precio', 12, 2)->nullable();
            $table->decimal('preciodescuento', 12, 2)->nullable();
            $table->integer('cantidad')->nullable();
            $table->integer('descuento')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idpromocion')->references('id')->on('promocion')->ondelete('cascade');
            $table->foreign('idservicio')->references('id')->on('servicio')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detalle_promocion');
    }
}
