<?php

namespace App\Http\Controllers;

use App\Detalle_Permiso;
use App\Detalle_Rol;
use App\Rol;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RolController extends Controller
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
                $data = DB::table('rol')
                    ->select('id', 'nombre', 'descripcion', 'estado')
                    ->where('estado', '=', 'A')
                    ->orderBy('id', 'asc')
                    ->paginate(10);
            }else {
                $data = DB::table('rol')
                    ->select('id', 'nombre', 'descripcion', 'estado')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('nombre', 'LIKE', '%'.$search.'%');
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
            $data->grupousuario = '1';
        }
        if ($bandera == 2) {
            $data->grupousuariocreate = '1';
        }
        if ($bandera == 3) {
            $data->grupousuarioedit = '1';
        }
        if ($bandera == 4) {
            $data->grupousuarioshow = '1';
        }
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        if ($bandera == 1) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('grupousuario')->get() );
            return ' LISTADO DE ROL: ' . $cantidad;
        }
        if ($bandera == 2) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('grupousuariocreate')->get() );
            return ' NUEVO ROL: ' . $cantidad;
        }
        if ($bandera == 3) {
            $cantidad = sizeof( DB::table('visitas')->whereNotNull('grupousuarioedit')->get() );
            return ' EDITAR ROL: ' . $cantidad;
        }
        $cantidad = sizeof( DB::table('visitas')->whereNotNull('grupousuarioshow')->get() );
        return ' DETALLE ROL: ' . $cantidad;
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

            $array_usuario = DB::table('users as user')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where(
                    DB::raw('(SELECT COUNT(*) as cantidad FROM detalle_rol det WHERE det.idusuario = user.id AND det.estado="A")') , '=', '0'
                )
                ->where('user.estado', '=', 'A')
                ->orderBy('user.id', 'desc')
                ->get();

            // $data = DB::table('permiso')
            //     ->where('estado', '=', 'A')
            //     ->orderBy('id', 'asc')
            //     ->get();
            
            return response()->json([
                'response'      => 1,
                'array_usuario' => $array_usuario,
                'visitasitio' => $this->getvisitasitio(2),
                // 'data' => $data,
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
            $descripcion = $request->input('descripcion');

            $rol = DB::table('rol')
                ->where('nombre', '=', $nombre)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($rol) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                ]);
            }

            $data = new Rol();
            $data->nombre = $nombre;
            $data->descripcion = $descripcion;
            $mytime = Carbon::now('America/La_paz');
            $data->fecha = $mytime->toDateString();
            $data->hora = $mytime->toTimeString();
            $data->save();
            
            $array_permiso = DB::table('permiso')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();
            
            foreach ($array_permiso as $permiso) {
                $detalle = new Detalle_Permiso();
                $detalle->idrol = $data->id;
                $detalle->idpermiso = $permiso->id;
                $detalle->estado = 'N';
                $detalle->save();
            }

            $array_usuario = json_decode($request->input('array_usuario', '[]'));

            foreach ($array_usuario as $key => $idusuario) {

                $detallerol = DB::table('detalle_rol')
                    ->select('id', 'idusuario', 'idrol', 'estado')
                    ->where('idusuario', '=', $idusuario)
                    ->first();

                if ($detallerol != null) {
                    $detalle = Detalle_Rol::find($detallerol->id);
                    $detalle->idrol = $data->id;
                    $detalle->estado = 'A';
                    $detalle->update();
                } else {
                    $detalle = new Detalle_Rol();
                    $detalle->idrol = $data->id;
                    $detalle->idusuario = $idusuario;
                    $detalle->estado = 'A';
                    $detalle->save();
                }

            }

            $array_permiso = DB::table('detalle_permiso as det')
                ->leftJoin('permiso as perm', 'det.idpermiso', '=', 'perm.id')
                ->select('det.id', 'perm.nombre', 'det.estado')
                ->where('det.idrol', '=', $data->id)
                ->orderBy('perm.id', 'asc')
                ->get();

            $rol = DB::table('rol')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'desc')
                ->get();

            DB::commit();

            return response()->json([
                'response'      => 1,
                'data'          => $data,
                'rol'           => $rol,
                'array_permiso' => $array_permiso,
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
            
            $data = DB::table('rol')
                ->where('id', '=', $id)
                ->first();

            $consulta = DB::select(
                'select *
                    from permiso as p
                    where p.id not in 
                    (select d.idpermiso 
                        from detalle_permiso as d
                        where d.idrol = '.$id.' 
                    )'
            );

            if (sizeof($consulta) > 0) {
                
                foreach ($consulta as $c) {
                    $detalle = new Detalle_Permiso();
                    $detalle->idrol = $id;
                    $detalle->idpermiso = $c->id;
                    $detalle->estado = 'N';
    
                    $detalle->save();
    
                }
            }

            $permiso = DB::table('detalle_permiso as d')
                ->join('permiso as p', 'd.idpermiso', '=', 'p.id')
                ->select('d.id', 'p.nombre', 'd.estado')
                ->where('d.idrol', '=', $id)
                ->orderBy('p.id', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'permiso' => $permiso,
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
            
            $data = DB::table('rol')
                ->select('id', 'nombre', 'descripcion', 'estado')
                ->where('id', '=', $id)
                ->first();

            $array_usuario = DB::table('users as user')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where(
                    DB::raw('(SELECT COUNT(*) as cantidad FROM detalle_rol det WHERE det.idusuario = user.id AND det.estado="A")') , '=', '0'
                )
                ->where('user.estado', '=', 'A')
                ->orderBy('user.id', 'desc')
                ->get();

            $usuario_activo = DB::table('detalle_rol as det')
                ->leftJoin('users as user', 'det.idusuario', '=', 'user.id')
                ->select('user.id', 'user.usuario', 'user.nombre', 'user.apellido', 'user.imagen', 'user.genero')
                ->where([ ['det.idrol', '=', $id], ['det.estado', '=', 'A'] ])
                ->get();

            // $permiso_activo = DB::table('detalle_permiso as det')
            //     ->leftJoin('permiso as perm', 'det.idpermiso', '=', 'perm.id')
            //     ->select('det.id', 'perm.nombre', 'det.estado')
            //     ->where([ ['det.idrol', '=', $idrol], ['det.estado', '=', 'A'] ])
            //     ->orderBy('perm.id', 'asc')
            //     ->get();

            // $array_permiso = DB::select(
            //     'SELECT * FROM permiso AS perm
            //         WHERE perm.id NOT IN 
            //         (SELECT det.idpermiso  FROM detalle_permiso AS det
            //             WHERE det.idrol = '.$id.')'
            // );

            // if (sizeof($array_permiso) > 0) {
                
            //     foreach ($array_permiso as $permiso) {

            //         $detalle = new Detalle_Permiso();
            //         $detalle->idrol = $id;
            //         $detalle->idpermiso = $permiso->id;
            //         $detalle->estado = 'N';
            //         $detalle->save();
    
            //     }
            // }

            // $permiso = DB::table('detalle_permiso as det')
            //     ->leftJoin('permiso as perm', 'det.idpermiso', '=', 'perm.id')
            //     ->select('det.id', 'perm.nombre', 'det.estado')
            //     ->where('det.idrol', '=', $id)
            //     ->orderBy('perm.id', 'asc')
            //     ->get();

            return response()->json([
                'response' => 1,
                'data'     => $data,
                'array_usuario' => $array_usuario,
                'usuario_activo' => $usuario_activo,
                'visitasitio' => $this->getvisitasitio(3),
                //'permiso' => $permiso,
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
            $descripcion = $request->input('descripcion');
            $id = $request->input('id');

            $data = Rol::find($id);

            if ($nombre != $data->nombre) {
                $rol = DB::table('rol')
                    ->where('nombre', '=', $nombre)
                    ->where('estado', '=', 'A')
                    ->get();

                if (sizeof($rol) > 0) {
                    DB::rollBack();
                    return response()->json([
                        'response' => -1,
                    ]);
                }
            }

            $data->nombre = $nombre;
            $data->descripcion = $descripcion;
            $data->update();

            $array_rol = DB::table('detalle_rol')
                ->select('id', 'idusuario', 'idrol', 'estado')
                ->where('idrol', '=', $id)
                ->get();

            foreach ($array_rol as $key => $rol) {
                $detalle = Detalle_Rol::find($rol->id);
                $detalle->estado = 'N';
                $detalle->update();
            }

            $array_usuario = json_decode($request->input('array_usuario', '[]'));

            foreach ($array_usuario as $key => $idusuario) {

                $detallerol = DB::table('detalle_rol')
                    ->select('id', 'idusuario', 'idrol', 'estado')
                    ->where('idusuario', '=', $idusuario)
                    ->first();

                if ($detallerol != null) {
                    $detalle = Detalle_Rol::find($detallerol->id);
                    $detalle->idrol = $data->id;
                    $detalle->estado = 'A';
                    $detalle->update();
                } else {
                    $detalle = new Detalle_Rol();
                    $detalle->idrol = $data->id;
                    $detalle->idusuario = $idusuario;
                    $detalle->estado = 'A';
                    $detalle->save();
                }

            }

            $array_permiso = DB::select(
                'SELECT * FROM permiso AS perm
                    WHERE perm.id NOT IN 
                    (SELECT det.idpermiso  FROM detalle_permiso AS det
                        WHERE det.idrol = '.$id.')'
            );

            if (sizeof($array_permiso) > 0) {
                
                foreach ($array_permiso as $permiso) {

                    $detalle = new Detalle_Permiso();
                    $detalle->idrol = $id;
                    $detalle->idpermiso = $permiso->id;
                    $detalle->estado = 'N';
                    $detalle->save();
    
                }
            }

            // $array_permiso = json_decode($request->input('array_permiso'));

            // foreach ($array_permiso as $permiso) {
            //     $detalle = Detalle_Permiso::find($permiso->id);
            //     $detalle->estado = ($permiso->estado == '1') ? 'A' : 'N';
            //     $detalle->update();
            // }
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

            $id = $request->input('idrol');

            $data = Rol::find($id);
            $data->estado = 'N';
            $data->update();

            $data = DB::table('rol')
                ->where('estado', '=', 'A')
                ->orderBy('id', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $data,
            ]);

        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'response' => 0,
            ]);
        }
    }
}
