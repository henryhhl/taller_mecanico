<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServicioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicio', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idmarca')->unsigned()->nullable();
            $table->integer('idcategoria')->unsigned()->nullable();
            $table->string('descripcion');
            $table->string('codigo')->nullable();
            $table->enum('tipo', ['P', 'S'])->default('S');
            $table->decimal('precio', 12, 2);
            $table->decimal('costo', 12, 2);
            $table->decimal('incremento', 12, 2);
            $table->enum('tipoincremento', ['F', 'P'])->default('F');
            $table->decimal('comision', 12, 2);
            $table->decimal('stockactual', 12, 2);
            $table->decimal('stockmin', 12, 2);
            $table->decimal('stockmax', 12, 2);
            $table->string('nota')->nullable();
            $table->string('imagen')->nullable();
            $table->enum('estado', ['N', 'A'])->default('A');
            $table->date('fecha');
            $table->time('hora');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('idmarca')->references('id')->on('marca')->ondelete('cascade');
            $table->foreign('idcategoria')->references('id')->on('categoria')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('servicio');
    }
}
