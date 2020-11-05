<?php

namespace App\Http\Controllers;

use App\Functions;
use App\VehiculoTipo;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VehiculoTipoController extends Controller
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

            $func = new Functions();
            $searchlike = $func->searchbd();

            if ($search == null) {
                $data = DB::table('vehiculotipo')
                    ->select('id', 'descripcion')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('vehiculotipo')
                    ->select('id', 'descripcion')
                    ->where( [ ['estado', '=', 'A'], ['descripcion', $searchlike, '%'.$search.'%'] ] )
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }

            return response()->json([
                'response' => 1,
                'data' => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
                'search' => $search,
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'response' => 0,
            ]);
        }
    }

    public function getvisitasitio($bandera) {

        $data = new Visitas();
        if ($bandera == 1) {
            $data->vehiculotipo = '1';
        }
        if ($bandera == 2) {
            $data->vehiculotipocreate = '1';
        }
        if ($bandera == 3) {
            $data->vehiculotipoedit = '1';
        }
        if ($bandera == 4) {
            $data->vehiculotiposhow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('vehiculotipo')->get() );
            return ' LISTADO DE VEHICULO TIPO: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('vehiculotipocreate')->get() );
            return ' NUEVO VEHICULO TIPO: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('vehiculotipoedit')->get() );
            return ' EDITAR VEHICULO TIPO: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('vehiculotiposhow')->get() );
        return ' DETALLE VEHICULO TIPO: ' . $cantidad;
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

            return response()->json([
                'response' => 1,
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

            $descripcion = $request->input('descripcion');

            $data = DB::table('vehiculotipo')
                ->where('descripcion', '=', $descripcion)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            $mytime = Carbon::now('America/La_paz');

            $data = new VehiculoTipo();
            $data->descripcion = $descripcion;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            $vehiculotipo = DB::table('vehiculotipo')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response'     => 1,
                'data'         => $data,
                'vehiculotipo' => $vehiculotipo,
            ]);

        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('vehiculotipo')
                ->where('estado', '=', 'A')
                ->where('id', '=', $id)
                ->first();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            DB::beginTransaction();

            $descripcion = $request->input('descripcion');
            $id = $request->input('id');

            $data = VehiculoTipo::find($id);

            if ($data->descripcion != $descripcion) {
                $vehiculo = DB::table('vehiculotipo')
                    ->where('descripcion', '=', $descripcion)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($vehiculo) > 0) {
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            
            $data->descripcion = $descripcion;
            $data->update();

            DB::commit();

            return response()->json([
                'response' => 1,
            ]);

        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
            ]);
        }
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

            $id = $request->input('idvehiculotipo');

            $getdata = DB::table('vehiculo')
                ->where('idvehiculotipo', '=', $id)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = VehiculoTipo::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('vehiculotipo')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->paginate(10);

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
            ]);

        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
            ]);
        }
    }
}
