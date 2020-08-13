<?php

namespace App\Http\Controllers;

use App\Vehiculo;
use App\VehiculoImagen;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function generar_poblada() {
        $data = "\n";
        for ($i=0; $i < 800; $i++) { 

            $index = $i + 1;

            $year = rand(2010, 2020);

            $mes = rand(1, 12);
            $mes = $mes < 10 ? "0".$mes : $mes;

            $dia = rand(1, 28);
            $dia = $dia < 10 ? "0".$dia : $dia;

            $hora = rand(0, 23);
            $hora = $hora < 10 ? "0".$hora : $hora;

            $minuto = rand(0, 59);
            $minuto = $minuto < 10 ? "0".$minuto : $minuto;

            $idcliente = rand(1, 91);

            $idempleado = rand(1, 9); //10248 11077

            $idpedido = 10267 + $index; //10248 11077

            $data .= "INSERT INTO entrega VALUES (".$index.", " .$idcliente. ", " .$idpedido. ", " .$idempleado. ", '" .$year. "-" .$mes. "-" .$dia. "' , '" .$hora. ":" .$minuto. ":00', 'entregado');";
            $data .= "\n";
        }
        $data .= "\n";
        $archivo = fopen(public_path().'/archivo/archivo.sql', 'w+');
        if (fwrite($archivo, $data)) {
            fclose($archivo);
        }
    }

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
                $data = DB::table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.idvehiculotipo', '=', 'vt.id')
                    ->join('cliente as c', 'v.idcliente', '=', 'c.id')
                    ->join('marca as m', 'v.idmarca', '=', 'm.id')
                    ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                    ->select('v.id', 'v.placa', 'm.descripcion as marca',
                        'vt.descripcion as vehiculotipo', 'mod.descripcion as modelo',
                        'c.nombre', 'c.apellido'
                    )
                    ->where('v.estado', '=', 'A')
                    ->orderBy('v.id', 'desc')
                    ->paginate(10);
            }else {
                $data = DB::table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.idvehiculotipo', '=', 'vt.id')
                    ->join('cliente as c', 'v.idcliente', '=', 'c.id')
                    ->join('marca as m', 'v.idmarca', '=', 'm.id')
                    ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                    ->select('v.id', 'v.placa', 'm.descripcion as marca',
                        'vt.descripcion as vehiculotipo', 'mod.descripcion as modelo',
                        'c.nombre', 'c.apellido'
                    )
                    ->where('v.estado', '=', 'A')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('v.placa', 'LIKE', '%'.$search.'%')
                            ->orWhere('m.descripcion', 'LIKE', '%'.$search.'%')
                            ->orWhere('mod.descripcion', 'LIKE', '%'.$search.'%')
                            ->orWhere('vt.descripcion', 'LIKE', '%'.$search.'%');
                    })
                    ->orderBy('v.id', 'desc')
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
                'search' => $search,
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

    public function get_data()
    {
        try {
            //$this->generar_poblada();

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('vehiculo as v')
                ->join('vehiculotipo as vt', 'v.idvehiculotipo', '=', 'vt.id')
                ->join('cliente as c', 'v.idcliente', '=', 'c.id')
                ->join('marca as m', 'v.idmarca', '=', 'm.id')
                ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                ->select('v.id', 'v.placa', 'm.descripcion as marca',
                    'vt.descripcion as vehiculotipo', 'mod.descripcion as modelo',
                    'c.nombre', 'c.apellido'
                )
                ->where('v.estado', '=', 'A')
                ->orderBy('v.id', 'desc')
                ->paginate(10);

            $vehiculotipo = DB::table('vehiculotipo')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->paginate(10);

            $vehiculomarca = DB::table('marca')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->paginate(10);

            $vehiculomodelo = DB::table('modelo as mod')
                ->join('marca as ma', 'mod.idmarca', '=', 'ma.id')
                ->select('mod.id', 'mod.descripcion', 'ma.descripcion as marca')
                ->where('mod.estado', '=', 'A')
                ->orderBy('ma.id', 'asc')
                ->paginate(10);

            $vehiculocolor = DB::table('vehiculocolor')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->paginate(10);

            $vehiculoyear = DB::table('vehiculoyear')
                ->select('id', 'descripcion')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
                ->paginate(10);

            return response()->json([
                'response'   => 1,
                'data'       => $data,
                'vehiculo_pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],

                'vehiculotipo'   => $vehiculotipo,
                'vehiculotipo_pagination' => [
                    'total'        => $vehiculotipo->total(),
                    'current_page' => $vehiculotipo->currentPage(),
                    'per_page'     => $vehiculotipo->perPage(),
                    'last_page'    => $vehiculotipo->lastPage(),
                    'from'         => $vehiculotipo->firstItem(),
                    'to'           => $vehiculotipo->lastItem(),
                ],

                'vehiculomarca'  => $vehiculomarca,
                'vehiculomarca_pagination' => [
                    'total'        => $vehiculomarca->total(),
                    'current_page' => $vehiculomarca->currentPage(),
                    'per_page'     => $vehiculomarca->perPage(),
                    'last_page'    => $vehiculomarca->lastPage(),
                    'from'         => $vehiculomarca->firstItem(),
                    'to'           => $vehiculomarca->lastItem(),
                ],

                'vehiculomodelo' => $vehiculomodelo,
                'vehiculomodelo_pagination' => [
                    'total'        => $vehiculomodelo->total(),
                    'current_page' => $vehiculomodelo->currentPage(),
                    'per_page'     => $vehiculomodelo->perPage(),
                    'last_page'    => $vehiculomodelo->lastPage(),
                    'from'         => $vehiculomodelo->firstItem(),
                    'to'           => $vehiculomodelo->lastItem(),
                ],

                'vehiculocolor'  => $vehiculocolor,
                'vehiculocolor_pagination' => [
                    'total'        => $vehiculocolor->total(),
                    'current_page' => $vehiculocolor->currentPage(),
                    'per_page'     => $vehiculocolor->perPage(),
                    'last_page'    => $vehiculocolor->lastPage(),
                    'from'         => $vehiculocolor->firstItem(),
                    'to'           => $vehiculocolor->lastItem(),
                ],

                'vehiculoyear'   => $vehiculoyear,
                'vehiculoyear_pagination' => [
                    'total'        => $vehiculoyear->total(),
                    'current_page' => $vehiculoyear->currentPage(),
                    'per_page'     => $vehiculoyear->perPage(),
                    'last_page'    => $vehiculoyear->lastPage(),
                    'from'         => $vehiculoyear->firstItem(),
                    'to'           => $vehiculoyear->lastItem(),
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
            
            $cliente = DB::table('cliente')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            $vehiculotipo = DB::table('vehiculotipo')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            $vehiculomarca = DB::table('marca')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            $vehiculoyear = DB::table('vehiculoyear')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
                ->get();

            $vehiculocolor = DB::table('vehiculocolor')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'cliente' => $cliente,
                'tipo' => $vehiculotipo,
                'marca' => $vehiculomarca,
                'year' => $vehiculoyear,
                'color' => $vehiculocolor,
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

            $placa = $request->input('placa');
            $nroserie = $request->input('nroserie');
            $idcliente = $request->input('idcliente');
            $idtipo = $request->input('idtipo');
            $idmarca = $request->input('idmarca');
            $idmodelo = $request->input('idmodelo');
            $idyear = $request->input('idyear');
            $idcolor = $request->input('idcolor');
            $nota = $request->input('nota');

            $data = DB::table('vehiculo')
                ->where('placa', '=', $placa)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($data) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'vehiculo-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/vehiculo/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/vehiculo/', $nuevoNombre);

            }

            $mytime = Carbon::now('America/La_paz');

            $data = new Vehiculo();
            $data->placa = $placa;
            $data->idcliente = $idcliente;
            $data->idvehiculotipo = $idtipo;
            $data->idmarca = $idmarca;
            $data->idmodelo = $idmodelo;
            $data->idvehiculocolor = $idcolor;
            $data->idvehiculoyear = $idyear;
            $data->nroserie = $nroserie;
            $data->observacion = $nota;
            $data->estado = 'A';
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();

            if ($rutadelarchivo != null) {
                $vehiculoimagen = new VehiculoImagen();
                $vehiculoimagen->idvehiculo = $data->id;
                $vehiculoimagen->imagen = $rutadelarchivo;
                $vehiculoimagen->estado = 'A';
                $vehiculoimagen->save();
            }

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

            $vehiculotipo = DB::table('vehiculotipo')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            $vehiculomarca = DB::table('marca')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            $vehiculoyear = DB::table('vehiculoyear')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'desc')
                ->get();

            $vehiculocolor = DB::table('vehiculocolor')
                ->where('estado', '=', 'A')
                ->orderBy('descripcion', 'asc')
                ->get();

            $data = DB::table('vehiculo as v')
                ->join('cliente as c', 'v.idcliente', '=', 'c.id')
                ->join('marca as m', 'v.idmarca', '=', 'm.id')
                ->join('vehiculotipo as vt', 'v.idvehiculotipo', '=', 'vt.id')
                ->join('vehiculoyear as vy', 'v.idvehiculoyear', '=', 'vy.id')
                ->join('vehiculocolor as vc', 'v.idvehiculocolor', '=', 'vc.id')
                ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                ->select('v.idcliente', 'v.idvehiculotipo', 'v.idmarca', 'v.idmodelo', 'v.idvehiculocolor',
                    'v.idvehiculoyear', 'v.placa', 'v.nroserie', 'v.observacion',
                    'c.nombre', 'c.apellido', 'c.razonsocial',
                    'm.descripcion as marca', 'vt.descripcion as vehiculotipo',
                    'vy.descripcion as year', 'vc.descripcion as color', 'mod.descripcion as modelo'
                )
                ->where('v.estado', '=', 'A')
                ->where('v.id', '=', $id)
                ->first();

            $vehiculomodelo = DB::table('modelo as v')
                ->where('v.estado', '=', 'A')
                ->where('v.idmarca', '=', $data->idmarca)
                ->orderBy('v.id', 'asc')
                ->get();


            $imagen = DB::table('vehiculoimagen')
                ->where('estado', '=', 'A')
                ->where('idvehiculo', '=', $id)
                ->get();

            return response()->json([
                'response' => 1,
                'tipo' => $vehiculotipo,
                'marca' => $vehiculomarca,
                'year' => $vehiculoyear,
                'color' => $vehiculocolor,
                'modelo' => $vehiculomodelo,
                'data' => $data,
                'imagen' => $imagen,
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

            $placa = $request->input('placa');
            $nroserie = $request->input('nroserie');
            $idcliente = $request->input('idcliente');
            $idtipo = $request->input('idtipo');
            $idmarca = $request->input('idmarca');
            $idmodelo = $request->input('idmodelo');
            $idyear = $request->input('idyear');
            $idcolor = $request->input('idcolor');
            $nota = $request->input('nota');

            $bandera = $request->input('bandera');
            $id = $request->input('id');

            $data = Vehiculo::find($id);

            if ($data->placa != $placa) {
                $vehiculofirst = DB::table('vehiculo')
                    ->where('placa', '=', $placa)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($vehiculofirst) > 0) {
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen') && $bandera == 1){
            
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'vehiculo-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/vehiculo/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/vehiculo/', $nuevoNombre);

            }

            $data->placa = $placa;
            $data->idcliente = $idcliente;
            $data->idvehiculotipo = $idtipo;
            $data->idmarca = $idmarca;
            $data->idmodelo = $idmodelo;
            $data->idvehiculocolor = $idcolor;
            $data->idvehiculoyear = $idyear;
            $data->nroserie = $nroserie;
            $data->observacion = $nota;
            $data->save();

            if ($rutadelarchivo != null) {

                $vehiculoimg = DB::table('vehiculoimagen')
                    ->where('idvehiculo', '=', $data->id)
                    ->first();

                if ($vehiculoimg != null) {
                    $vehiculoimagen = VehiculoImagen::find($vehiculoimg->id);
                    $vehiculoimagen->imagen = $rutadelarchivo;
                    $vehiculoimagen->update();
                }else {
                    $vehiculoimagen = new VehiculoImagen();
                    $vehiculoimagen->idvehiculo = $data->id;
                    $vehiculoimagen->imagen = $rutadelarchivo;
                    $vehiculoimagen->estado = 'A';
                    $vehiculoimagen->save();
                }
            }

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

            $id = $request->input('idvehiculo');

            $data = DB::table('venta')
                ->where([ ['idvehiculo', '=', $id], ['estado', '=', 'A'] ])
                ->get();

            if (sizeof($data) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = Vehiculo::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('vehiculo as v')
                ->join('vehiculotipo as vt', 'v.idvehiculotipo', '=', 'vt.id')
                ->join('cliente as c', 'v.idcliente', '=', 'c.id')
                ->join('marca as m', 'v.idmarca', '=', 'm.id')
                ->join('modelo as mod', 'v.idmodelo', '=', 'mod.id')
                ->select('v.id', 'v.placa', 'm.descripcion as marca',
                    'vt.descripcion as vehiculotipo', 'mod.descripcion as modelo',
                    'c.nombre', 'c.apellido'
                )
                ->where('v.estado', '=', 'A')
                ->orderBy('v.id', 'desc')
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

    public function get_modelomarca(Request $request){
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $id = $request->input('idmarca');
           
            $data = DB::table('modelo as mod')
                ->select('mod.id', 'mod.descripcion')
                ->where('mod.estado', '=', 'A')
                ->where('mod.idmarca', '=', $id)
                ->orderBy('mod.descripcion', 'asc')
                ->get();


            return response()->json([
                'response' => 1,
                'data' => $data,
                'id' => $id,
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
}
