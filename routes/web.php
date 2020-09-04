<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/* proceso de instalacion, como crear sitio web, luego tienda virtual */

// https://www.youtube.com/watch?v=Elim33GXrTw&frags=pl%2Cwn prestashop

// https://www.recambioscoche.es/pieza-de-repuesto.html



// $servidor = '/servidor/api';     //servidor
$servidor = '';               //local



$local = '/taller_mecanico';  // local
// $local = '';                     // servidor



Route::get('/', function () {
    return redirect('/login');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::post( $servidor . '/logout', 'HomeController@logout');
Route::get( $servidor . '/home/get_information', 'HomeController@get_information');

Route::get( $servidor . '/usuario/get_information', 'UsuarioController@get_information');

Route::get( $servidor . '/home/sesion', 'HomeController@sesion');

Route::get( $local . '/rol', 'HomeController@index');
Route::get( $local . '/rol/create', 'HomeController@index');
Route::get( $local . '/rol/edit/{id}', 'HomeController@index');

Route::get( $servidor . '/rol/index', 'RolController@index');
Route::get( $servidor . '/rol/create', 'RolController@create');
Route::post($servidor . '/rol/store', 'RolController@store');
Route::get( $servidor . '/rol/edit/{id}', 'RolController@edit');
Route::post( $servidor . '/rol/update', 'RolController@update');
Route::post($servidor . '/rol/delete', 'RolController@destroy');

Route::get( $local . '/asignar_permiso', 'HomeController@index');

Route::get( $servidor . '/permiso/create', 'PermisoController@create');
Route::get( $servidor . '/permiso/select_rol', 'PermisoController@select_rol');
Route::post( $servidor . '/permiso/asignar', 'PermisoController@asignar');

Route::get( $local . '/usuario', 'HomeController@index');
Route::get( $local . '/usuario/create', 'HomeController@index');
Route::get( $local . '/usuario/edit/{id}', 'HomeController@index');

Route::get( $servidor . '/usuario/index', 'UsuarioController@index');
Route::get( $servidor . '/usuario/create', 'UsuarioController@create');
Route::post( $servidor . '/usuario/store', 'UsuarioController@store');
Route::get( $servidor . '/usuario/edit/{id}', 'UsuarioController@edit');
Route::post( $servidor . '/usuario/update', 'UsuarioController@update');
Route::post( $servidor . '/usuario/delete', 'UsuarioController@destroy');

Route::get( $local . '/vehiculo_tipo', 'HomeController@index');
Route::get( $local . '/vehiculo_tipo/create', 'HomeController@index');
Route::get( $local . '/vehiculo_tipo/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo_tipo/index', 'VehiculoTipoController@index');
Route::get( $servidor . '/vehiculo_tipo/create', 'VehiculoTipoController@create');
Route::post( $servidor . '/vehiculo_tipo/store', 'VehiculoTipoController@store');
Route::get( $servidor . '/vehiculo_tipo/edit/{id}', 'VehiculoTipoController@edit');
Route::post( $servidor . '/vehiculo_tipo/update', 'VehiculoTipoController@update');
Route::post( $servidor . '/vehiculotipo/delete', 'VehiculoTipoController@destroy');




Route::get( $local . '/vehiculo_marca/create', 'HomeController@index');
Route::get( $local . '/vehiculo_marca/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo_marca/index', 'VehiculoMarcaController@index');
Route::get( $servidor . '/vehiculo_marca/create', 'VehiculoMarcaController@create');
Route::get( $servidor . '/vehiculo_marca/edit/{id}', 'VehiculoMarcaController@edit');
Route::post( $servidor . '/vehiculo_marca/store', 'VehiculoMarcaController@store');
Route::post( $servidor . '/vehiculo_marca/update', 'VehiculoMarcaController@update');
Route::post( $servidor . '/vehiculo_marca/delete', 'VehiculoMarcaController@destroy');




Route::get( $local . '/vehiculo_modelo/create', 'HomeController@index');
Route::get( $local . '/vehiculo_modelo/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo_modelo/index', 'VehiculoModeloController@index');
Route::get( $servidor . '/vehiculo_modelo/create', 'VehiculoModeloController@create');
Route::get( $servidor . '/vehiculo_modelo/edit/{id}', 'VehiculoModeloController@edit');
Route::post( $servidor . '/vehiculo_modelo/store', 'VehiculoModeloController@store');
Route::post( $servidor . '/vehiculo_modelo/update', 'VehiculoModeloController@update');
Route::post( $servidor . '/vehiculo_modelo/delete', 'VehiculoModeloController@destroy');



Route::get( $local . '/vehiculo_color/create', 'HomeController@index');
Route::get( $local . '/vehiculo_color/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo_color/index', 'VehiculoColorController@index');
Route::get( $servidor . '/vehiculo_color/create', 'VehiculoColorController@create');
Route::get( $servidor . '/vehiculo_color/edit/{id}', 'VehiculoColorController@edit');
Route::post( $servidor . '/vehiculo_color/store', 'VehiculoColorController@store');
Route::post( $servidor . '/vehiculo_color/update', 'VehiculoColorController@update');
Route::post( $servidor . '/vehiculo_color/delete', 'VehiculoColorController@destroy');



Route::get( $local . '/vehiculo_year/create', 'HomeController@index');
Route::get( $local . '/vehiculo_year/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo_year/index', 'VehiculoYearController@index');
Route::get( $servidor . '/vehiculo_year/create', 'VehiculoYearController@create');
Route::get( $servidor . '/vehiculo_year/edit/{id}', 'VehiculoYearController@edit');
Route::post( $servidor . '/vehiculo_year/store', 'VehiculoYearController@store');
Route::post( $servidor . '/vehiculo_year/update', 'VehiculoYearController@update');
Route::post( $servidor . '/vehiculo_year/delete', 'VehiculoYearController@destroy');



Route::get( $local . '/cliente', 'HomeController@index');
Route::get( $local . '/cliente/create', 'HomeController@index');
Route::get( $local . '/cliente/editar/{id}', 'HomeController@index');


Route::get( $servidor . '/cliente/index', 'ClienteController@index');
Route::get( $servidor . '/cliente/search_name', 'ClienteController@search_name');
Route::get( $servidor . '/cliente/create', 'ClienteController@create');
Route::post( $servidor . '/cliente/store', 'ClienteController@store');
Route::get( $servidor . '/cliente/edit/{id}', 'ClienteController@edit');
Route::post( $servidor . '/cliente/update', 'ClienteController@update');
Route::post( $servidor . '/cliente/delete', 'ClienteController@destroy');
Route::get( $servidor . '/cliente/searchcliente', 'ClienteController@searchcliente');
Route::get( $servidor . '/cliente/getultimo', 'ClienteController@getultimo');




Route::get( $local . '/vehiculo', 'HomeController@index');
Route::get( $local . '/vehiculo/create', 'HomeController@index');
Route::get( $local . '/vehiculo/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/vehiculo/index', 'VehiculoController@index');
Route::get( $servidor . '/vehiculo/get_data', 'VehiculoController@get_data');
Route::get( $servidor . '/vehiculo/create', 'VehiculoController@create');
Route::post( $servidor . '/vehiculo/store', 'VehiculoController@store');
Route::get( $servidor . '/vehiculo/edit/{id}', 'VehiculoController@edit');
Route::post( $servidor . '/vehiculo/update', 'VehiculoController@update');
Route::post( $servidor . '/vehiculo/delete', 'VehiculoController@destroy');
Route::get( $servidor . '/vehiculo/get_modelomarca', 'VehiculoController@get_modelomarca');



Route::get( $local . '/mecanico', 'HomeController@index');
Route::get( $local . '/mecanico/create', 'HomeController@index');
Route::get( $local . '/mecanico/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/mecanico/index', 'MecanicoController@index');
Route::get( $servidor . '/mecanico/search_name', 'MecanicoController@search_name');
Route::get( $servidor . '/mecanico/create', 'MecanicoController@create');
Route::post( $servidor . '/mecanico/store', 'MecanicoController@store');
Route::get( $servidor . '/mecanico/edit/{id}', 'MecanicoController@edit');
Route::post( $servidor . '/mecanico/update', 'MecanicoController@update');
Route::post( $servidor . '/mecanico/delete', 'MecanicoController@destroy');

Route::get( $local . '/almacen', 'HomeController@index');
Route::get( $local . '/almacen/create', 'HomeController@index');
Route::get( $local . '/almacen/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/servicio/index', 'ServicioController@index');
Route::get( $servidor . '/servicio/search_decripcion', 'ServicioController@search_decripcion');
Route::get( $servidor . '/servicio/get_data', 'ServicioController@get_data');
Route::get( $servidor . '/servicio/create', 'ServicioController@create');
Route::post( $servidor . '/servicio/store', 'ServicioController@store');
Route::get( $servidor . '/servicio/edit/{id}', 'ServicioController@edit');
Route::post( $servidor . '/servicio/update', 'ServicioController@update');
Route::post( $servidor . '/servicio/delete', 'ServicioController@destroy');




Route::get( $local . '/categoria/create', 'HomeController@index');
Route::get( $local . '/categoria/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/categoria/index', 'CategoriaController@index');
Route::get( $servidor . '/categoria/create', 'CategoriaController@create');
Route::post( $servidor . '/categoria/store', 'CategoriaController@store');
Route::get( $servidor . '/categoria/edit/{id}', 'CategoriaController@edit');
Route::post( $servidor . '/categoria/update', 'CategoriaController@update');
Route::post( $servidor . '/categoria/delete', 'CategoriaController@destroy');



Route::get( $local . '/articulo', 'HomeController@index');
Route::get( $local . '/articulo/create', 'HomeController@index');
Route::get( $local . '/articulo/editar/{id}', 'HomeController@index');


Route::get( $servidor . '/articulo/index', 'ArticuloController@index');
Route::get( $servidor . '/articulo/create', 'ArticuloController@create');
Route::post( $servidor . '/articulo/store', 'ArticuloController@store');
Route::get( $servidor . '/articulo/edit/{id}', 'ArticuloController@edit');
Route::post( $servidor . '/articulo/update', 'ArticuloController@update');
Route::post( $servidor . '/articulo/delete', 'ArticuloController@destroy');


Route::get( $local . '/mantenimiento', 'HomeController@index');
Route::get( $local . '/mantenimiento/create', 'HomeController@index');

Route::get( $servidor . '/venta/index', 'VentaController@index');
Route::get( $servidor . '/venta/create', 'VentaController@create');
Route::post( $servidor . '/venta/store', 'VentaController@store');
Route::post( $servidor . '/venta/delete', 'VentaController@destroy');
Route::get( $servidor . '/venta/vehiculo_cliente', 'VentaController@vehiculo_cliente');


Route::get( $local . '/promocion', 'HomeController@index');
Route::get( $local . '/promocion/create', 'HomeController@index');
Route::get( $local . '/promocion/editar/{id}', 'HomeController@index');

Route::get( $servidor . '/promocion/index', 'PromocionController@index');
Route::get( $servidor . '/promocion/create', 'PromocionController@create');
Route::post( $servidor . '/promocion/store', 'PromocionController@store');
Route::get( $servidor . '/promocion/edit/{id}', 'PromocionController@edit');
Route::post( $servidor . '/promocion/update', 'PromocionController@update');
Route::post( $servidor . '/promocion/delete', 'PromocionController@destroy');


Route::get( $local . '/ajuste', 'HomeController@index');

Route::get( $servidor . '/ajuste/get_data', 'AjusteController@index');
Route::post( $servidor . '/ajuste/store', 'AjusteController@store');


Route::get( $local . '/perfil', 'HomeController@index');

Route::get( $servidor . '/perfil', 'UsuarioController@perfil');
Route::post( $servidor . '/update_perfil', 'UsuarioController@update_perfil');

Route::get( $local . '/reporte_general', 'HomeController@index');


Route::post( $servidor . '/venta/reporte', 'VentaController@reporte');

Route::post( $servidor . '/ajuste/search_general', 'AjusteController@search_general');

