<?php

namespace App\Http\Controllers;

use App\Mecanico;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class MecanicoController extends Controller
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
            $nropaginate = $request->input('nropaginate', 10);

            if ($search == null) {
                $data = DB::table('mecanico')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate($nropaginate);
            }else {
                $data = DB::table('mecanico')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'ILIKE', '%'.$search.'%')
                            ->orWhere('apellido', 'ILIKE', '%'.$search.'%')
                            ->orWhere('celular', 'ILIKE', '%'.$search.'%')
                            ->orWhere('direccion', 'ILIKE', '%'.$search.'%')
                            ->orWhere('telefono', 'ILIKE', '%'.$search.'%');
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

        $data = new Visitas();
        if ($bandera == 1) {
            $data->mecanico = '1';
        }
        if ($bandera == 2) {
            $data->mecanicocreate = '1';
        }
        if ($bandera == 3) {
            $data->mecanicoedit = '1';
        }
        if ($bandera == 4) {
            $data->mecanicoshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('mecanico')->get() );
            return ' LISTADO DE MECANICO: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('mecanicocreate')->get() );
            return ' NUEVO MECANICO: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('mecanicoedit')->get() );
            return ' EDITAR MECANICO: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('mecanicoshow')->get() );
        return ' DETALLE MECANICO: ' . $cantidad;
    }

    public function search_name(Request $request)
    {
        try {

            $search = $request->input('search', null);
            $nropaginate = $request->input('nropaginate', 20);

            if ($search == null) {
                $data = DB::table('mecanico')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate($nropaginate);
            }else {
                $data = DB::table('mecanico')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'ILIKE', '%'.$search.'%')
                            ->orWhere('apellido', 'ILIKE', '%'.$search.'%')
                            ->orWhere(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ILIKE', '%'.$search.'%');
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
            
            $data = DB::table('mecanico')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => sizeof($data) + 1,
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

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $telefono = $request->input('telefono');
            $ciudad = $request->input('ciudad');
            $direccion = $request->input('direccion');
            $celular = $request->input('celular');
            $provincia = $request->input('provincia');
            $email = $request->input('email');
            $ci = $request->input('ci');
            $genero = $request->input('genero');


            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'mecanico-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/mecanico/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/mecanico/', $nuevoNombre);

            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Mecanico();
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->telefono = $telefono;
            $data->ciudad = $ciudad;
            $data->direccion = $direccion;
            $data->genero = $genero;
            $data->provincia = $provincia;
            $data->celular = $celular;
            $data->email = $email;
            $data->ci = $ci;
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
                ]
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
            
            $data = DB::table('mecanico')
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

            $bandera = $request->input('bandera');
            $id = $request->input('id');

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $telefono = $request->input('telefono');
            $ciudad = $request->input('ciudad');
            $direccion = $request->input('direccion');
            $celular = $request->input('celular');
            $provincia = $request->input('provincia');
            $email = $request->input('email');
            $ci = $request->input('ci');
            $genero = $request->input('genero');


            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen') && $bandera == 1){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'mecanico-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/mecanico/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/mecanico/', $nuevoNombre);

            }

            $data = Mecanico::find($id);
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->telefono = $telefono;
            $data->ciudad = $ciudad;
            $data->direccion = $direccion;
            $data->genero = $genero;
            $data->provincia = $provincia;
            $data->celular = $celular;
            $data->email = $email;
            $data->ci = $ci;
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
                ]
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

            $id = $request->input('idmecanico');

            $getdata = DB::table('detalleventa')
                ->where('idmecanico', '=', $id)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = Mecanico::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('mecanico')
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
                ]
            ]);
        }
    }
}
