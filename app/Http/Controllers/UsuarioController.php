<?php

namespace App\Http\Controllers;

use App\Ajuste;
use App\Detalle_Rol;
use App\Functions;
use App\Rol;
use App\User;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function inicio() {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $cliente = sizeof(DB::table('cliente')->where('estado', '=', 'A')->get());

            $venta = DB::table('venta')
                ->where('estado', '=', 'A')
                ->get();

            $montotal = 0;

            foreach ($venta as $data) {
                $montotal += $data->montototal;
            }

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
                ->where( 'vent.estado', '=', 'A' )
                ->orderBy('serv.id')
                ->get();

            $servicios = DB::table('servicio')
                ->where('estado', '=', 'A')
                ->orderBy('id')
                ->get();
            
            return response()->json([
                'response' => 1,
                'cliente' => $cliente,
                'totalventa' => sizeof($venta),
                'montototal' => $montotal,
                'data' => $data,
                'servicio' => $servicios,
            ]);
        } catch(\Exception $th) {
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

    public function perfil() {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                ->leftJoin('rol as grupo', 'det.idrol', '=', 'grupo.id')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            return response()->json([
                'response' => 1,
                'usuario'  => $usuario,
                'visitasitio' => $this->getvisitasitio(5),
            ]);
        } catch(\Exception $th) {
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

    public function get_information() {

        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $session = app('session');
            $token = null;

            if (isset($session)) {
                $token = $session->token();
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

            $rol = DB::table('detalle_rol')->where([['idusuario', '=', Auth::user()->id], ['estado', '=', 'A']])->first();

            $permisos = [];

            if (!is_null($rol)) {
                $permisos = DB::table('permiso as perm')
                    ->leftJoin('detalle_permiso as det', 'perm.id', '=', 'det.idpermiso')
                    ->select('perm.id', 'perm.nombre', 'det.estado')
                    ->where('det.idrol', '=', $rol->idrol)
                    ->get();
            }

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                ->leftJoin('rol as grupo', 'det.idrol', '=', 'grupo.id')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            return response()->json([
                'response' => 1,
                'token'    => $token,
                'usuario'  => $usuario,
                'ajuste'   => $data,
                'permiso'   => $permisos,
            ]);
        } catch(\Exception $th) {
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

                $data = DB::table('users as user')
                    ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                    ->leftJoin('rol as grupousuario', 'det.idrol', '=', 'grupousuario.id')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado', 'grupousuario.nombre as rol'
                    )
                    ->where('user.estado', '=', 'A')
                    ->orderBy('user.id', 'desc')
                    ->paginate(10);

            }else {

                $data = DB::table('users as user')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado'
                    )
                    ->where(function ($query) use ($search, $searchlike) {
                        return $query->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), $searchlike, "%".$search."%")
                            ->orWhere('user.nombre', $searchlike, '%'.$search.'%')
                            ->orWhere('user.usuario', $searchlike, '%'.$search.'%')
                            ->orWhere('user.apellido', $searchlike, '%'.$search.'%');
                    })
                    ->where('user.estado', '=', 'A')
                    ->orderBy('user.id', 'desc')
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
            $data->usuario = '1';
        }
        if ($bandera == 2) {
            $data->usuariocreate = '1';
        }
        if ($bandera == 3) {
            $data->usuarioedit = '1';
        }
        if ($bandera == 4) {
            $data->usuarioshow = '1';
        }
        if ($bandera == 5) {
            $data->perfil = '1';
        }

        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();

        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('usuario')->get() );
            return ' LISTADO DE USUARIO: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('usuariocreate')->get() );
            return ' NUEVO USUARIO: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('usuarioedit')->get() );
            return ' EDITAR USUARIO: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('usuarioshow')->get() );
            return ' DETALLE USUARIO: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('perfil')->get() );
        return ' PERFIL: ' . $cantidad;
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

            $data = Rol::select('id', 'nombre', 'descripcion')->where('estado', '=', 'A')->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');

            $usuario = $request->input('usuario');
            $password = $request->input('password');
            $idrol = $request->input('idrol', null);

            $rol = DB::table('users')
                ->where('usuario', '=', $usuario)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($rol) > 0) {
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
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);

            }

            $data = new User();
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;

            $data->usuario = $usuario;
            $data->password = bcrypt($password);
            $data->imagen = $request->input('foto');
            $data->tipo = 'S';
            $data->save();

            if ($idrol != null) {
                
                $detalle = new Detalle_Rol();
                $detalle->idrol = $idrol;
                $detalle->idusuario = $data->id;
                $detalle->estado = 'A';
                $detalle->save();
                
            }

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

    public function update_perfil(Request $request) {

        try {
            DB::beginTransaction();

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');
            $email = $request->input('email');
            $img = $request->input('imagen');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('foto')){
            
                $imagen = $request->file('foto');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('foto');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);

            }

            $data = User::find(Auth::user()->id);
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;
            $data->email_verified_at = $email;
            $data->imagen = $img;
            $data->update();

            $usuario = DB::table('users as user')
                ->leftJoin('detalle_rol as det', 'user.id', '=', 'det.idusuario')
                ->leftJoin('rol as grupo', 'det.idrol', '=', 'grupo.id')
                ->select('grupo.nombre as rol', 'grupo.descripcion', 'user.id', 
                    'user.nombre', 'user.apellido', 'user.nacimiento', 'user.usuario', 'user.imagen', 
                    'user.genero', 'user.email_verified_at as email'
                )
                ->where('user.id', '=', Auth::user()->id)
                ->first();

            DB::commit();

            return response()->json([
                'response' => 1,
                'usuario'  => $usuario,
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
        try {
            
            $data = DB::table('users')
                ->where('id', '=', $id)
                ->first();

            $rol = DB::table('detalle_rol')
                ->where('idusuario', '=', $id)
                ->first();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'rol' => $rol,
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
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }
            
            $data = DB::table('users')
                ->where('id', '=', $id)
                ->first();

            $rol = DB::table('detalle_rol as det')
                ->leftJoin('rol as r', 'det.idrol', '=', 'r.id')
                ->select('r.id', 'r.nombre', 'r.descripcion')
                ->where('det.idusuario', '=', $id)
                ->where('det.estado', '=', 'A')
                ->first();

            $array_rol = Rol::select('id', 'nombre', 'descripcion')->where('estado', '=', 'A')->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'rol' => $rol,
                'array_rol' => $array_rol,
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

            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $genero = $request->input('genero');
            $nacimiento = $request->input('nacimiento');

            $usuario = $request->input('usuario');
            $password = $request->input('password');
            $idrol = $request->input('idrol', null);

            $id = $request->input('id');

            $registro = date('Y').date('d').date('m').date('h').date('i').date('s');
            $rutadelarchivo = null;

            if (Input::hasFile('imagen')){
                $imagen = $request->file('imagen');
                $name = $imagen->getClientOriginalName();
                $extension = $imagen->getClientOriginalExtension();
                $nuevoNombre = 'usuario-'.$registro.'.'.$extension;

                $rutadelarchivo = '/img/usuario/'.$nuevoNombre;

                $archivo = Input::file('imagen');
                $archivo->move(public_path().'/img/usuario/', $nuevoNombre);
            }

            $data = User::find($id);
            $data->nombre = $nombre;
            $data->apellido = $apellido;
            $data->nacimiento = $nacimiento;
            $data->genero = $genero;
            $data->usuario = $usuario;
            $data->password = bcrypt($password);
            if ($rutadelarchivo != null) {
                $data->imagen = $request->input('foto');
            }
            $data->update();

            if ($idrol != null) {

                $rol_usuario = DB::table('detalle_rol')
                    ->select('id', 'idrol', 'idusuario', 'estado')
                    ->where('idusuario', '=', $id)
                    ->first();

                if ($rol_usuario == null) {

                    $detalle = new Detalle_Rol();
                    $detalle->idrol = $idrol;
                    $detalle->idusuario = $id;
                    $detalle->estado = 'A';
                    $detalle->save();

                }else {
                    $detalle = Detalle_Rol::find($rol_usuario->id);
                    $detalle->estado = 'A';
                    $detalle->idrol = $idrol;
                    $detalle->update();
                }
            }else {
                $rol_usuario = DB::table('detalle_rol')
                    ->select('id', 'idrol', 'idusuario', 'estado')
                    ->where('idusuario', '=', $id)
                    ->first();

                if ($rol_usuario != null) {
                    $detalle = Detalle_Rol::find($rol_usuario->id);
                    $detalle->estado = 'N';
                    $detalle->update();
                }
            }

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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {
            DB::beginTransaction();

            $id = $request->input('idusuario');

            // $data = User::find($id);
            // $data->estado = 'N';
            // $data->update();

            $data = DB::table('users')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
