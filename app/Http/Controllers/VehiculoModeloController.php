<?php

namespace App\Http\Controllers;

use App\Functions;
use App\Modelo;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VehiculoModeloController extends Controller
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
                $data = DB::table('modelo as mod')
                    ->join('marca as ma', 'mod.idmarca', '=', 'ma.id')
                    ->select('mod.id', 'mod.descripcion', 'ma.descripcion as marca')
                    ->where('mod.estado', '=', 'A')
                    ->orderBy('ma.id', 'asc')
                    ->paginate(10);
            }else {
                $data = DB::table('modelo as mod')
                    ->join('marca as ma', 'mod.idmarca', '=', 'ma.id')
                    ->select('mod.id', 'mod.descripcion', 'ma.descripcion as marca')
                    ->where(function ($query) use ($search, $searchlike) {
                        return $query->orWhere('mod.descripcion', $searchlike, '%'.$search.'%')
                            ->orWhere('ma.descripcion', $searchlike, '%'.$search.'%');
                    })
                    ->where('mod.estado', '=', 'A')
                    ->orderBy('ma.id', 'asc')
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
            $data->modelo = '1';
        }
        if ($bandera == 2) {
            $data->modelocreate = '1';
        }
        if ($bandera == 3) {
            $data->modeloedit = '1';
        }
        if ($bandera == 4) {
            $data->modeloshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();


        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('modelo')->get() );
            return ' LISTADO DE MODELO MARCA: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('modelocreate')->get() );
            return ' NUEVO MODELO MARCA: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('modeloedit')->get() );
            return ' EDITAR MODELO MARCA: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('modeloshow')->get() );
        return ' DETALLE MODELO MARCA: ' . $cantidad;
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

            $vehiculomarca = DB::table('marca')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data'      => $vehiculomarca,
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
            $idmarca = $request->input('idmarca');

            $data = DB::table('modelo')
                ->where('descripcion', '=', $descripcion)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Modelo();
            $data->descripcion = $descripcion;
            $data->idmarca = $idmarca;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            $modelo = DB::table('modelo as v')
                ->where('v.estado', '=', 'A')
                ->where('v.idmarca', '=', $idmarca)
                ->orderBy('v.id', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data'     => $data,
                'modelo'   => $modelo,
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
            
            $data = DB::table('modelo as mod')
                ->join('marca as m', 'mod.idmarca', '=', 'm.id')
                ->select('m.id', 'mod.descripcion', 'm.descripcion as marca')
                ->where('mod.estado', '=', 'A')
                ->where('mod.id', '=', $id)
                ->first();
            
            $vehiculomarca = DB::table('marca')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'vehiculomarca'  => $vehiculomarca,
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
            $idmarca = $request->input('idmarca');
            $id = $request->input('id');

            $data = Modelo::find($id);

            if ($data->descripcion != $descripcion) {
                $vehiculo = DB::table('modelo')
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
            $data->idmarca = $idmarca;
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

            $id = $request->input('idmodelo');

            $getdata = DB::table('vehiculo')
                ->where('idmodelo', '=', $id)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = Modelo::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('modelo as mod')
                ->join('marca as ma', 'mod.idmarca', '=', 'ma.id')
                ->select('mod.id', 'mod.descripcion', 'ma.descripcion as marca')
                ->where('mod.estado', '=', 'A')
                ->orderBy('ma.id', 'asc')
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
