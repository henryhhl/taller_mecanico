
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import axios from 'axios';

import { notification, Drawer, Affix, Button, Modal } from 'antd';
import 'antd/dist/antd.css';

import Header from './layouts/header';
import Sidebar from './layouts/sidebar';
import Home from './home';
import IndexRol from './administracion/rol';
import CreateRol from './administracion/rol/crear';
import EditarRol from './administracion/rol/editar';
import IndexUsuario from './administracion/usuario';
import CreateUsuario from './administracion/usuario/crear';
import EditarUsuario from './administracion/usuario/editar';
import ShowUsuario from './administracion/usuario/show';

import IndexVehiculoTipo from './taller/vehiculotipo';
import CreateVehiculoTipo from './taller/vehiculotipo/crear';
import EditarVehiculoTipo from './taller/vehiculotipo/editar';

import IndexCliente from './servicio/cliente';
import CreateCliente from './servicio/cliente/crear';
import EditarCliente from './servicio/cliente/editar';
import ShowCliente from './servicio/cliente/show';

import IndexArticulo from './taller/articulo';
import CreateArticulo from './taller/articulo/crear';
import EditarArticulo from './taller/articulo/editar';
import ShowArticulo from './taller/articulo/show';

import IndexVehiculo from './taller/vehiculo';
import CreateVehiculo from './taller/vehiculo/crear';
import EditarVehiculo from './taller/vehiculo/editar';

import IndexMecanico from './servicio/mecanico';
import CreateMecanico from './servicio/mecanico/crear';
import EditarMecanico from './servicio/mecanico/editar';
import ShowMecanico from './servicio/mecanico/show';

import IndexServicio from './servicio/servicio';
import CreateServicio from './servicio/servicio/crear';
import EditarServicio from './servicio/servicio/editar';
import ShowServicio from './servicio/servicio/show';

import IndexVenta from './servicio/venta';
import CreateVenta from './servicio/venta/crear';

import CreateVehiculoMarca from './taller/marca/crear';
import EditarVehiculoMarca from './taller/marca/editar';
import ShowMarca from './taller/marca/show'

import CreateVehiculoModelo from './taller/modelo/crear';
import EditarVehiculoModelo from './taller/modelo/editar';

import CreateVehiculoColor from './taller/color/crear';
import EditarVehiculoColor from './taller/color/editar';
import ShowColor from './taller/color/show';

import CreateVehiculoYear from './taller/year/crear';
import EditarVehiculoYear from './taller/year/editar';

import CreateCategoria from './servicio/categoria/crear';
import EditarCategoria from './servicio/categoria/editar';
import ShowCategoria from './servicio/categoria/show';

import Asignar_Permiso from './administracion/permiso/asignar';

import IndexPromocion from './servicio/promocion';
import CreatePromocion from './servicio/promocion/crear';
import EditarPromocion from './servicio/promocion/editar';

import ShowVehiculo from './taller/vehiculo/show'

import { logo } from './utils/logo';
import web from './utils/services';
import Footer from './layouts/footer';
import Ajuste from './ajuste';
import Perfil from './perfil';
import Reporte from './reporte';


const objeto_vehiculo = { idvehiculo: null, placa: '',
    marca: '', modelo: '', color: '', serie: '',
};

