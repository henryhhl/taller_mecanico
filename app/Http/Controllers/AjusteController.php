<?php

namespace App\Http\Controllers;

use App\Ajuste;
use App\Visitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AjusteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $sesion = Auth::guest();

            if ($sesion) {
                return response()->json([
                    'response' => -3,
                    'sesion'   => $sesion,
                ]);
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'visitasitio' => $this->getvisitasitio(),
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

    public function getvisitasitio() {

        $data = new Visitas();
        $data->ajuste = '1';
        $mytime = Carbon::now('America/La_paz');
        $data->fecha = $mytime->toDateString();
        $data->hora = $mytime->toTimeString();
        $data->save();

        $cantidad = sizeof( DB::table('visitas')->whereNotNull('ajuste')->get() );
        return ' AJUSTE: ' . $cantidad;
    }
    public function search(Request $request){
        $dato = strtolower($request->dato);
        $marcas = DB::select("select * from marca where lower(descripcion) like '%$dato%' ");
        $modelos = DB::select("select * from modelo where lower(descripcion) like '%$dato%' ");
        $usuarios = DB::select("select * from users where lower(nombre) like '%$dato%' or  lower(apellido) like '%$dato%' or lower(usuario) like '%$dato%' ");
        $vehiculotipo = DB::select("select * from vehiculotipo where lower(descripcion) like '%$dato%' ");
        $vehiculo = DB::select("select * from vehiculo where lower(placa) like '%$dato%' or lower(nroserie) like '%$dato%' or lower(observacion) like '%$dato%' ");
        $cliente = DB::select("select * from cliente where lower(nombre) like '%$dato%' or lower(apellido) like '%$dato%'or lower(razonsocial) like '%$dato%' or lower(nit) like '%dato%' or lower(telefono) like '%dato%' ");
        
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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

            $header = $request->input('header');
            $sidebar = $request->input('sidebar');
            $footer = $request->input('footer');
            $button = $request->input('button');
            $sizetext = $request->input('sizetext');

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->get();

            if ( sizeof($data) > 0 ) {
                $ajuste = Ajuste::find($data[0]->id);
                $ajuste->idusuario = Auth::user()->id;
                $ajuste->colorheader = $header;
                $ajuste->colorsidebar = $sidebar;
                $ajuste->colorfooter = $footer;
                $ajuste->colorgeneral = $button;
                $ajuste->sizetext = $sizetext;
                $ajuste->update();
            } else {
                $ajuste = new Ajuste();
                $ajuste->idusuario = Auth::user()->id;
                $ajuste->colorheader = $header;
                $ajuste->colorsidebar = $sidebar;
                $ajuste->colorfooter = $footer;
                $ajuste->colorgeneral = $button;
                $ajuste->sizetext = $sizetext;
                $ajuste->save();
            }

            $data = Ajuste::where('idusuario', '=', Auth::user()->id)->orderBy('id')->first();

            DB::commit();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
