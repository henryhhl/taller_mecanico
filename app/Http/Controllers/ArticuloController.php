<?php

namespace App\Http\Controllers;

use App\Articulo;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArticuloController extends Controller
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

            if ($search == null) {
                $data = DB::table('articulo')
                    ->where('estado', '=', 'A')
                    ->orderBy('descripcion', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('articulo')
                    ->where('descripcion', 'LIKE', '%'.$search.'%')
                    ->where('estado', '=', 'A')
                    ->orderBy('descripcion', 'desc')
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
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'response' => 0,
            ]);
        }
    }

    public function getvisitasitio($bandera) {

        $mensaje = '';

        if ( is_null( Visitas::first() ) ) {

            $data = new Visitas();
            if ($bandera == 1) {
                $data->articulo = '1';
            }
            if ($bandera == 2) {
                $data->articulocreate = '1';
            }
            if ($bandera == 3) {
                $data->articuloedit = '1';
            }
            if ($bandera == 4) {
                $data->articuloshow = '1';
            }
            $data->save();

        } else {
            $data = Visitas::first();
            if ($bandera == 1) {
                $data->articulo = ( $data->articulo == null ) ? '1' : $data->articulo * 1 + 1;
            }
            if ($bandera == 2) {
                $data->articulocreate = ( $data->articulocreate == null ) ? '1' : $data->articulocreate * 1 + 1;
            }
            if ($bandera == 3) {
                $data->articuloedit = ( $data->articuloedit == null ) ? '1' : $data->articuloedit * 1 + 1;
            }
            if ($bandera == 4) {
                $data->articuloshow = ( $data->articuloshow == null ) ? '1' : $data->articuloshow * 1 + 1;
            }
            $data->update();
        }

        if ($bandera == 1) {
            return ' LISTADO DE ARTICULO: ' . $data->articulo;
        }
        if ($bandera == 2) {
            return ' NUEVO ARTICULO: ' . $data->articulocreate;
        }
        if ($bandera == 3) {
            return ' EDITAR ARTICULO: ' . $data->articuloedit;
        }
        return ' DETALLE ARTICULO: ' . $data->articuloshow;
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

            $data = DB::table('articulo')
                ->where('descripcion', '=', $descripcion)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Articulo();
            $data->descripcion = $descripcion;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

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
            
            $data = DB::table('articulo')
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

            $data = Articulo::find($id);

            if ($data->descripcion != $descripcion) {
                $vehiculo = DB::table('articulo')
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

            $id = $request->input('idarticulo');

            $data = Articulo::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('articulo')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
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
