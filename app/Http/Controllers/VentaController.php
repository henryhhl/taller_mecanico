<?php

namespace App\Http\Controllers;

use App\DetalleVenta;
use App\Venta;
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
                    ->where(function ($query) use ($search, $number) {
                        return $query->orWhere(DB::raw("CONCAT(cl.nombre, ' ',cl.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('veh.placa', 'LIKE', '%'.$search.'%')
                            ->orWhere('cl.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('cl.apellido', 'LIKE', '%'.$search.'%')
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
        //
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

}
