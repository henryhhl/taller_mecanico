<?php

namespace App\Http\Controllers;

use App\Cliente;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ClienteController extends Controller
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
                $data = DB::table('cliente')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('cliente')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('nit', 'LIKE', '%'.$search.'%')
                            ->orWhere('telefono', 'LIKE', '%'.$search.'%');
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
                ]
            ]);
        }
    }

    public function search_name(Request $request)
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
                $data = DB::table('cliente')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->paginate($nropaginate);
            }else {
                $data = DB::table('cliente')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere(DB::raw("CONCAT(nombre, ' ',apellido)"), 'LIKE', '%'.$search.'%')
                            ->orWhere('razonsocial', 'LIKE', '%'.$search.'%');
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

    public function getultimo()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('cliente')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->first();

            return response()->json([
                'response' => 1,
                'data' => $data,
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

    public function searchcliente(Request $request) {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $search = $request->filled('search') ? $request->input('search', null) : null;
            $search = $search == '' ? null : $search;

            if ($search != null) {

                $data = DB::table('cliente')
                    ->where('estado', '=', 'A')
                    ->where( function($query) use ($search) {
                        return $query
                            ->where(DB::raw("CONCAT(nombre, ' ',apellido)"), 'LIKE', '%'.$search.'%')
                            ->orWhere('nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('apellido', 'LIKE', '%'.$search.'%')
                            ->orWhere('razonsocial', 'LIKE', '%'.$search.'%');
                    })
                    ->orderBy('id', 'desc')
                    ->get()->take(20);

            }else {

                $data = DB::table('cliente')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'desc')
                    ->get()->take(20);

            }

            return response()->json([
                'response' => 1,
                'data' => $data,
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
            
            $data = DB::table('cliente')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => sizeof($data) + 1,
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
            $genero = $request->input('genero');
            $nit = $request->input('nit');
            $telefono = $request->input('telefono');
            $razonsocial = $request->input('razonsocial');
            $celular = $request->input('celular');
            $direccion = $request->input('direccion');
            $ciudad = $request->input('ciudad');
            $provincia = $request->input('provincia');
            $email = $request->input('email');


            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'cliente-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/cliente/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/cliente/', $nuevoNombre);

            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Cliente();
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->razonsocial = $razonsocial;
            $data->nit = $nit;
            $data->telefono = $telefono;
            $data->genero = $genero;
            $data->celular = $celular;
            $data->direccion = $direccion;
            $data->ciudad = $ciudad;
            $data->provincia = $provincia;
            $data->email = $email;
            $data->imagen = $rutadelarchivo;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data'     => $data,
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
            
            $data = DB::table('cliente')
                ->where('estado', '=', 'A')
                ->where('id', '=', $id)
                ->first();

            $vehiculo = DB::table('vehiculo as v')
                ->join('marca as m', 'v.idmarca', '=', 'm.id')
                ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                ->select('v.id', 'v.placa', 'm.descripcion as marca', 'mod.descripcion as modelo'
                )
                ->where('v.estado', '=', 'A')
                ->where('v.idcliente', '=', $id)
                ->orderBy('v.id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'vehiculo' => $vehiculo,
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

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $genero = $request->input('genero');
            $nit = $request->input('nit');
            $telefono = $request->input('telefono');
            $razonsocial = $request->input('razonsocial');
            $celular = $request->input('celular');
            $direccion = $request->input('direccion');
            $ciudad = $request->input('ciudad');
            $provincia = $request->input('provincia');
            $email = $request->input('email');
            $id = $request->input('id');
            $bandera = $request->input('bandera');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if ($bandera == 1) {
                if (Input::hasFile('imagen')){
            
                    $imagen = $request->file('imagen');
                    $name = $imagen->getClientOriginalName();
                    $extension = $imagen->getClientOriginalExtension();
                    $nuevoNombre = 'cliente-'.$registro.'.'.$extension;
    
                    $rutadelarchivo = '/img/cliente/'.$nuevoNombre;
    
                    $archivo = Input::file('imagen');
                    $archivo->move(public_path().'/img/cliente/', $nuevoNombre);
    
                }
            }else {
                $rutadelarchivo = $request->input('imagen');
            }

            $data = Cliente::find($id);

            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->razonsocial = $razonsocial;
            $data->nit = $nit;
            $data->telefono = $telefono;
            $data->genero = $genero;
            $data->celular = $celular;
            $data->direccion = $direccion;
            $data->ciudad = $ciudad;
            $data->provincia = $provincia;
            $data->email = $email;

            if ($bandera == 1) {
                $data->imagen = $rutadelarchivo;
            }
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

            $id = $request->input('idcliente');

            $data = Cliente::find($id);

            $getdata = DB::table('vehiculo')
                ->where('idcliente', '=', $id)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($getdata) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data->estado = 'N';
            $data->update();

            $data = DB::table('cliente')
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