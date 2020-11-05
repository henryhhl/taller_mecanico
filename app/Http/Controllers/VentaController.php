<?php

namespace App\Http\Controllers;

use App\DetalleVenta;
use App\Functions;
use App\Venta;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $search = $request->input('search', null);
            $number = is_numeric($search) ? $search : -1;

            $func = new Functions();
            $searchlike = $func->searchbd();

            if ($search == null) {

                $data = DB::table('venta as vta')
                    ->leftJoin('cliente as cl', 'vta.idcliente', '=', 'cl.id')
                    ->leftJoin('vehiculo as veh', 'vta.idvehiculo', '=', 'veh.id')
                    ->select('vta.id', 'vta.codigo', 'vta.nroficha', 'vta.descuento', 'vta.montototal', 
                        'vta.montodescuento', 'vta.cantidadtotal', 'vta.nota', 'cl.nombre', 'cl.apellido',
                        'veh.placa'
                    )
                    ->where('vta.estado', '=', 'A')
                    ->orderBy('vta.id', 'desc')
                    ->paginate(10);

            }else {

                $data = DB::table('venta as vta')
                    ->leftJoin('cliente as cl', 'vta.idcliente', '=', 'cl.id')
                    ->leftJoin('vehiculo as veh', 'vta.idvehiculo', '=', 'veh.id')
                    ->select('vta.id', 'vta.codigo', 'vta.nroficha', 'vta.descuento', 'vta.montototal', 
                        'vta.montodescuento', 'vta.cantidadtotal', 'vta.nota', 'cl.nombre', 'cl.apellido',
                        'veh.placa'
                    )
                    ->where(function ($query) use ($search, $number, $searchlike) {
                        return $query->orWhere(DB::raw("CONCAT(cl.nombre, ' ',cl.apellido)"), $searchlike, "%".$search."%")
                            ->orWhere('veh.placa', $searchlike, '%'.$search.'%')
                            ->orWhere('cl.nombre', $searchlike, '%'.$search.'%')
                            ->orWhere('cl.apellido', $searchlike, '%'.$search.'%')
                            ->orWhere('vta.cantidadtotal', '=', $number)
                            ->orWhere('vta.descuento', '=', $number)
                            ->orWhere('vta.montototal', '=', $number);
                    })
                    ->where('vta.estado', '=', 'A')
                    ->orderBy('vta.id', 'desc')
                    ->paginate(10);

            }

            return response()->json([
                'response'   => 1,
                'data'       => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
                'visitasitio' => $this->getvisitasitio(1),
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function getvisitasitio($bandera) {

        $mensaje = '';

        $data = new Visitas();
        if ($bandera == 1) {
            $data->mantenimiento = '1';
        }
        if ($bandera == 2) {
            $data->mantenimientocreate = '1';
        }
        if ($bandera == 3) {
            $data->mantenimientoshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();


        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('mantenimiento')->get() );
            return ' LISTADO DE MATENIMIENTO: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('mantenimientocreate')->get() );
            return ' NUEVO MANTENIMIENTO: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('mantenimientoshow')->get() );
        return ' DETALLE MANTENIMIENTO: ' . $cantidad;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $nroventa = sizeof(DB::table('venta')->where('estado', '=', 'A')->get()) + 1;

            $articulo = DB::table('articulo')->where('estado', '=', 'A')->get();
            
            return response()->json([
                'response' => 1,
                'nroventa' => $nroventa,
                'articulo' =>$articulo,
                'visitasitio' => $this->getvisitasitio(2),
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            $array_producto = json_decode($request->input('array_producto'));
            $mecanico = json_decode($request->input('mecanico'));
            $cliente = json_decode($request->input('cliente'));
            $vehiculo = json_decode($request->input('vehiculo'));
            $codigo = $request->input('codigo', null);
            $fechaventa = $request->input('fechaventa');
            $horaventa = $request->input('horaventa');
            $observaciones = $request->input('observaciones');
            $descuento = $request->input('descuento');
            $montodescuento = $request->input('montodescuento');
            $total = $request->input('total');
            $cantidadtotal = $request->input('cantidadtotal');

            if ($codigo != null) {
                $data = DB::table('venta')
                    ->where([ ['codigo', '=', $codigo], ['estado', '=', 'A'] ])
                    ->get();

                if (sizeof($data) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $nroficha = sizeof( DB::table('venta')->where('fechaventa', '=', $fechaventa)->get() ) + 1;

            $venta = new Venta();

            $venta->idusuario = Auth::user()->id;
            $venta->idcliente = $cliente->idcliente;
            $venta->idvehiculo = $vehiculo->idvehiculo;
            $venta->codigo = $codigo;
            $venta->nroficha = $nroficha;
            $venta->tipodescuento = 'P';
            $venta->tipoincremento = 'P';
            $venta->descuento = $descuento;
            $venta->incremento = 0;
            $venta->montototal = $total;
            $venta->montodescuento = $montodescuento;
            $venta->montoincremento = 0;
            $venta->cantidadtotal = $cantidadtotal;
            $venta->fechaventa = $fechaventa;
            $venta->horaventa = $horaventa;
            $venta->nota = $observaciones;
            $venta->estadoproceso = 'F';
            $venta->estado = 'A';
            $venta->fecha = $fechaventa;
            $venta->hora = $horaventa;

            $venta->save();

            foreach ($array_producto as $key => $value) {
                if ($value->id != null) {
                    
                    $detalle = new DetalleVenta();
                    $detalle->idventa = $venta->id;
                    $detalle->idservicio = $value->id;
                    $detalle->idmecanico = $value->tipo == 'P' ? null : $mecanico->idmecanico;
                    $detalle->precio = $value->precio * 1;
                    $detalle->cantidad = $value->cantidad;
                    $detalle->descuento = $value->descuento;
                    $detalle->montodescuento = $value->montodescuento;
                    $detalle->tipodescuento = 'P';
                    $detalle->nota = $value->nota;
                    $detalle->estadoproceso = 'F';
                    $detalle->estado = 'A';
                    $detalle->fecha = $fechaventa;
                    $detalle->hora = $horaventa;
                    
                    $detalle->save();

                }
            }

            DB::commit();

            return response()->json([
                'response'       => 1,
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ],
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $venta = DB::table('venta as vta')
                ->leftJoin('cliente as cli', 'vta.idcliente', '=', 'cli.id')
                ->leftJoin('vehiculo as veh', 'vta.idvehiculo', '=', 'veh.id')
                ->leftJoin('vehiculotipo as vehtipo', 'veh.idvehiculotipo', '=', 'vehtipo.id')
                ->leftJoin('marca as marc', 'veh.idmarca', '=', 'marc.id')
                ->leftJoin('vehiculocolor as vehcolor', 'veh.idvehiculocolor', '=', 'vehcolor.id')
                ->leftJoin('vehiculoyear as vehyear', 'veh.idvehiculoyear', '=', 'vehyear.id')
                ->leftJoin('modelo as vehmod', 'veh.idmodelo', '=', 'vehmod.id')
                ->select('vta.*', 'cli.nombre', 'cli.apellido', 'cli.razonsocial', 'cli.nit', 'cli.telefono',
                    'cli.email', 'cli.celular', 'veh.placa', 'veh.nroserie',
                    'vehtipo.descripcion as tipo', 'marc.descripcion as marca', 'vehcolor.descripcion as color',
                    'vehyear.descripcion as year', 'vehmod.descripcion as modelo'
                )
                ->where('vta.estado', '=', 'A')
                ->first();

            $detalle = DB::table('detalleventa as det')
                ->leftJoin('mecanico as mec', 'det.idmecanico', '=', 'mec.id')
                ->leftJoin('servicio as serv', 'det.idservicio', '=', 'serv.id')
                ->select('det.*', 'serv.comision',
                    'mec.ci', 'mec.nombre', 'mec.apellido', 'mec.telefono', 'mec.email', 'mec.celular',
                    'serv.descripcion', 'serv.codigo', 'serv.stockactual', 'serv.tipo', 'serv.imagen', 'serv.costo'
                )
                ->where('det.estado', '=', 'A')
                ->where('det.idventa', '=', $id)
                ->get();


            $array_vehiculo = DB::table('vehiculo as veh')
                ->leftJoin('vehiculotipo as vehtipo', 'veh.idvehiculotipo', '=', 'vehtipo.id')
                ->leftJoin('marca as marc', 'veh.idmarca', '=', 'marc.id')
                ->leftJoin('vehiculocolor as vehcolor', 'veh.idvehiculocolor', '=', 'vehcolor.id')
                ->leftJoin('vehiculoyear as vehyear', 'veh.idvehiculoyear', '=', 'vehyear.id')
                ->leftJoin('modelo as vehmod', 'veh.idmodelo', '=', 'vehmod.id')
                ->select('veh.id as idvehiculo', 'veh.nroserie as serie', 'veh.placa', 
                    'vehtipo.descripcion as tipo', 'marc.descripcion as marca', 'vehcolor.descripcion as color',
                    'vehyear.descripcion as year', 'vehmod.descripcion as modelo'
                )
                ->where('veh.idcliente', '=', $venta->idcliente)
                ->orderBy('veh.id')
                ->get();
            
            return response()->json([
                'response' => 1,
                'data' => $venta,
                'detalle' => $detalle,
                'array_vehiculo' => $array_vehiculo,
                'visitasitio' => $this->getvisitasitio(3),
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {

            DB::beginTransaction();

            $id = $request->input('idventa');

            $data = Venta::find($id);
            $data->estado = 'N';
            $data->update();

            $detalle = DB::table('detalleventa')
                ->where([ ['estado', '=', 'A'], ['idventa', '=', $id] ])
                ->get();

            foreach ($detalle as $key => $value) {
                $data = DetalleVenta::find($value->id);
                $data->estado = 'N';
                $data->update();
            }

            $data = DB::table('venta as vta')
                ->leftJoin('cliente as cl', 'vta.idcliente', '=', 'cl.id')
                ->leftJoin('vehiculo as veh', 'vta.idvehiculo', '=', 'veh.id')
                ->select('vta.id', 'vta.codigo', 'vta.nroficha', 'vta.descuento', 'vta.montototal', 
                    'vta.montodescuento', 'vta.cantidadtotal', 'vta.nota', 'cl.nombre', 'cl.apellido',
                    'veh.placa'
                )
                ->where('vta.estado', '=', 'A')
                ->orderBy('vta.id', 'desc')
                ->paginate(10);

            DB::commit();

            return response()->json([
                'response'   => 1,
                'data'       => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
            ]);

        }catch(\Exception $th) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function vehiculo_cliente(Request $request) {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $idcliente = $request->idcliente;

            $vehiculo = DB::table('vehiculo as v')
                ->leftJoin('cliente as c', 'v.idcliente', '=', 'c.id')
                ->leftJoin('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                ->leftJoin('marca as m', 'v.idmarca', '=', 'm.id')
                ->leftJoin('vehiculocolor as vc', 'v.idvehiculocolor', '=', 'vc.id')
                ->select('v.id as idvehiculo', 'v.placa', 'm.descripcion as marca', 'mod.descripcion as modelo',
                    'c.razonsocial', 'c.nit', 'c.telefono', 'c.imagen', 'v.nroserie as serie',
                    DB::raw("CONCAT(c.nombre, ' ',c.apellido) AS cliente"), 'vc.descripcion as color'
                )
                ->where('v.idcliente', '=', $idcliente)
                ->where('v.estado', '=', 'A')
                ->orderBy('v.id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $vehiculo,
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }

    }

    public function reporte(Request $request) {
        try {

            $fechainicio = $request->input('fechainicio');
            $fechafinal = $request->input('fechafinal');
            $montoinicio = $request->input('montoinicio');
            $opcion = $request->input('opcion');
            $montofinal = $request->input('montofinal');
            $venta = $request->input('venta');

            $consulta = [];

            if (!is_null($fechainicio)) {
                if (is_null($fechafinal)) {
                    array_push($consulta, [ 'vent.fecha', '>=', $fechainicio ]);
                }else {
                    array_push($consulta, [ 'vent.fecha', '>=', $fechainicio ]);
                    array_push($consulta, [ 'vent.fecha', '<=', $fechafinal ]);
                }
            }

            if ($opcion != '!') {
                if (!is_null($montoinicio)) {
                    array_push($consulta, [ 'vent.montototal', $opcion, $montoinicio ]);
                }
            }else {
                if (!is_null($montoinicio) && is_null($montofinal)) {
                    array_push($consulta, [ 'vent.montototal', '<=', $montoinicio ]);
                }else {
                    if (!is_null($montoinicio) && !is_null($montofinal)) {
                        array_push($consulta, [ 'vent.montototal', '>=', $montoinicio ]);
                        array_push($consulta, [ 'vent.montototal', '<=', $montofinal ]);
                    }
                }
            }
            array_push($consulta, ['vent.estado', '=', 'A']);

            if ($venta == '1') {
                $data = DB::table('venta as vent')
                    ->leftJoin('cliente as cli', 'vent.idcliente', '=', 'cli.id')
                    ->leftJoin('vehiculo as veh', 'vent.idvehiculo', '=', 'veh.id')
                    ->leftJoin('marca as marc', 'veh.idmarca', '=', 'marc.id')
                    ->leftJoin('users as user', 'vent.idusuario', '=', 'user.id')
                    ->select('cli.nombre as cliente', 'cli.apellido as cliapellido', 'user.nombre as usuario', 'user.apellido as userapellido', 
                        'veh.placa', 'marc.descripcion as marca', 'vent.descuento', 'vent.montototal', 'vent.fecha', 'vent.hora', 'vent.id'
                    )
                    ->where( $consulta )
                    ->orderBy('vent.id')
                    ->get();
            }else {
                $data = DB::table('venta as vent')
                    ->leftJoin('cliente as cli', 'vent.idcliente', '=', 'cli.id')
                    ->leftJoin('vehiculo as veh', 'vent.idvehiculo', '=', 'veh.id')
                    ->leftJoin('marca as marc', 'veh.idmarca', '=', 'marc.id')
                    ->leftJoin('users as user', 'vent.idusuario', '=', 'user.id')
                    ->leftJoin('detalleventa as det', 'vent.id', '=', 'det.idventa')
                    ->leftJoin('servicio as serv', 'det.idservicio', '=', 'serv.id')
                    ->leftJoin('mecanico as mec', 'det.idmecanico', '=', 'mec.id')
                    ->select('cli.nombre as cliente', 'cli.apellido as cliapellido', 'user.nombre as usuario', 'user.apellido as userapellido', 
                        'veh.placa', 'marc.descripcion as marca', 'vent.descuento as decventa', 'vent.montototal', 'vent.fecha', 'vent.hora', 'vent.id',
                        'det.precio', 'det.cantidad', 'det.descuento', 'det.montodescuento', 'serv.descripcion', 'serv.comision',
                        'mec.nombre as mecanico', 'mec.apellido as mecapellido', 'serv.id as idproducto', 'serv.tipo', 'vent.montodescuento as mtodescuento'
                    )
                    ->where( $consulta )
                    ->orderBy('vent.id')
                    ->get();
            }


            return response()->json([
                'response'  => 1,
                'data'      => $data,
                'fechainicio'      => $fechainicio,
            ]);

        }catch(\Exception $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

}
