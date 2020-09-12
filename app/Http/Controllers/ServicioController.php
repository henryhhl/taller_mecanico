<?php

namespace App\Http\Controllers;

use App\Servicio;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ServicioController extends Controller
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
                $data = DB::table('servicio')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('servicio')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('descripcion', 'LIKE', '%'.$search.'%')
                            ->orWhere('precio', 'ILIKE', '%'.$search.'%');
                    })
                    ->where('estado', '=', 'A')
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
            ]);

        }catch(\Exception $th) {
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

    public function getvisitasitio($bandera) {

        $data = new Visitas();
        if ($bandera == 1) {
            $data->producto = '1';
        }
        if ($bandera == 2) {
            $data->productocreate = '1';
        }
        if ($bandera == 3) {
            $data->productoedit = '1';
        }
        if ($bandera == 4) {
            $data->productoshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('producto')->get() );
            return ' LISTADO DE SERVICIO: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('productocreate')->get() );
            return ' NUEVO SERVICIO: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('productoedit')->get() );
            return ' EDITAR SERVICIO: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('productoshow')->get() );
        return ' DETALLE SERVICIO: ' . $cantidad;
    }


    public function get_data()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('servicio')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->paginate(10);

            $categoria = DB::table('categoria')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
                ->paginate(10);

            $articulo = DB::table('articulo')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
                ->paginate(10);

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

                'categoria' => $categoria,
                'categoria_pagination' => [
                    'total'        => $categoria->total(),
                    'current_page' => $categoria->currentPage(),
                    'per_page'     => $categoria->perPage(),
                    'last_page'    => $categoria->lastPage(),
                    'from'         => $categoria->firstItem(),
                    'to'           => $categoria->lastItem(),
                ],

                'articulo' => $articulo,
                'articulo_pagination' => [
                    'total'        => $articulo->total(),
                    'current_page' => $articulo->currentPage(),
                    'per_page'     => $articulo->perPage(),
                    'last_page'    => $articulo->lastPage(),
                    'from'         => $articulo->firstItem(),
                    'to'           => $articulo->lastItem(),
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
                ],
            ]);
        }
    }

    public function search_decripcion(Request $request)
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
            $nropaginate = $request->input('nropaginate', 20);

            if ($search == null) {
                $data = DB::table('servicio')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate($nropaginate);
            }else {
                $data = DB::table('servicio')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('descripcion', 'ILIKE', '%'.$search.'%');
                    })
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate($nropaginate);
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

        }catch(\Exception $th) {
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
            
            $marca = DB::table('marca')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            $categoria = DB::table('categoria')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'marca' => $marca,
                'categoria' => $categoria,
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
                ],
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

            $tipo = $request->input('tipo');
            $codigo = $request->input('codigo', null);
            $descripcion = $request->input('descripcion');
            $idcategoria = $request->input('idcategoria');
            $idmarca = $request->input('idmarca');
            $stockactual = $request->input('stockactual');
            $stockmin = $request->input('stockmin');
            $stockmax = $request->input('stockmax');
            $comision = $request->input('comision');
            $costo = $request->input('costo');
            $tipoincremento = $request->input('tipoincremento');
            $incremento = $request->input('incremento');
            $precio = $request->input('precio');
            $nota = $request->input('nota');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            $data = DB::table('servicio')
                ->where('descripcion', '=', $descripcion)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response' => -1,
                ]);
            }

            if ($codigo != null) {
                $data = DB::table('servicio')
                    ->where('codigo', '=', $codigo)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($data) > 0) {
                    return response()->json([
                        'response' => -2,
                    ]);
                }
            }

            if (Input::hasFile('imagen')){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'servicio-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/servicio/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/servicio/', $nuevoNombre);

            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Servicio();
            $data->idmarca = $idmarca;
            $data->idcategoria = $idcategoria;
            $data->descripcion = $descripcion;
            $data->codigo = $codigo;
            $data->tipo = $tipo;
            $data->precio = $precio * 1;
            $data->costo = $costo * 1;
            $data->incremento = $incremento * 1;
            $data->tipoincremento = $tipoincremento;
            $data->comision = $comision;
            $data->stockactual = $stockactual;
            $data->stockmin = $stockmin;
            $data->stockmax = $stockmax;
            $data->nota = $nota;
            $data->imagen = $request->input('foto');
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data'     => $data,
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('servicio as s')
                ->leftJoin('marca as m', 's.idmarca', '=', 'm.id')
                ->leftJoin('categoria as c', 's.idcategoria', '=', 'c.id')
                ->select('s.*', 'm.descripcion as marca', 'c.descripcion as categoria')
                ->where('s.estado', '=', 'A')
                ->where('s.id', '=', $id)
                ->first();

            $marca = DB::table('marca')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            $categoria = DB::table('categoria')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'marca' => $marca,
                'categoria' => $categoria,
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
                ],
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

            $tipo = $request->input('tipo');
            $codigo = $request->input('codigo');
            $descripcion = $request->input('descripcion');
            $idcategoria = $request->input('idcategoria');
            $idmarca = $request->input('idmarca');
            $stockactual = $request->input('stockactual');
            $stockmin = $request->input('stockmin');
            $stockmax = $request->input('stockmax');
            $comision = $request->input('comision');
            $costo = $request->input('costo');
            $tipoincremento = $request->input('tipoincremento');
            $incremento = $request->input('incremento');
            $precio = $request->input('precio');
            $nota = $request->input('nota');

            $bandera = $request->input('bandera');
            $id = $request->input('id');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            $data = Servicio::find($id);

            if ($descripcion != $data->descripcion) {

                $servicio = DB::table('servicio')
                    ->where('descripcion', '=', $descripcion)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($servicio) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            if ($codigo != null) {
                if ($codigo != $data->codigo) {
                    $servicio = DB::table('servicio')
                        ->where('codigo', '=', $codigo)
                        ->where('estado', '=', 'A')
                        ->get();

                    if (sizeof($servicio) > 0) {
                        DB::rollBack();
                        return response()->json([
                            'response' => -2,
                        ]);
                    }
                }
            }

            if (Input::hasFile('imagen') && $bandera == 1){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'servicio-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/servicio/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/servicio/', $nuevoNombre);

            }

            $data->idmarca = $idmarca;
            $data->idcategoria = $idcategoria;
            $data->descripcion = $descripcion;
            $data->codigo = $codigo;
            $data->tipo = $tipo;
            $data->precio = $precio * 1;
            $data->costo = $costo * 1;
            $data->incremento = $incremento * 1;
            $data->tipoincremento = $tipoincremento;
            $data->comision = $comision;
            $data->stockactual = $stockactual;
            $data->stockmin = $stockmin;
            $data->stockmax = $stockmax;
            $data->nota = $nota;
            if ($bandera == 1) {
                $data->imagen = $request->input('foto');
            }
            $data->update();

            DB::commit();

            return response()->json([
                'response' => 1,
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {
            DB::beginTransaction();

            $id = $request->input('idservicio');

            $getdata = DB::table('detalleventa')
                ->where('idservicio', '=', $id)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = Servicio::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('servicio')
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
}
