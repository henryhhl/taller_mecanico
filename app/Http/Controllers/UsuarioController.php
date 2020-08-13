<?php

namespace App\Http\Controllers;

use App\Detalle_Rol;
use App\Rol;
use App\User;
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

                $data = DB::table('users as user')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado'
                    )
                    ->where('user.estado', '=', 'A')
                    ->orderBy('user.id', 'desc')
                    ->paginate(10);

            }else {

                $data = DB::table('users as user')
                    ->select('user.id', 'user.nombre', 'user.apellido', 'user.usuario', 'user.nacimiento', 
                        'user.genero', 'user.tipo', 'user.estado'
                    )
                    ->where(function ($query) use ($search, $number) {
                        return $query->orWhere(DB::raw("CONCAT(user.nombre, ' ',user.apellido)"), 'LIKE', "%".$search."%")
                            ->orWhere('user.nombre', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.usuario', 'LIKE', '%'.$search.'%')
                            ->orWhere('user.apellido', 'LIKE', '%'.$search.'%');
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

            $data = Rol::select('id', 'nombre', 'descripcion')->where('estado', '=', 'A')->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
            $data->imagen = $rutadelarchivo;
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
                $data->imagen = $rutadelarchivo;
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