/* marcas realizados en el mantenimientos, servicios,  */

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading_page: false,

            layoutoption: {sidebarcolor: '', headercolor: '', footercolor: '',
                plantillacolor: '', buttoncolor: '', sizetext: '',
            },

            permisos_habilitados: [],

            visitasitio: '',
            namedelete: '',
            iddelete: null,

            visible: false,
            visible_drawer: false,
            loading: false,

            sesion: false,

            token: '',
            auth: false,
            
            usuario: {
                id: '', nombre: '',
                apellido: '', nacimiento: '',
                usuario: '', imagen: '', genero: 'N',
                email: '', rol: '', descripcion: '',
            },

            paginate: {
                usuario: 1, rol: 1,
                cliente: 1, mecanico: 1,
                vehiculo: 1, tipo: 1, marca: 1,
                modelo: 1, color: 1, year: 1,
                producto: 1, categoria: 1,
                articulo: 1, venta: 1, promocion: 1,
            },

            pagination: {
                usuario: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                rol: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                cliente: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                mecanico: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                vehiculo: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                tipo: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                marca: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                modelo: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                color: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                year: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                producto: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                categoria: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                articulo: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                venta: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
                promocion: {
                    'total': 0, 'current_page': 0,
                    'per_page': 0, 'last_page': 0,
                    'from': 0, 'to': 0,
                },
            },

            array_rol: [],
            array_cliente: [],

            array_vehiculo: [],
            array_vehiculotipo: [],
            array_vehiculomarca: [],
            array_vehiculomodelo: [],
            array_vehiculocolor: [],
            array_vehiculoyear: [],

            array_mecanico: [],

            array_servicio: [],
            array_categoria: [],
            array_articulo: [],

            array_usuario: [],
            array_venta: [],
            array_promocion: [],

            activeKey: {
                vehiculo: '1', almacen: '1',
            },
            
            menu: {
                dashboards: '',
                seguridad: '',
                servicio: '',
            },
            link: {
                home: '',
                perfil: '',
                ajuste: '',
                reporte: '',
                usuario: '',
                rol: '',
                asignar_permiso: '',

                venta: '',
                cliente: '',
                mecanico: '',
                vehiculo: '',
                almacen: '',
                promocion: '',
            },

            vehiculo_create: {
                create: 0,
                placa: '',
                nroserie: '',
                idcliente: '',
                idtipo: '',
                idmarca: '',
                idmodelo: '',
                idcolor: '',
                idyear: '',
                nota: '',
                namecliente: '',
                razonsocialcliente: '',
                marca: null,
                modelo: null,
                year: null,
                color: null,
                tipo: null,
                array_cliente: [],
                array_tipo: [],
                array_marca: [],
                array_year: [],
                array_color: [],
                array_modelo: [],
                imagen: '',
                foto: '',
            },
            venta_create: {
                create: 0, array_vehiculo: [],
                nroventa: 0, codigo: '', observaciones: '',
                cliente_first: null, vehiculo_first: null,
                mecanico_first: null, array_articulo: [],
                array_serviciosselected: [], descuento: 0, key: 'tab1',
            },
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/usuario/get_information').then(
            (response) => {
                if (response.data.response == -3) {
                    this.onLogout();
                    return;
                }
                if (response.data.response == 1) {
                    if (response.data.ajuste != null) {
                        this.state.layoutoption.headercolor = response.data.ajuste.colorheader == null ? '' : response.data.ajuste.colorheader;
                        this.state.layoutoption.sidebarcolor = response.data.ajuste.colorsidebar == null ? '' : response.data.ajuste.colorsidebar;
                        this.state.layoutoption.footercolor = response.data.ajuste.colorfooter == null ? '' : response.data.ajuste.colorfooter;
                        this.state.layoutoption.buttoncolor = response.data.ajuste.colorgeneral == null ? '' : response.data.ajuste.colorgeneral;
                        this.state.layoutoption.sizetext = response.data.ajuste.sizetext == null ? '' : response.data.ajuste.sizetext;
                    }
                    this.setState({
                        token: response.data.token,
                        usuario: response.data.usuario,
                        layoutoption: this.state.layoutoption,
                        sesion: true,
                        permisos_habilitados: response.data.permiso,
                        loading_page: true,
                    });
                }
            }
        ).catch( error => {
            console.log(error)
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                zIndex: 1200,
            });
            Modal.error({
                title: 'ERROR DE COMUNICACIÓN',
                content: (
                    <div>
                        <p>Ha habido un error de comunicación</p>
                        <p>Favor de intentar nuevamente</p>
                    </div>
                ),
                onOk: () => this.get_data(),
                zIndex: 1500,
                centered: true,
            });
        } );
    }
    updatePerfil(data) {
        this.setState({
            usuario: data,
        });
    }
    vehiculocreate(data) {
        this.setState({ vehiculo_create: data, });
    }
    ventacreate(data) {
        this.setState({ venta_create: data, });
    }
    init() {
        this.initvehiculo();
        this.initventa();
    }
    initvehiculo() {
        var vehiculo_create = {
            create: 0, placa: '', nroserie: '', idcliente: '',
            idtipo: '', idmarca: '', idmodelo: '', idcolor: '', idyear: '',
            nota: '', namecliente: '', razonsocialcliente: '',
            marca: null, modelo: null, year: null, color: null, tipo: null,
            array_cliente: [], array_tipo: [], array_marca: [],
            array_year: [], array_color: [], array_modelo: [],
            imagen: '', foto: '',
        };
        this.setState({ vehiculo_create: vehiculo_create, });
    }
    initventa() {
        var venta_create = {
            create: 0, array_vehiculo: [], nroventa: 0, codigo: '',
            observaciones: '', cliente_first: null, vehiculo_first: null,
            mecanico_first: null, array_serviciosselected: [],
            array_articulo: [], descuento: 0,
        };
        this.setState({ venta_create: venta_create, });
    }
    onStoreCliente(data, value) {
        if (value == 'vehiculo') {
            this.state.vehiculo_create.idcliente = data.id;
            this.state.vehiculo_create.namecliente = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido;
            this.state.vehiculo_create.razonsocialcliente = data.razonsocial == null ? 'S/Empresa' : data.razonsocial;
            this.setState({ vehiculo_create: this.state.vehiculo_create, });
        }
        if (value == 'venta') {
            this.state.venta_create.cliente_first.idcliente = data.id;
            this.state.venta_create.cliente_first.nombre = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido;
            this.state.venta_create.cliente_first.empresa = data.razonsocial == null ? '' : data.razonsocial;
            this.state.venta_create.cliente_first.nit = data.nit == null ? '' : data.nit;
            this.state.venta_create.cliente_first.email = data.email == null ? '' : data.email;
            this.state.venta_create.array_vehiculo = [];
            this.state.venta_create.vehiculo_first = {
                idvehiculo: null, marca: '', placa: '',
                modelo: '', color: '', serie: '',
            };
            for (let i = 0; i < 4; i ++) {
                this.state.venta_create.array_vehiculo.push(objeto_vehiculo);
            }
            this.setState({ venta_create: this.state.venta_create, });
        }
    }
    onStoreMecanico(data, value) {
        if (value == 'venta') {
            this.state.venta_create.mecanico_first.idmecanico = data.id;
            this.state.venta_create.mecanico_first.nombre = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido;
            this.state.venta_create.mecanico_first.telefono = data.telefono == null ? '' : data.telefono;
            this.state.venta_create.mecanico_first.celular = data.celular == null ? '' : data.celular;
            this.state.venta_create.mecanico_first.email = data.email == null ? '' : data.email;
            this.setState({ venta_create: this.state.venta_create, });
        }
    }
    onStoreServicio(data, value) {

        if (value == 'venta') {
        
            var bandera = true;

            var object_servicio = {
                id: data.id, codigo: data.codigo, descripcion: data.descripcion, precio: data.precio,
                stockactual: data.stockactual, tipo: data.tipo, imagen: data.imagen, costo : data.costo,
                comision: data.comision, idmecanico: null, mecanico: null, cantidad: 1,
                descuento: 0, montodescuento: 0, subtotal: data.precio, nota: '', visible_nota: false,
                visible_cantidad: false, visible_precio: false, visible_desc: false, 
                array_articulo: [], visible_articulo: false, error: null,
            };

            for (let index = 0; index < this.state.venta_create.array_serviciosselected.length; index++) {
                var element = this.state.venta_create.array_serviciosselected[index];
                if (element.id == null) {
                    this.state.venta_create.array_serviciosselected[index] = object_servicio;
                    bandera = false;
                    break;
                }
            }

            if (bandera) this.state.venta_create.array_serviciosselected.push(object_servicio);

            object_servicio = {
                id: null, codigo: null, descripcion: null, precio: null,
                stockactual: null, tipo: null, imagen: null, costo : null,
                comision: null, idmecanico: null, mecanico: null, cantidad: null,
                descuento: null, montodescuento: null, subtotal: null, nota: null, visible_nota: false,
                visible_cantidad: false, visible_precio: false, visible_desc: false,
                array_articulo: [], visible_articulo: false, error: null,
            };

            this.state.venta_create.array_serviciosselected.push(object_servicio);

            this.setState({ venta_create: this.state.venta_create, });

        }

    }
    onStoreVehiculo(data, value) {
        if (value == 'venta') {
            this.state.venta_create.vehiculo_first = data;
            for (let i = 0; i < this.state.venta_create.array_vehiculo.length; i++) {
                const element = this.state.venta_create.array_vehiculo[i];
                if (element.idvehiculo == null) {
                    this.state.venta_create.array_vehiculo[i] = data;
                    break;
                }
            }
            this.state.venta_create.array_vehiculo.push(objeto_vehiculo);
            this.setState({ venta_create: this.state.venta_create, });
        }
    }
    getusuario(data, pagination, page, visitasitio = '') {
        this.state.pagination.usuario = pagination;
        this.state.paginate.usuario = page;
        this.setState({
            array_usuario: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getrol(data, pagination, page, visitasitio = '') {
        this.state.pagination.rol = pagination;
        this.state.paginate.rol = page;
        this.setState({
            array_rol: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getcliente(data, pagination, page, visitasitio = '') {
        this.state.pagination.cliente = pagination;
        this.state.paginate.cliente = page;
        this.setState({
            array_cliente: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getvehiculo(data, pagination, page, visitasitio = '') {
        this.state.pagination.vehiculo = pagination;
        this.state.paginate.vehiculo = page;
        this.setState({
            array_vehiculo: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getvehiculotipo(data, pagination, page, visitasitio = '') {
        this.state.pagination.tipo = pagination;
        this.state.paginate.tipo = page;
        this.setState({
            array_vehiculotipo: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getvehiculomarca(data, pagination, page, visitasitio = '') {
        this.state.pagination.marca = pagination;
        this.state.paginate.marca = page;
        this.setState({
            array_vehiculomarca: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getvehiculomodelo(data, pagination, page, visitasitio = '') {
        this.state.pagination.modelo = pagination;
        this.state.paginate.modelo = page;
        this.setState({
            array_vehiculomodelo: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getvehiculocolor(data, pagination, page, visitasitio = '') {
        this.state.pagination.color = pagination;
        this.state.paginate.color = page;
        this.setState({
            array_vehiculocolor: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getvehiculoyear(data, pagination, page, visitasitio = '') {
        this.state.pagination.year = pagination;
        this.state.paginate.year = page;
        this.setState({
            array_vehiculoyear: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getmecanico(data, pagination, page, visitasitio = '') {
        this.state.pagination.mecanico = pagination;
        this.state.paginate.mecanico = page;
        this.setState({
            array_mecanico: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getservicio(data, pagination, page, visitasitio = '') {
        this.state.pagination.producto = pagination;
        this.state.paginate.producto = page;
        this.setState({
            array_servicio: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getcategoria(data, pagination, page, visitasitio = '') {
        this.state.pagination.categoria = pagination;
        this.state.paginate.categoria = page;
        this.setState({
            array_categoria: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getarticulo(data, pagination, page, visitasitio = '') {
        this.state.pagination.articulo = pagination;
        this.state.paginate.articulo = page;
        this.setState({
            array_articulo: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: (visitasitio == '') ? this.state.visitasitio : visitasitio,
        });
    }
    getventa(data, pagination, page, visitasitio = '') {
        this.state.pagination.venta = pagination;
        this.state.paginate.venta = page;
        this.setState({
            array_venta: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    getpromocion(data, pagination, page, visitasitio = '') {
        this.state.pagination.promocion = pagination;
        this.state.paginate.promocion = page;
        this.setState({
            array_promocion: data,
            pagination: this.state.pagination,
            paginate: this.state.paginate,
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    onModalActive(data, namedelete) {
        this.setState({
            visible: true,
            iddelete: data.id,
            namedelete: namedelete,
        });
    }
    onEliminar() {
        this.setState({
            loading: true,
        });
        if (this.state.namedelete == 'vehiculotipo') {
            this.deletevehiculotipo();
        }
        if (this.state.namedelete == 'vehiculomarca') {
            this.deletevehiculomarca();
        }
        if (this.state.namedelete == 'vehiculomodelo') {
            this.deletevehiculomodelo();
        }
        if (this.state.namedelete == 'vehiculocolor') {
            this.deletevehiculocolor();
        }
        if (this.state.namedelete == 'vehiculoyear') {
            this.deletevehiculoyear();
        }
        if (this.state.namedelete == 'cliente') {
            this.deletecliente();
        }
        if (this.state.namedelete == 'vehiculo') {
            this.deletevehiculo();
        }
        if (this.state.namedelete == 'mecanico') {
            this.deletemecanico();
        }
        if (this.state.namedelete == 'servicio') {
            this.deleteservicio();
        }
        if (this.state.namedelete == 'categoria') {
            this.deletecategoria();
        }
        if (this.state.namedelete == 'articulo') {
            this.deletearticulo();
        }
        if (this.state.namedelete == 'venta') {
            this.deleteventa();
        }
        if (this.state.namedelete == 'rol') {
            this.deleterol();
        }
        if (this.state.namedelete == 'usuario') {
            this.deleteusuario();
        }
        if (this.state.namedelete == 'promocion') {
            this.deletepromocion();
        }
    }
    deletevehiculotipo(page = 1) {
        var formdata = new FormData();
        formdata.append('idvehiculotipo', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculotipo/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'TIPO DE VEHICULO ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.tipo = response.data.pagination;
                    this.state.paginate.tipo = page;
                    this.setState({
                        array_vehiculotipo: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE SE ENCUENTRA EN UN VEHICULO REGISTRADO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletevehiculomarca(page = 1) {
        var formdata = new FormData();
        formdata.append('idmarca', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_marca/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar marca de vehiculo ..',
                    });
                    this.state.pagination.marca = response.data.pagination;
                    this.state.paginate.marca = page;
                    this.setState({
                        array_vehiculomarca: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'Warning',
                        description: 'No se pudo eliminar ya que se encuentra en un vehiculo registrado ..',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletevehiculomodelo(page = 1) {
        var formdata = new FormData();
        formdata.append('idmodelo', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_modelo/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar modelo de vehiculo ..',
                    });
                    this.state.pagination.modelo = response.data.pagination;
                    this.state.paginate.modelo = page;
                    this.setState({
                        array_vehiculomodelo: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'Warning',
                        description: 'No se pudo eliminar ya que se encuentra en un vehiculo registrado ..',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletevehiculocolor(page = 1) {
        var formdata = new FormData();
        formdata.append('idcolor', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_color/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar color de vehiculo ..',
                    });
                    this.state.pagination.color = response.data.pagination;
                    this.state.paginate.color = page;
                    this.setState({
                        array_vehiculocolor: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'Warning',
                        description: 'No se pudo eliminar ya que se encuentra en un vehiculo registrado ..',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletevehiculoyear(page = 1) {
        var formdata = new FormData();
        formdata.append('idyear', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_year/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar año de vehiculo ..',
                    });
                    this.state.pagination.year = response.data.pagination;
                    this.state.paginate.year = page;
                    this.setState({
                        array_vehiculoyear: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'Warning',
                        description: 'No se pudo eliminar ya que se encuentra en un vehiculo registrado ..',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletecliente(page = 1) {
        var formdata = new FormData();
        formdata.append('idcliente', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/cliente/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar cliente ..',
                    });
                    this.state.pagination.cliente = response.data.pagination;
                    this.state.paginate.cliente = page;
                    this.setState({
                        array_cliente: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'Warning',
                        description: 'No se pudo eliminar ya que se encuentra en un vehiculo registrado ..',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletevehiculo(page = 1) {
        var formdata = new FormData();
        formdata.append('idvehiculo', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'VEHICULO ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.vehiculo = response.data.pagination;
                    this.state.paginate.vehiculo = page;
                    this.setState({
                        array_vehiculo: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE SE ENCUENTRA EN UNA VENTA REGISTRADO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletemecanico(page = 1) {
        var formdata = new FormData();
        formdata.append('idmecanico', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/mecanico/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'MECANICO ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.mecanico = response.data.pagination;
                    this.state.paginate.mecanico = page;
                    this.setState({
                        array_mecanico: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE SE ENCUENTRA EN UNA VENTA REGISTRADO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deleteservicio(page = 1) {
        var formdata = new FormData();
        formdata.append('idservicio', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/servicio/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCEE',
                        description: 'SERVICIO ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.producto = response.data.pagination;
                    this.state.paginate.producto = page;
                    this.setState({
                        array_servicio: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE SE ENCUENTRA EN UNA VENTA REGISTRADO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletecategoria(page = 1) {
        var formdata = new FormData();
        formdata.append('idcategoria', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/categoria/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'CATEGORIA ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.categoria = response.data.pagination;
                    this.state.paginate.categoria = page;
                    this.setState({
                        array_categoria: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR. YA QUE SE ENCUENTRA REGISTRADO EN UN SERVICIO O PRODUCTO.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletearticulo(page = 1) {
        var formdata = new FormData();
        formdata.append('idarticulo', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/articulo/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'Success',
                        description: 'Exito en eliminar articulo ..',
                    });
                    this.state.pagination.articulo = response.data.pagination;
                    this.state.paginate.articulo = page;
                    this.setState({
                        array_articulo: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deleteventa(page = 1) {
        var formdata = new FormData();
        formdata.append('idventa', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/venta/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'VENTA ELIMINADO EXITOSAMENTE.',
                    });
                    this.state.pagination.venta = response.data.pagination;
                    this.state.paginate.venta = page;
                    this.setState({
                        array_venta: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }
    deleterol() {
        var formdata = new FormData();
        formdata.append('idrol', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/rol/delete',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    this.setState({
                        array_rol: response.data.data,
                    });
                }
                if (response.data.response == -1) {
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deleteusuario() {
        var formdata = new FormData();
        formdata.append('idusuario', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/usuario/delete',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    this.setState({
                        array_usuario: response.data.data,
                    });
                }
                if (response.data.response == -1) {
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    deletepromocion(page = 1) {
        var formdata = new FormData();
        formdata.append('idpromocion', this.state.iddelete);
        axios(
            {
                method: 'post',
                url: web.servidor + '/promocion/delete?page=' + page,
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'EXITO EN ELIMINAR PROMOCION.',
                    });
                    this.state.pagination.promocion = response.data.pagination;
                    this.state.paginate.promocion = page;
                    this.setState({
                        array_promocion: response.data.data.data,
                        pagination: this.state.pagination,
                        paginate: this.state.paginate,
                    });
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'WARNING',
                        description: 'NO SE PUDO ELIMINAR YA QUE EXISTE UNA TRANSACCION REALIZADA.',
                    });
                }
                this.onCloseModal();
            }
        ).catch(
            error => {
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO PROBLEMA AL REALIZAR LA SOLICITUD.',
                });
                this.onCloseModal();
            }
        );
    }
    onCloseModal() {
        this.setState({
            visible: false,
            loading: false,
            namedelete: '',
            iddelete: null,
        });
    }
    activeKeyVehiculo(data) {
        this.state.activeKey.vehiculo = data;
        this.setState({
            activeKey: this.state.activeKey,
        });
    }
    activeKeyAlmacen(data) {
        this.state.activeKey.almacen = data;
        this.setState({
            activeKey: this.state.activeKey,
        });
    }
    get_link(link = '', bandera = false) {

        this.state.menu.dashboards = '';
        this.state.menu.seguridad = '';
        this.state.menu.servicio = '';

        this.state.link.home = '';
        this.state.link.perfil = '';
        this.state.link.ajuste = '';
        this.state.link.usuario = '';
        this.state.link.rol = '';
        this.state.link.venta = '';
        this.state.link.cliente = '';
        this.state.link.mecanico = '';
        this.state.link.vehiculo = '';
        this.state.link.almacen = '';
        this.state.link.promocion = '';
        this.state.link.asignar_permiso = '';

        if (link == 'home') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.home = 'mm-active';
        }
        if (link == 'perfil') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.perfil = 'mm-active';
        }
        if (link == 'ajuste') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.ajuste = 'mm-active';
        }
        if (link == 'reporte') {
            this.state.menu.dashboards = 'mm-active';
            this.state.link.reporte = 'mm-active';
        }
        if (link == 'usuario') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.usuario = 'mm-active';
        }
        if (link == 'rol') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.rol = 'mm-active';
        }
        if (link == 'asignar_permiso') {
            this.state.menu.seguridad = 'mm-active';
            this.state.link.asignar_permiso = 'mm-active';
        }
        if (link == 'venta') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.venta = 'mm-active';
        }
        if (link == 'cliente') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.cliente = 'mm-active';
        }
        if (link == 'mecanico') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.mecanico = 'mm-active';
        }
        if (link == 'vehiculo') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.vehiculo = 'mm-active';
        }
        if (link == 'almacen') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.almacen = 'mm-active';
        }
        if (link == 'promocion') {
            this.state.menu.servicio = 'mm-active';
            this.state.link.promocion = 'mm-active';
        }
        this.setState({
            menu: this.state.menu,
            link: this.state.link,
            visible_drawer: bandera,
        });
    }
    loadingservice(bandera = false, visitasitio = '') {
        if (bandera) {
            return;
        }
        this.setState({
            visible_drawer: false,
            visitasitio: visitasitio,
        });
    }
    onLogout() {
        this.setState({ sesion: false, });
        notification.warning({
            message: 'SESION',
            description: 'TIEMPO DE SESION EXPIRADO. REDIRECCIONANDO A LOGIN.',
        });
        setTimeout(() => {
            document.getElementById('redirect_login').click();
        }, 3000);
    }

    onSelectColorHeader(data) {
        this.state.layoutoption.headercolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorSidebar(data) {
        this.state.layoutoption.sidebarcolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorFooter(data) {
        this.state.layoutoption.footercolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectColorButton(data) {
        this.state.layoutoption.buttoncolor = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    onSelectSizeLetra(data) {
        this.state.layoutoption.sizetext = data;
        this.setState({ layoutoption: this.state.layoutoption });
    }
    /*
     analisis externo
        politico
        economico
    */
    render() {
        if (!this.state.sesion) {
            return (
                <div className='app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar' 
                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}
                >
                    <a href={ web.home + "/login"} id='redirect_login' style={{display: 'none',}}> </a>
                    <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                        <div className='loaders'>
                            <div className='balls-scales-ripples-multiples'>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            
            <BrowserRouter>
                <div className="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar fixed-footer">
                    {/* <form action="/logout" method="post" id='cerrar_sesion' style={{display: 'none', }}>
                        <input type="hidden" name="_token" value={this.state.token} /> fixed-footer
                    </form> */}
                    
                    <Header 
                        usuario={this.state.usuario} token={this.state.token}
                        headercolor={this.state.layoutoption.headercolor} 
                    />

                    <div className="app-main">

                        <Sidebar 
                            menu_active={this.state.menu}
                            link_active={this.state.link}
                            init={this.init.bind(this)}
                            sidebarcolor={this.state.layoutoption.sidebarcolor}
                            sizetext={this.state.layoutoption.sizetext}
                            permisos_habilitados={this.state.permisos_habilitados}
                        />

                        <div className="app-main__outer">
                            <div className="app-main__inner">
                                <div className="app-page-title">

                                    <Route exact path={ web.home + '/home'} 
                                        render={props => 
                                            <Home get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                permisos_habilitados={this.state.permisos_habilitados}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/ajuste' } 
                                        render={ props => 
                                            <Ajuste { ...props} logout={this.onLogout.bind(this)}  
                                                onSelectColorHeader={this.onSelectColorHeader.bind(this)}  
                                                onSelectColorSidebar={this.onSelectColorSidebar.bind(this)}
                                                onSelectColorFooter={this.onSelectColorFooter.bind(this)}
                                                onSelectColorButton={this.onSelectColorButton.bind(this)}
                                                onSelectSizeLetra={this.onSelectSizeLetra.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                get_link={this.get_link.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                sizetext={this.state.layoutoption.sizetext}
                                            /> 
                                        }
                                    />
                                    <Route exact path={ web.serv_link + '/perfil'} 
                                        render={props => 
                                            <Perfil 
                                                get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                updatePerfil={this.updatePerfil.bind(this)}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/reporte_general'} 
                                        render={props => 
                                            <Reporte 
                                                get_link={this.get_link.bind(this)} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                                updatePerfil={this.updatePerfil.bind(this)}
                                                loading_page={this.state.loading_page}
                                                { ...props} 
                                            />
                                        } 
                                    />

                                    <Route exact path={ web.serv_link + '/usuario'} render={props => 
                                        <IndexUsuario { ...props} 
                                            getusuario={this.getusuario.bind(this)}
                                            usuario={this.state.array_usuario}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}
                                            onModalActive={this.onModalActive.bind(this)}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/usuario/edit/:id' }
                                        render={props => 
                                            <EditarUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />    
                                    <Route exact path={ web.serv_link + '/usuario/show/:id' }
                                        render={props => 
                                            <ShowUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />                                    
                                    <Route exact path={ web.serv_link + '/usuario/create' }
                                        render={props => 
                                            <CreateUsuario get_link={this.get_link.bind(this)} { ...props} 
                                                loadingservice={this.loadingservice.bind(this)}
                                                logout={this.onLogout.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />


                                    <Route exact path={ web.serv_link + '/rol'} render={props => 
                                        <IndexRol { ...props} 
                                            getrol={this.getrol.bind(this)}
                                            rol={this.state.array_rol}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}
                                            onModalActive={this.onModalActive.bind(this)}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/rol/create'}
                                        render={props => 
                                            <CreateRol get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />
                                    <Route exact path={ web.serv_link + '/rol/edit/:id'} 
                                        render={props => 
                                            <EditarRol get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />


                                    <Route exact path={ web.serv_link + '/asignar_permiso' }
                                        render={props => <Asignar_Permiso 
                                            get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/vehiculo_tipo'} render={props => 
                                        <IndexVehiculoTipo getvehiculotipo={this.getvehiculotipo.bind(this)}
                                            vehiculotipo={this.state.array_vehiculotipo}
                                            onModalActive={this.onModalActive.bind(this)} { ...props} 
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_tipo/create'} 
                                        render={props => 
                                        <CreateVehiculoTipo get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_tipo/editar/:id' }
                                        render={props => 
                                        <EditarVehiculoTipo get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/cliente'} render={props => 
                                        <IndexCliente { ...props} 
                                            getcliente={this.getcliente.bind(this)}
                                            cliente={this.state.array_cliente}

                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            onModalActive={this.onModalActive.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/create' }
                                        render={props => 
                                            <CreateCliente get_link={this.get_link.bind(this)} { ...props} 
                                                onStoreCliente={this.onStoreCliente.bind(this)}
                                                vehiculocreate={this.state.vehiculo_create.create}
                                                ventacreate={this.state.venta_create.create}
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/editar/:id'} 
                                        render={props => 
                                        <EditarCliente get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/cliente/show/:id'} 
                                        render={props => 
                                        <ShowCliente get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/vehiculo'} render={props => 
                                        <IndexVehiculo { ...props} 
                                            getvehiculo={this.getvehiculo.bind(this)}
                                            getvehiculotipo={this.getvehiculotipo.bind(this)}
                                            getvehiculomarca={this.getvehiculomarca.bind(this)}
                                            getvehiculomodelo={this.getvehiculomodelo.bind(this)}
                                            getvehiculocolor={this.getvehiculocolor.bind(this)}
                                            getvehiculoyear={this.getvehiculoyear.bind(this)}

                                            vehiculo={this.state.array_vehiculo}
                                            vehiculotipo={this.state.array_vehiculotipo}
                                            vehiculomarca={this.state.array_vehiculomarca}
                                            vehiculomodelo={this.state.array_vehiculomodelo}
                                            vehiculocolor={this.state.array_vehiculocolor}
                                            vehiculoyear={this.state.array_vehiculoyear}

                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            activeKey={this.state.activeKey.vehiculo}
                                            activeKeyVehiculo={this.activeKeyVehiculo.bind(this)}

                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo/create' }
                                        render={props => 
                                            <CreateVehiculo get_link={this.get_link.bind(this)} { ...props} 
                                                vehiculocreate={this.vehiculocreate.bind(this)}
                                                ventacreate={this.state.venta_create.create}
                                                venta={this.state.venta_create}
                                                vehiculo={this.state.vehiculo_create}
                                                onStoreVehiculo={this.onStoreVehiculo.bind(this)}
                                                initvehiculo={this.initvehiculo.bind(this)}
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />
                                        } 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo/editar/:id'} 
                                        render={props => 
                                            <EditarVehiculo get_link={this.get_link.bind(this)} { ...props} 
                                                vehiculocreate={this.vehiculocreate.bind(this)}
                                                initvehiculo={this.initvehiculo.bind(this)}
                                                vehiculo={this.state.vehiculo_create}
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />

                                    <Route exact path={ web.serv_link + '/vehiculo/show/:id'} 
                                        render={props => 
                                            <ShowVehiculo get_link={this.get_link.bind(this)} { ...props} 
                                                vehiculocreate={this.vehiculocreate.bind(this)}
                                                initvehiculo={this.initvehiculo.bind(this)}
                                                vehiculo={this.state.vehiculo_create}
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />

                                    <Route exact path={ web.serv_link + '/vehiculo_marca/create'} 
                                        render={props => 
                                        <CreateVehiculoMarca get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_marca/editar/:id'} 
                                        render={props => 
                                        <EditarVehiculoMarca get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_marca/show/:id'} 
                                        render={props => 
                                        <ShowMarca get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/vehiculo_modelo/create' }
                                        render={props => 
                                        <CreateVehiculoModelo get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_modelo/editar/:id'} 
                                        render={props => 
                                        <EditarVehiculoModelo get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/vehiculo_color/create'} 
                                        render={props => 
                                        <CreateVehiculoColor get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_color/editar/:id'} 
                                        render={props => 
                                        <EditarVehiculoColor get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_color/show/:id'} 
                                        render={props => 
                                        <ShowColor get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/vehiculo_year/create'} 
                                        render={props => 
                                        <CreateVehiculoYear get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/vehiculo_year/editar/:id'} 
                                        render={props => 
                                        <EditarVehiculoYear get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/mecanico'} render={props => 
                                        <IndexMecanico { ...props} 
                                            getmecanico={this.getmecanico.bind(this)}
                                            mecanico={this.state.array_mecanico}

                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mecanico/create'} 
                                        render={props => 
                                        <CreateMecanico get_link={this.get_link.bind(this)} { ...props}
                                            onStoreMecanico={this.onStoreMecanico.bind(this)}
                                            ventacreate={this.state.venta_create.create}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    /> 
                                    <Route exact path={ web.serv_link + '/mecanico/editar/:id'} 
                                        render={props => 
                                        <EditarMecanico get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mecanico/show/:id'} 
                                        render={props => 
                                        <ShowMecanico get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/almacen'} render={props => 
                                        <IndexServicio { ...props} 
                                            getservicio={this.getservicio.bind(this)}
                                            getcategoria={this.getcategoria.bind(this)}
                                            getarticulo={this.getarticulo.bind(this)}
                                            servicio={this.state.array_servicio}
                                            categoria={this.state.array_categoria}
                                            articulo={this.state.array_articulo}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}

                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            activeKey={this.state.activeKey.almacen}
                                            activeKeyAlmacen={this.activeKeyAlmacen.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/almacen/create'} 
                                        render={props => 
                                            <CreateServicio get_link={this.get_link.bind(this)} { ...props} 
                                                onStoreServicio={this.onStoreServicio.bind(this)}
                                                ventacreate={this.state.venta_create.create}
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />
                                        } 
                                    />
                                    <Route exact path={ web.serv_link + '/almacen/editar/:id'} 
                                        render={props => 
                                            <EditarServicio get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />
                                    <Route exact path={ web.serv_link + '/almacen/show/:id'} 
                                        render={props => 
                                            <ShowServicio get_link={this.get_link.bind(this)} { ...props} 
                                                logout={this.onLogout.bind(this)}
                                                loadingservice={this.loadingservice.bind(this)}
                                                buttoncolor={this.state.layoutoption.buttoncolor}
                                            />} 
                                    />


                                    <Route exact path={ web.serv_link + '/categoria/create'} 
                                        render={props => 
                                        <CreateCategoria get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/categoria/editar/:id'} 
                                        render={props => 
                                        <EditarCategoria get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/categoria/show/:id'} 
                                        render={props => 
                                        <ShowCategoria get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/articulo'} render={props => 
                                        <IndexArticulo articulo={this.state.array_articulo} 
                                            getarticulo={this.getarticulo.bind(this)}
                                            onModalActive={this.onModalActive.bind(this)} { ...props} 
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/articulo/create'} 
                                        render={props => 
                                        <CreateArticulo get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/articulo/editar/:id'} 
                                        render={props => 
                                        <EditarArticulo get_link={this.get_link.bind(this)} { ...props}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/articulo/show/:id'} 
                                        render={props => 
                                        <ShowArticulo get_link={this.get_link.bind(this)} { ...props}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />


                                    <Route exact path={ web.serv_link + '/mantenimiento'} render={props => 
                                        <IndexVenta { ...props} 
                                            getventa={this.getventa.bind(this)}
                                            venta={this.state.array_venta}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/mantenimiento/create'} render={props => 
                                        <CreateVenta { ...props} 
                                            get_link={this.get_link.bind(this)}
                                            venta={this.state.venta_create}
                                            ventacreate={this.ventacreate.bind(this)}
                                            initventa={this.initventa.bind(this)}
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                    <Route exact path={ web.serv_link + '/promocion'} render={props => 
                                        <IndexPromocion { ...props} 
                                            getpromocion={this.getpromocion.bind(this)}
                                            promocion={this.state.array_promocion}
                                            onModalActive={this.onModalActive.bind(this)} { ...props}
                                            pagination= {this.state.pagination}
                                            paginate= {this.state.paginate}

                                            get_link={this.get_link.bind(this)}
                                            logout={this.onLogout.bind(this)}

                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                            permisos_habilitados={this.state.permisos_habilitados}

                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/promocion/create'} 
                                        render={props => 
                                        <CreatePromocion get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />
                                    <Route exact path={ web.serv_link + '/promocion/editar/:id'} 
                                        render={props => 
                                        <EditarPromocion get_link={this.get_link.bind(this)} { ...props} 
                                            logout={this.onLogout.bind(this)}
                                            loadingservice={this.loadingservice.bind(this)}
                                            buttoncolor={this.state.layoutoption.buttoncolor}
                                        />} 
                                    />

                                </div>
                            </div>

                            <Footer footercolor={this.state.layoutoption.footercolor}
                                visitasitio={this.state.visitasitio} 
                            />
                            
                        </div>
                    </div>
                    
                    <div className="modal fade bd-example-modal-lg show" 
                        style={{display: (this.state.visible)?'block':'none', paddingRight: 17}}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">Eliminar Registro</h5>
                                    {(this.state.loading)?null:
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                            onClick={this.onCloseModal.bind(this)}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    }
                                </div>
                                <div className="modal-body">
                                    {(this.state.loading)?
                                        <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                                            <div className='loaders'>
                                                <div className='balls-scales-multiples'>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <p>Estas seguro de eliminar {this.state.namedelete}?</p>
                                    }
                                </div>
                                {(this.state.loading)?null:
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                            onClick={this.onCloseModal.bind(this)}
                                        >
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-primary"
                                            onClick={this.onEliminar.bind(this)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" 
                        style={{display: (this.state.visible)?'block':'none'}}
                    ></div>

                    {/* <div className='ui-theme-settings'>
                        <button type="button" id="TooltipDemo" className="btn-open-options btn btn-primary">
                            <i className="fa fa-cog fa-w-16 fa-spin fa-2x"></i>
                        </button>
                        <div className='theme-settings__inner'></div>
                    </div> */}

                    <Drawer
                        title={null} placement={'top'}
                        visible={this.state.visible_drawer} closable={false}
                        height={'100vh'} key={'top'}
                        bodyStyle={{ backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',
                            border: '4px solid #eee',
                        }}
                    >
                        <div className='card-body' 
                            style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', }}
                        >
                            <h5 className="card-title font-size-lg">taller mecanico rotterdam</h5>
                        </div>
                        <div className="avatar-icon-wrapper avatar-icon-xl btn-hover-shine">
                            <div className="avatar-icon rounded logo_img">
                                <img src={ web.img_servidor + '/img/logo.png'} alt="Avatar 5" />
                            </div>
                        </div>
                    </Drawer>

                </div>   
            </BrowserRouter>
        );
    }
}

if (document.getElementById('raiz-index')) {
    ReactDOM.render(<Index />, document.getElementById('raiz-index'));
}

