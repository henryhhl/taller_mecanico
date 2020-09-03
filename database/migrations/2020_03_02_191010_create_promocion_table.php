<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePromocionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('promocion', function (Blueprint $table) {
            $table->increments('id');
            $table->text('descripcion')->nullable();
            $table->integer('descuento')->nullable();
            $table->date('fechainicio')->nullable();
            $table->date('fechafinal')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
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
        Schema::dropIfExists('promocion');
    }
}
