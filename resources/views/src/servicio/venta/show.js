
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import { Card, Modal, Table, notification, Upload, Popover, Tooltip, Pagination, Button, Tag, InputNumber, Popconfirm, Input, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

const tabList = [
    {
        key: 'tab1',
        tab: 'GENERAL',
    },
    {
        key: 'tab2',
        tab: 'REFACCIONES',
    },
];

const objeto_vehiculo = { idvehiculo: null, placa: '',
    marca: '', modelo: '', color: '', serie: '',
};

class ShowVenta extends Component {

    constructor(props) {
        super(props);
        this.state = {

            visible_clienteshow: false,
            visible_cliente: false,
            visible_mecanico: false,
            visible_servicio: false,
            loading: false,

            auth: false,
            key: 'tab1',

            nroventa: 0,
            codigo: '',
            errorcodigo: '',
            fechaventa: this.fechaActual(),
            horaventa: this.horaActual(),
            observaciones: '',

            array_mecanico: [],
            pagination_mecanico: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina_mecanico: 1,

            array_cliente: [],
            pagination_cliente: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina_cliente: 1,

            array_servicio: [],
            pagination_servicio: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina_servicio: 1,

            array_serviciosselected: [
                {
                    id: null, codigo: null, descripcion: null, precio: null,
                    stockactual: null, tipo: null, imagen: null, costo : null,
                    comision: null, idmecanico: null, mecanico: null, cantidad: null,
                    descuento: null, montodescuento: null, subtotal: null, nota: null, visible_nota: false,
                    visible_cantidad: false, visible_precio: false, visible_desc: false,
                    array_articulo: [], visible_articulo: false, error: null,
                },
            ],

            array_vehiculo: [{ idvehiculo: null, placa: '',
                marca: '', modelo: '',  color: '', serie: '',
            }],

            cliente_first: {
                idcliente: null, nombre: '', empresa: '', 
                nit: '', email: '',
            },
            mecanico_first: {
                idmecanico: null, nombre: '', telefono: '',
                email: '', celular: '',
            },
            vehiculo_first: {
                idvehiculo: null, marca: '', placa: '',
                modelo: '', color: '', serie: '',
            },
            servicio_first: {
                id: null, codigo: '', descripcion: '', costo: '',
                precio: '', stockactual: '', tipo: '', comision: '', imagen: null,
            },

            array_articulo: [],

            subtotal: 0,
            descuento: 0,
            visible_descuento: false,
            total: 0,
            cantidadtotal: 0,

            search_cliente: '',
            search_mecanico: '',
            search_servicio: '',

            error_servicio: '',

            timeoutSearch: undefined,
            active_searchcliente: 'active',
            active_searchmecanico: 'active',
            active_searchservicio: 'active',
        };
    }
    fechaActual() {
        let date = new Date();

        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 ;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        var arraydia = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        var arraymes = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 
            'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        //return day + '/' + month + '/' + year;
        return arraydia[date.getDay()] + ', ' + day + ' de ' + arraymes[date.getMonth()] + ' de ' + year;
    }
    horaActual() {
        let date = new Date();
        let hora = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minuto = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let segundo = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return hora + ':' + minuto;

    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/venta/show/' + this.props.match.params.id ).then(
            (response) => {
                console.log(response)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        var object_servicio = {
                            id: null, codigo: null, descripcion: null, precio: null,
                            stockactual: null, tipo: null, imagen: null, costo : null,
                            comision: null, idmecanico: null, mecanico: null, cantidad: null,
                            descuento: null, montodescuento: null, subtotal: null, nota: null, visible_nota: false,
                            visible_cantidad: false, visible_precio: false, visible_desc: false,
                            array_articulo: [], visible_articulo: false, 
                        };
                        this.state.array_vehiculo = response.data.array_vehiculo;
                        
                        this.props.loadingservice(false, response.data.visitasitio);

                        this.state.cliente_first = {
                            idcliente: response.data.data.idcliente, 
                            nombre: response.data.data.apellido == null ? response.data.data.nombre : response.data.data.nombre + ' ' + response.data.data.apellido, 
                            empresa: response.data.data.razonsocial == null ? '' : response.data.data.razonsocial, 
                            nit: response.data.data.nit == null ? '' : response.data.data.nit, 
                            email: response.data.data.email == null ? '' : response.data.data.email,
                        };

                        this.state.vehiculo_first = {
                            idvehiculo: response.data.data.idvehiculo, 
                            marca: response.data.data.marca, placa: response.data.data.placa,
                            modelo: response.data.data.modelo, color: response.data.data.color, 
                            serie: response.data.data.nroserie == null ? '' : response.data.data.nroserie,
                        };

                        this.state.array_serviciosselected = [];

                        for (let i = 0; i < response.data.detalle.length; i++) {

                            var element = response.data.detalle[i];
                            var obj = {
                                id: element.idservicio, codigo: element.codigo == null ? '' : element.codigo, 
                                descripcion: element.descripcion, precio: element.precio,
                                stockactual: element.stockactual, tipo: element.tipo, imagen: element.imagen, 
                                costo : element.costo == null ? '' : element.costo,
                                comision: element.comision == null ? '' : element.comision, 
                                idmecanico: null, mecanico: null, cantidad: element.cantidad,
                                descuento: element.descuento, montodescuento: element.montodescuento, 
                                subtotal: element.cantidad * element.precio, 
                                nota: element.nota == null ? '' : element.nota, visible_nota: false,
                                visible_cantidad: false, visible_precio: false, visible_desc: false,
                                array_articulo: [], visible_articulo: false, 
                            };
                            this.state.array_serviciosselected.push(obj);

                            if (element.idmecanico != null) {
                                this.state.mecanico_first = {
                                    idmecanico: element.idmecanico, 
                                    nombre: element.apellido == null ? element.nombre : element.nombre + ' ' + element.apellido, 
                                    telefono: element.telefono == null ? '' : element.telefono,
                                    email: element.email == null ? '' : element.email, 
                                    celular: element.celular == null ? '' : element.celular,
                                };
                            }

                        }

                        for (let i = 0; i < 2; i ++) {
                            this.state.array_vehiculo.push(objeto_vehiculo);
                            this.state.array_serviciosselected.push(object_servicio);
                        }


                        this.setState({
                            nroventa: response.data.data.id,
                            array_vehiculo: this.state.array_vehiculo,
                            array_serviciosselected: this.state.array_serviciosselected,
                            cliente_first: this.state.cliente_first,
                            vehiculo_first: this.state.vehiculo_first,
                            observaciones: response.data.data.nota == null ? 'S / Observacion': response.data.data.nota,
                            subtotal: response.data.data.montototal * 1 + response.data.data.montodescuento * 1,
                            descuento: response.data.data.descuento,
                            total: response.data.data.montototal,
                            mecanico_first: this.state.mecanico_first,
                        });
                        return;
                    }
                }
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
            }
        ).catch( error => {
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
            console.log(error)
        } );
    }
    ondataventa() {
        var objeto = {
            create: 1, codigo: this.state.codigo, array_vehiculo: this.state.array_vehiculo,
            nroventa: this.state.nroventa, observaciones: this.state.observaciones,
            cliente_first: this.state.cliente_first, vehiculo_first: this.state.vehiculo_first,
            mecanico_first: this.state.mecanico_first, array_serviciosselected: this.state.array_serviciosselected,
            array_articulo: this.state.array_articulo, descuento: this.state.descuento, key: this.state.key,
        };
        return objeto;
    }
    onChangeIDCliente(data) {
        this.state.cliente_first.idcliente = data.id;
        this.state.cliente_first.nombre = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido;
        this.state.cliente_first.empresa = data.razonsocial == null ? '' : data.razonsocial;
        this.state.cliente_first.nit = data.nit == null ? '' : data.nit;
        this.state.cliente_first.email = data.email == null ? '' : data.email;
        this.setState({
            cliente_first: this.state.cliente_first,
        });
        this.onVehiculoCliente(data.id);
    }
    onChangeIDMecanico(data) {
        //console.log(data)
        this.state.mecanico_first.idmecanico = data.id;
        this.state.mecanico_first.nombre = data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido;
        this.state.mecanico_first.telefono = data.telefono == null ? '' : data.telefono;
        this.state.mecanico_first.celular = data.celular == null ? '' : data.celular;
        this.state.mecanico_first.email = data.email == null ? '' : data.email;
        this.setState({
            mecanico_first: this.state.mecanico_first,
            visible_mecanico: false,
            fechaventa: this.fechaActual(),
            horaventa: this.horaActual(),
        })
    }
    existe_servicio(id) {
        for (let index = 0; index < this.state.array_serviciosselected.length; index++) {
            const data = this.state.array_serviciosselected[index];
            if (data.id == id) {
                return true;
            }
        }
        return false;
    }
    onChangeIDServicio(data) {

        if (this.existe_servicio(data.id)) {
            notification.warning({
                message: 'WARNING',
                description: 'EL PRODUCTO O SERVICIO YA HA SIDO SELECCIONADO.',
            });
            return;
        }

        var bandera = true;

        var object_servicio = {
            id: data.id, codigo: data.codigo, descripcion: data.descripcion, precio: data.precio,
            stockactual: data.stockactual, tipo: data.tipo, imagen: data.imagen, costo : data.costo,
            comision: data.comision, idmecanico: null, mecanico: null, cantidad: 1,
            descuento: 0, montodescuento: 0, subtotal: data.precio, nota: '', visible_nota: false,
            visible_cantidad: false, visible_precio: false, visible_desc: false,
            array_articulo: [], visible_articulo: false, error: null,
        };

        for (let index = 0; index < this.state.array_serviciosselected.length; index++) {
            var element = this.state.array_serviciosselected[index];
            if (element.id == null) {
                this.state.array_serviciosselected[index] = object_servicio;
                bandera = false;
                break;
            }
        }
        if (bandera) this.state.array_serviciosselected.push(object_servicio);

        object_servicio = {
            id: null, codigo: null, descripcion: null, precio: null,
            stockactual: null, tipo: null, imagen: null, costo : null,
            comision: null, idmecanico: null, mecanico: null, cantidad: null,
            descuento: null, montodescuento: null, subtotal: null, nota: null, visible_nota: false,
            visible_cantidad: false, visible_precio: false, visible_desc: false,
            array_articulo: [], visible_articulo: false, error: null,
        };

        this.state.array_serviciosselected.push(object_servicio);

        this.setState({
            array_serviciosselected: this.state.array_serviciosselected,
            visible_servicio: false, error_servicio: '',
        }, () => this.ongenerarTotal() );
    }
    onDeleteCliente() {
        var cliente_first = {idcliente: null, nombre: '', empresa: '', nit: '', email: '',};
        var vehiculo_first = { idvehiculo: null, marca: '', placa: '', modelo: '', color: '', serie: '', };
        var array = [];
        for (let i = 0; i < 5; i ++) {
            array.push(objeto_vehiculo);
        }
        this.setState({
            cliente_first: cliente_first,
            vehiculo_first: vehiculo_first,
            array_vehiculo: array,
            fechaventa: this.fechaActual(),
            horaventa: this.horaActual(),
        });
    }
    onDeleteMecanico() {
        var mecanico_first = { idmecanico: null, nombre: '', 
            telefono: '', email: '', celular: '',
        };
        this.setState({
            mecanico_first: mecanico_first,
            fechaventa: this.fechaActual(),
            horaventa: this.horaActual(),
        });
    }
    onVehiculoCliente(id) {
        axios( {
            method: 'get',
            url: web.servidor + '/venta/vehiculo_cliente',
            params: {idcliente: id,},
            responseType: 'json',
        } ).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.setState({ visible_cliente: false, });
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        if (response.data.data.length > 0) {
                            notification.success({
                                message: 'SUCCESS',
                                description: 'VEHICULOS DEL CLIENTE EXTRAIDO EXITOSAMENTE.',
                            });
                        }else {
                            notification.error({
                                message: 'WARNING',
                                description: 'EL CLIENTE NO TIENE VEHICULO. FAVOR DE REGISTRAR UNO.',
                            });
                        }
                        var array = response.data.data;
                        for (let i = 0; i < 5; i ++) {
                            array.push(objeto_vehiculo);
                        }
                        this.setState({
                            array_vehiculo: array,
                            visible_cliente: false,
                            horaventa: this.horaActual(),
                            fechaventa: this.fechaActual(),
                        });
                    }
                }
            }
        ).catch( error => {
            console.log(error)
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    get_mecanico(page = 1, search = '') {
        axios.get( web.servidor + '/mecanico/search_name?page=' + page + '&search=' + search + '&nropaginate=' + 20).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_mecanico: response.data.data.data,
                            pagination_mecanico: response.data.pagination,
                            pagina_mecanico: response.data.data.data.length > 0 ? page : 0,
                            visible_mecanico: true, search_mecanico: '',
                            horaventa: this.horaActual(),  fechaventa: this.fechaActual(),
                        });
                    }
                }
            }
        ).catch( error => { 
            console.log(error); console.log(error.response); 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });

        });
    }
    get_cliente(page = 1, search = '') {
        axios.get( web.servidor + '/cliente/search_name?page=' + page + '&search=' + search + '&nropaginate=' + 20).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        //console.log(response.data)
                        this.setState({
                            array_cliente: response.data.data.data,
                            pagination_cliente: response.data.pagination,
                            pagina_cliente: response.data.data.data.length > 0 ? page : 0,
                            visible_cliente: true, search_cliente: '',
                            horaventa: this.horaActual(),  fechaventa: this.fechaActual(),
                        });
                    }
                }
            }
        ).catch( error => { 
            console.log(error); console.log(error.response); 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    get_servicio(page = 1, search = '') {
        axios.get( web.servidor + '/servicio/search_decripcion?page=' + page + '&search=' + search + '&nropaginate=' + 20).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        console.log(response.data)
                        this.state.array_servicio = [];
                        for (let index = 0; index < response.data.data.data.length; index++) {
                            const element = response.data.data.data[index];
                            if (element.tipo == 'S') {
                                this.state.array_servicio.push(element);
                            }
                            if (element.tipo == 'P') {
                                if (element.stockactual * 1 > 0) {
                                    this.state.array_servicio.push(element);
                                }
                            }
                        }
                        this.setState({
                            array_servicio: this.state.array_servicio,
                            pagination_servicio: response.data.pagination,
                            pagina_servicio: response.data.data.data.length > 0 ? page : 0,
                            visible_servicio: true, search_servicio: '',
                            horaventa: this.horaActual(),  fechaventa: this.fechaActual(),
                        });
                    }
                }
            }
        ).catch( error => { 
            console.log(error); console.log(error.response); 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        var cantidad = 0;
        for (let index = 0; index < this.state.array_serviciosselected.length; index++) {
            var data = this.state.array_serviciosselected[index];
            if (data.id == null) {
                cantidad++;
            }
            if (data.id != null && data.cantidad <= 0) {
                this.state.array_serviciosselected[index].error = 'error';
                this.setState({ array_serviciosselected: this.state.array_serviciosselected, key: 'tab2' });
                notification.error({
                    message: 'ERROR',
                    description: 'LA CANTIDAD DEL ' + data.descripcion.toUpperCase() + ' DEBE SER MAYOR A CERO',
                });
                return;
            }
            if (data.id != null && data.precio <= 0) {
                this.state.array_serviciosselected[index].error = 'error';
                this.setState({ array_serviciosselected: this.sate.array_serviciosselected, key: 'tab2' });
                notification.error({
                    message: 'ERROR',
                    description: 'EL PRECIO DEL ' + data.descripcion.toUpperCase() + ' DEBE SER MAYOR A CERO',
                });
                return;
            }
        }
        if (cantidad == this.state.array_serviciosselected.length) {
            this.setState({
                key: 'tab2', error_servicio: 'error',
            });
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE SELECCIONAR AL MENOS UN PRODUCTO O SERVICIO',
            });
            return;
        }
        this.onSesion();
    }
    onSesion() {
        this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                this.onSubmit();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ loading: false, });
        } ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {

        let date = new Date();
        let fechaventa = '';
        let horaventa = '';

        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 ;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        fechaventa = year + '-' + month + '-' + day;

        let hora = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minuto = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let segundo = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        horaventa = hora + ':' + minuto + ':' + segundo;

        let montodescuento = parseFloat( this.state.subtotal * (this.state.descuento * 1 / 100) ).toFixed(2);

        this.setState({ loading: true, });

        var formdata = new FormData();
        formdata.append('array_producto', JSON.stringify(this.state.array_serviciosselected));
        formdata.append('cliente', JSON.stringify(this.state.cliente_first));
        formdata.append('vehiculo', JSON.stringify(this.state.vehiculo_first));
        formdata.append('mecanico', JSON.stringify(this.state.mecanico_first));
        formdata.append('codigo', this.state.codigo);
        formdata.append('fechaventa', fechaventa);
        formdata.append('horaventa', horaventa);
        formdata.append('observaciones', this.state.observaciones);
        formdata.append('descuento', this.state.descuento);
        formdata.append('montodescuento', montodescuento);
        formdata.append('cantidadtotal', this.state.cantidadtotal);
        formdata.append('total', this.state.total);

        axios(
            {
                method: 'post',
                url: web.servidor + '/venta/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                console.log(response)
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'VENTA CREADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'WARNING',
                            description: 'EL CODIGO DE LA VENTA YA EXISTE. INTENTAR NUEVAMENTE.',
                        });
                        this.setState({
                            loading: false, errorcodigo: 'error',
                        });
                        return;
                    }
                }
                this.setState({ loading: false, });
            }
        ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO ERROR AL PROCESAR SOLICITUD. FAVOR DE INTENTAR NUEVAMENTE',
            });
            if (error.response.status == 401) { }
        } );
    }
    onModalCliente() {
        var cliente = this.state.cliente_first;
        return (
            <Modal
                title={null}
                visible={this.state.visible_cliente}
                onCancel={() => this.setState({ visible_cliente: false, search_cliente: '', })}
                footer={null} style={{ top: 50, }} width={800}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
            >
                <div className="forms-groups" style={{position: 'relative',}}>
                    <div style={{marginTop: 30, }}></div>
                    <button className="btn-hover-shine btn btn-primary pull-right mb-2"
                        onClick={() => {
                            this.props.ventacreate(this.ondataventa());
                            setTimeout(() => {
                                this.props.history.push( web.serv_link + '/cliente/create');
                            }, 500);
                        }}
                        style={{position: 'absolute', top: 8, left: 20, fontSize: 10, }}
                    >
                        NUEVO CLIENTE
                    </button>
                    <div className='forms-groups' style={{display: 'flex', justifyContent: 'center', paddingBottom: 10,}}>
                        <div className={`search-wrapper ${this.state.active_searchcliente}`}>
                            <div className="input-holder">
                                <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                    value={this.state.search_cliente} onChange={(event) => this.setState({search_cliente: event.target.value,}) }
                                />
                                <button className="search-icon" onClick={ () => this.setState({active_searchcliente: 'active'}) }><span></span></button>
                            </div>
                            <button className="close" onClick={ () => this.setState({ active_searchcliente: '', search_cliente: '', }) }></button>
                        </div>
                    </div>
                    <Card title="LISTADO DE CLIENTE" 
                        bodyStyle={{ padding: 0, paddingRight: 20, paddingLeft: 5, }}
                        headStyle={{color: 'white', fontSize: 14, background: '#1890ff', fontWeight: 'bold',}}
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                            <Card.Grid hoverable={false} className='gridStyle grid_15' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                NRO
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_65' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                NOMBRE
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_20' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                NIT
                            </Card.Grid>
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{ padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto', overflowX: 'none', }}
                        >
                            {this.state.array_cliente.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' id='altura_scroll'
                                        style={{ padding: 0, }} key={key}
                                        onClick={this.onChangeIDCliente.bind(this, data)}
                                    >
                                        <Card.Grid hoverable={false} className='gridStyle grid_15 ptb-20' 
                                            style={{cursor: 'pointer', fontSize: 12, 
                                                background: (cliente.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                color: (cliente.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (cliente.idcliente == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                             { ( (this.state.pagina_cliente - 1) * 20) + (key + 1) }
                                         </Card.Grid>
                                         <Card.Grid hoverable={false} className='gridStyle grid_65 ptb-20' 
                                             style={{cursor: 'pointer', fontSize: 12, 
                                                 background: (cliente.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                 color: (cliente.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (cliente.idcliente == data.id) ? 'bold' : '400',
                                             }}
                                        >
                                            { data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido }
                                        </Card.Grid>
                                        <Card.Grid hoverable={false} className='gridStyle grid_20 ptb-20' 
                                            style={{cursor: 'pointer', fontSize: 12, 
                                                background: (cliente.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                color: (cliente.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (cliente.idcliente == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                            { data.nit == null ? 'S/Nit' : data.nit }
                                        </Card.Grid>
                                    </div>
                                )
                            )}
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{paddingTop: 8, paddingBottom: 15, border: '1px solid #e8e8e8', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Pagination className='paginate_number' pageSize={20} current={this.state.pagina_cliente}
                                onChange={ (page) => this.get_cliente(page) } simple 
                                total={this.state.pagination_cliente.total} 
                                itemRender={(current, type, originalElement) => {
                                    if (type == 'prev') return <Button>Previous</Button>;
                                    if (type == 'next') return <Button>Next</Button>;
                                    return originalElement;
                                }} 
                            />
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onModalMecanico() {
        var mecanico = this.state.mecanico_first;
        return (
            <Modal
                title={null}
                visible={this.state.visible_mecanico}
                onCancel={() => this.setState({ visible_mecanico: false, search_mecanico: '', })}
                footer={null}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 50, }}
                width={500}
            >
                <div className="forms-groups">
                    <div style={{marginTop: 50, }}></div>
                    <button className="btn-hover-shine btn btn-primary pull-right mb-2"
                        onClick={() => {
                            this.props.ventacreate(this.ondataventa());
                            setTimeout(() => {
                                this.props.history.push( web.serv_link + '/mecanico/create');
                            }, 500);
                        }}
                        style={{position: 'absolute', top: 17, left: 20, fontSize: 10, }}
                    >
                        NUEVO MECANICO
                    </button>
                    <div className='forms-groups' style={{display: 'flex', justifyContent: 'center', paddingBottom: 10,}}>
                        <div className={`search-wrapper ${this.state.active_searchmecanico}`}>
                            <div className="input-holder">
                                <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                    value={this.state.search_mecanico} onChange={(event) => this.setState({search_mecanico: event.target.value,}) }
                                />
                                <button className="search-icon" onClick={ () => this.setState({active_searchmecanico: 'active'}) }><span></span></button>
                            </div>
                            <button className="close" onClick={ () => this.setState({ active_searchmecanico: '', search_mecanico: '', }) }></button>
                        </div>
                    </div>
                    <Card title="LISTADO DE MECANICO" 
                        bodyStyle={{ padding: 0, }}
                        headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold', fontSize: 14, }}
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{ padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto', overflowX: 'none', }}
                        >
                            {this.state.array_mecanico.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ padding: 0, }} key={key}
                                        onClick={this.onChangeIDMecanico.bind(this, data)}
                                    >
                                        <Card.Grid hoverable={false}
                                            style={{ cursor: 'pointer', width: '100%', fontSize: 13,
                                                height: 20, lineHeight: 0, textAlign: 'left',
                                                background: (mecanico.idmecanico == data.id) ? '#e0f3ff' : 'white',
                                                color: (mecanico.idmecanico == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (mecanico.idmecanico == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                            {data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido}
                                        </Card.Grid>
                                    </div>
                                )
                            )}
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{paddingTop: 8, paddingBottom: 15, border: '1px solid #e8e8e8', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Pagination className='paginate_number' pageSize={20} current={this.state.pagina_mecanico}
                                onChange={ (page) => this.get_mecanico(page) } simple 
                                total={this.state.pagination_mecanico.total} 
                                itemRender={(current, type, originalElement) => {
                                    if (type == 'prev') return <Button>Previous</Button>;
                                    if (type == 'next') return <Button>Next</Button>;
                                    return originalElement;
                                }} 
                            />
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onSelectedServicio(data) {
        for (let index = 0; index < this.state.array_serviciosselected.length; index++) {
            var element = this.state.array_serviciosselected[index];
            if (element.id == data.id) {
                return true;
            }
        }
        return false;
    }
    onModalServicio() {
        var servicio = this.state.servicio_first;
        return (
            <Modal
                title={null} footer={null}
                visible={this.state.visible_servicio}
                onCancel={() => this.setState({ visible_servicio: false, search_servicio: '', })}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 50, }} width={800}
            >
                <div className="forms-groups" style={{position: 'relative',}}>
                    <div style={{marginTop: 35, }}></div>
                    <button className="btn-hover-shine btn btn-primary pull-right mb-2"
                        onClick={() => {
                            this.props.ventacreate(this.ondataventa());
                            setTimeout(() => {
                                this.props.history.push( web.serv_link + '/almacen/create');
                            }, 500);
                        }}
                        style={{position: 'absolute', top: 2, left: 20, }}
                    >
                        NUEVO SERVICIO
                    </button>
                    <div className='forms-groups' style={{display: 'flex', justifyContent: 'center', paddingBottom: 20,}}>
                        <div className={`search-wrapper ${this.state.active_searchservicio}`}>
                            <div className="input-holder">
                                <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                    value={this.state.search_servicio} onChange={(event) => this.setState({search_servicio: event.target.value,}) }
                                />
                                <button className="search-icon" onClick={ () => this.setState({active_searchservicio: 'active'}) }><span></span></button>
                            </div>
                            <button className="close" onClick={ () => this.setState({ active_searchservicio: '', search_servicio: '', }) }></button>
                        </div>
                    </div>
                    <Card title="LISTADO DE SERVICIO" 
                        bodyStyle={{ padding: 0, paddingRight: 20, paddingLeft: 5, }}
                        headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold',}}
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                            <Card.Grid hoverable={false} className='gridStyle grid_15' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                NRO
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_60' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                DESCRIPCION
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle grid_25' 
                                style={{background: '#1890ff', color: 'white', fontSize: 13, fontWeight: 'bold', paddingLeft: 40, }}
                            >
                                DETALLES
                            </Card.Grid>
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{ padding: 0, height: 'auto', /*width: 'calc(100% + 20px)',*/ maxHeight: 350, overflowY: 'auto', overflowX: 'none', }}
                        >
                            {this.state.array_servicio.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ padding: 0, }} key={key}
                                        onClick={this.onChangeIDServicio.bind(this, data)}
                                    >
                                        <Card.Grid hoverable={true} className='gridStyle grid_15 line_hg_20 ptb-20' 
                                            style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                            }}
                                        >
                                             { ( (this.state.pagina_servicio - 1) * 20) + (key + 1) }
                                         </Card.Grid>
                                         <Card.Grid hoverable={true} className='gridStyle grid_60 line_hg_20 ptb-20' 
                                             style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                             }}
                                        >
                                            <div style={{display: 'block', fontSize: 12, }}>
                                                <div style= {{ display: 'flex', fontWeight: '500', }}>
                                                    <strong style={{ width: 90, }}>Codigo: </strong> { data.codigo == null ? 'S/Codigo' : data.codigo }
                                                </div>
                                                <div style= {{ display: 'flex', fontWeight: '500', }}>
                                                    <strong style={{ width: 90, }}>Descripcion: </strong> { data.descripcion }
                                                </div>
                                            </div>
                                            {data.tipo == 'P' ?
                                                <Tag color="green" style={{position: 'absolute', top: 7, right: 8, }}>PRODUCTO</Tag> :
                                                <Tag color="blue" style={{position: 'absolute', top: 7, right: 8, }}>SERVICIO</Tag> 
                                            }
                                        </Card.Grid>
                                        <Card.Grid hoverable={true} className='gridStyle grid_25 line_hg_20 ptb-20' 
                                            style={{cursor: 'pointer', position: 'relative', 
                                                background: (this.onSelectedServicio(data)) ? '#e0f3ff' : 'white',
                                            }}
                                        >
                                            <div style={{display: 'block', fontSize: 12, }}>
                                                <div style= {{color: '#6f42c1', fontWeight: '500', display: 'flex', }}>
                                                    <strong style={{color: '#20c997', width: 55, }}>Precio: </strong> { data.precio }
                                                </div>
                                                {data.tipo == 'S' ? null :
                                                    <div style= {{color: '#6f42c1', fontWeight: '500', display: 'flex', }}>
                                                        <strong style={{color: '#20c997', width: 55, }}>Stock: </strong> { data.stockactual }
                                                    </div>
                                                }
                                            </div>
                                        </Card.Grid>
                                    </div>
                                )
                            )}
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                            style={{paddingTop: 8, paddingBottom: 15, border: '1px solid #e8e8e8', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Pagination className='paginate_number' pageSize={20} current={this.state.pagina_servicio}
                                onChange={ (page) => this.get_servicio(page) } simple 
                                total={this.state.pagination_servicio.total} 
                                itemRender={(current, type, originalElement) => {
                                    if (type == 'prev') return <Button>Previous</Button>;
                                    if (type == 'next') return <Button>Next</Button>;
                                    return originalElement;
                                }} 
                            />
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onChangeNombreCliente(event) {
        this.state.cliente_first.nombre = event.target.value;
        this.setState({
            cliente_first: this.state.cliente_first,
        });
    }
    onChangeEmpresaCliente(event) {
        this.state.cliente_first.empresa = event.target.value;
        this.setState({
            cliente_first: this.state.cliente_first,
        });
    }
    onChangeNitCliente(event) {
        this.state.cliente_first.nit = event.target.value;
        this.setState({
            cliente_first: this.state.cliente_first,
        });
    }
    onChangeEmailCliente(event) {
        this.state.cliente_first.email = event.target.value;
        this.setState({
            cliente_first: this.state.cliente_first,
        });
    }
    cargar_general() {
        return (
            <div className="forms-groups" style={{ marginTop: -30, }}>

                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12 txts-center'>
                    
                    <div className="forms-groups" style={{marginTop: -5}}>
                        <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Fecha Venta'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 10, cursor: 'default', background: '#eee', }}
                                    className={`forms-control`} value={this.state.fechaventa}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 10, cursor: 'default', background: '#eee', }}
                                    className={`forms-control`} value={this.state.horaventa}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15}}>
                        <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <textarea type='text' placeholder='Ingresar Descripcion' 
                                    style={{ 
                                        height: 'auto', paddingTop: 8, paddingBottom: 2, maxHeight: 40,
                                    }}
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Observaciones del vehiculo'}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -20}}>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <textarea placeholder='Observaciones...' 
                                    style={{ 
                                        height: 90, maxHeight: 90, paddingTop: 8,
                                        background: '#e8e8e8',
                                    }}
                                    className={`forms-control`} value={this.state.observaciones}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: 10}}>
                        <Card title="VEHICULO DEL CLIENTE" bodyStyle={{padding: 0,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold',}}
                        >
                            <div className='forms-groups' style={{position: 'relative', top: -15, }}>
                                <Card.Grid hoverable={false} className='gridStyle' style={{background: 'red', color: 'white',}}>
                                    PLACA
                                </Card.Grid>
                                <Card.Grid hoverable={false} className='gridStyle' style={{background: 'blue', color: 'white',}}>
                                    MARCA
                                </Card.Grid>
                                <Card.Grid hoverable={false} className='gridStyle' style={{background: 'blue', color: 'white',}}>
                                    MODELO
                                </Card.Grid>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{padding: 0, maxHeight: 270, overflowY: 'scroll',
                                    overflowX: 'none', position: 'relative', top: -15,
                                }}
                            >
                                {this.state.array_vehiculo.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                                            style={{padding: 0, borderBottom: '1px solid #e8e8e8',}} key={key}
                                        >
                                            <Card.Grid className='gridStyle ptb-20' 
                                                style={{cursor: 'pointer', 
                                                    background: (data.idvehiculo == null) ? 'white' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#e0f3ff' : 'white',
                                                    color: (data.idvehiculo == null) ? 'rgba(0, 0, 0, 0.65)' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (data.idvehiculo == null) ? '400' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? 'bold' : '400',
                                                }}
                                            >
                                                { data.placa }
                                            </Card.Grid>
                                            <Card.Grid className='gridStyle ptb-20' 
                                                style={{cursor: 'pointer', 
                                                    background: (data.idvehiculo == null) ? 'white' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#e0f3ff' : 'white',
                                                    color: (data.idvehiculo == null) ? 'rgba(0, 0, 0, 0.65)' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (data.idvehiculo == null) ? '400' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? 'bold' : '400',
                                                }}
                                            >
                                                { data.marca }
                                            </Card.Grid>
                                            <Card.Grid className='gridStyle ptb-20' 
                                                style={{cursor: 'pointer', 
                                                    background: (data.idvehiculo == null) ? 'white' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#e0f3ff' : 'white',
                                                    color: (data.idvehiculo == null) ? 'rgba(0, 0, 0, 0.65)' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (data.idvehiculo == null) ? '400' : (this.state.vehiculo_first.idvehiculo == data.idvehiculo) ? 'bold' : '400',
                                                }}
                                            >
                                                { data.modelo }
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 txts-center'>
                    <div className="forms-groups" >
                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'>
                            <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block mt-1"
                                style={{fontSize: 10, }}
                            >
                                NRO. ORDEN SERVICIO
                            </button>
                        </div>
                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'center', paddingLeft: 3, height: 30,
                                        marginTop: 8, cursor: 'default', background: '#eee',
                                    }} readOnly
                                    className={`forms-control`} value={this.state.nroventa}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' readOnly 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'DATOS DEL CLIENTE'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -12,}}>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text'
                                    className={`forms-control`} 
                                    value={this.state.cliente_first.nombre}
                                    placeholder='Nombre del cliente'
                                    onChange={this.onChangeNombreCliente.bind(this)}
                                    readOnly={true}
                                    style={{background: '#eee', cursor: 'default', }}
                                />
                                <label className="lbls-input">Nombre</label>
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -10,}}>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text'
                                    className={`forms-control`} 
                                    value={this.state.cliente_first.empresa}
                                    placeholder='Empresa del cliente'
                                    onChange={this.onChangeEmpresaCliente.bind(this)}
                                    readOnly={true}
                                    style={{background: '#eee', cursor: 'default', }}
                                />
                                <label className="lbls-input">Empresa</label>
                            </div>
                        </div>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text'
                                    className={`forms-control`} 
                                    value={this.state.cliente_first.nit}
                                    placeholder='Nit del cliente'
                                    readOnly={this.state.cliente_first.idcliente == null ? true : false}
                                    style={{background: '#eee',
                                        cursor: 'default'
                                    }}
                                    disabled
                                />
                                <label className="lbls-input">Nit</label>
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -10,}}>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text'
                                    className={`forms-control`} 
                                    value={this.state.cliente_first.email}
                                    placeholder='Email del cliente'
                                    readOnly={this.state.cliente_first.idcliente == null ? true : false}
                                    style={{background: '#eee',
                                        cursor: 'default'
                                    }} disabled
                                />
                                <label className="lbls-input">Email</label>
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" 
                        style={{marginTop: -15, display: 'flex', justifyContent: 'center',}}
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <textarea type='text' placeholder='Ingresar Descripcion' 
                                    style={{ background: 'red', color: 'white', minHeight: 50,
                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer', 
                                        height: 50, paddingTop: 8, paddingBottom: 8, maxHeight: 50,
                                    }}
                                    className={`forms-control`} 
                                    value={'REGISTRO DE VEHICULO SELECCIONADO.'}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Serie'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 5, background: '#eee', cursor: 'default', }}
                                    className={`forms-control`} 
                                    value={this.state.vehiculo_first.serie == null ? '' : this.state.vehiculo_first.serie}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Placa'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 5, background: '#eee', cursor: 'default', }}
                                    className={`forms-control`} 
                                    value={this.state.vehiculo_first.placa}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Marca'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 5, background: '#eee', cursor: 'default', }}
                                    className={`forms-control`} 
                                    value={this.state.vehiculo_first.marca}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Modelo'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 5, background: '#eee', cursor: 'default', }}
                                    className={`forms-control`} 
                                    value={this.state.vehiculo_first.modelo}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="forms-groups" style={{marginTop: -15,}}>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Ingresar Descripcion' 
                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Color'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='' 
                                    style={{ textAlign: 'left', paddingLeft: 5, background: '#eee', cursor: 'default', }}
                                    className={`forms-control`} 
                                    value={this.state.vehiculo_first.color}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onChangeCantidad(data, event) {
        if (event.target.value == '') {
            data.cantidad = 0;
        }
        if (!isNaN(event.target.value)) {
            if (parseInt(event.target.value) >= 0) {
                data.cantidad = parseInt(event.target.value);
            }
        }
        data.error = null;
        data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
            () => this.ongenerarTotal()    
        );
    }
    onCantidadIncrementar(data) {
        if (parseInt(data.cantidad) >= 0) {
            data.error = null;
            data.cantidad = parseInt(data.cantidad)  + 1;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()    
            );
        }
    }
    onCantidadDecrementar(data) {
        if (parseInt(data.cantidad) > 0) {
            data.error = null;
            data.cantidad = parseInt(data.cantidad)  - 1;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()    
            );
        }
    }
    onVisibleCantidad(data) {
        data.visible_cantidad = !data.visible_cantidad;
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, });
    }
    onChangePrecio(data, event) {
        if (!isNaN(event.target.value)) {
            if (event.target.value*1 >= 0) {
                var precio = event.target.value;
                var lista = precio.split('.');
                if (lista.length > 1) {
                    if (lista[1].length < 3) {
                        data.precio = event.target.value;
                    }
                }else {
                    data.precio = event.target.value;
                }
            }
        }
        if (event.target.value == '') {
            data.precio = 0;
        }
        data.error = null;
        data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
            () => this.ongenerarTotal()    
        );
    }
    onPrecioIncrementar(data) {
        if (data.precio * 1 >= 0) {
            data.error = null;
            var array = data.precio.split('.');
            var precio = parseInt(array[0]) + 1;
            precio = array.length > 1 ? precio + '.' + array[1] : precio;
            data.precio = precio;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()    
            );
        }
    }
    onPrecioDecrementar(data) {
        if (data.precio * 1 > 1) {
            data.error = null;
            var array = data.precio.split('.');
            var precio = parseInt(array[0]) - 1;
            precio = array.length > 1 ? precio + '.' + array[1] : precio;
            data.precio = precio;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()    
            );
        }
    }
    onVisiblePrecio(data) {
        data.visible_precio = !data.visible_precio;
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, });
    }
    onChangeDescuento(data, event) {
        if (event.target.value == '') {
            data.descuento = 0;
        }
        if (!isNaN(event.target.value)) {
            if (parseInt(event.target.value) >= 0 && parseInt(event.target.value) <= 100) {
                data.descuento = parseInt(event.target.value);
            }
        }
        data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
        data.montodescuento = parseFloat(data.cantidad * data.precio * 1 * (data.descuento * 1 / 100)).toFixed(2);
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
            () => this.ongenerarTotal()    
        );
    }
    onDescuentoIncrementar(data) {
        if (parseInt(data.descuento) >= 0 && parseInt(data.descuento) <= 100) {
            data.descuento = parseInt(data.descuento)  + 1;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            data.montodescuento = parseFloat(data.cantidad * data.precio * 1 * (data.descuento * 1 / 100)).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()    
            );
        }
    }
    onDescuentoDecrementar(data) {
        if (parseInt(data.descuento) > 0) {
            data.descuento = parseInt(data.descuento)  - 1;
            data.subtotal = parseFloat((data.cantidad * data.precio * 1) - (data.cantidad * data.precio * 1 * (data.descuento * 1 / 100))).toFixed(2);
            data.montodescuento = parseFloat(data.cantidad * data.precio * 1 * (data.descuento * 1 / 100)).toFixed(2);
            this.setState({ array_serviciosselected: this.state.array_serviciosselected, },
                () => this.ongenerarTotal()
            );
        }
    }
    onVisibleDescuento(data) {
        data.visible_desc = !data.visible_desc;
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, });
    }
    onDeleteRow(index) {
        this.state.array_serviciosselected.splice(index, 1);
        var object_servicio = {
            id: null, codigo: null, descripcion: null, precio: null,
            stockactual: null, tipo: null, imagen: null, costo : null,
            comision: null, idmecanico: null, mecanico: null, cantidad: null,
            descuento: null, montodescuento: null, subtotal: null, nota: null, visible_nota: false,
            visible_cantidad: false, visible_precio: false, visible_desc: false,
            array_articulo: [], visible_articulo: false, error: null,
        };
        this.state.array_serviciosselected.push(object_servicio);
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, descuento: 0, },
            () => this.ongenerarTotal()
        );
    }
    onChangeDescuentoGral(event) {
        if (parseFloat(this.state.subtotal) <= 0) return;
        if (event.target.value == '') {
            this.state.descuento = 0;
        }
        if (!isNaN(event.target.value)) {
            if (parseInt(event.target.value) >= 0 && parseInt(event.target.value) <= 100) {
                this.state.descuento = parseInt(event.target.value);
            }
        }
        this.setState({ descuento: this.state.descuento, },
            () => this.ongenerarTotal()    
        );
    }
    onDescuentoIncrementarGral() {
        if (parseFloat(this.state.subtotal) <= 0) return;
        if (parseInt(this.state.descuento) >= 0 && parseInt(this.state.descuento) <= 100) {
            this.state.descuento = parseInt(this.state.descuento)  + 1;
            this.setState({ descuento: this.state.descuento, },
                () => this.ongenerarTotal()
            );
        }
    }
    onDescuentoDecrementarGral() {
        if (parseFloat(this.state.subtotal) <= 0) return;
        if (parseInt(this.state.descuento) > 0) {
            this.state.descuento = parseInt(this.state.descuento)  - 1;
            this.setState({ descuento: this.state.descuento, },
                () => this.ongenerarTotal()    
            );
        }
    }
    ongenerarTotal() {
        var subtotal = 0;
        var cantidadtotal = 0;
        for (let index = 0; index < this.state.array_serviciosselected.length; index++) {
            var data = this.state.array_serviciosselected[index];
            if (data.id != null) {
                subtotal = parseFloat(subtotal + data.subtotal * 1);
                cantidadtotal = cantidadtotal + parseInt(data.cantidad);
            }
        }
        var total = parseFloat(subtotal - subtotal * (this.state.descuento / 100) ).toFixed(2);
        this.setState({subtotal: parseFloat(subtotal).toFixed(2), 
            fechaventa: this.fechaActual(), horaventa: this.horaActual(), 
            total: total,
            cantidadtotal: cantidadtotal,
        });
    }
    onVisibleNota(data) {
        data.visible_nota = !data.visible_nota;
        this.setState({ array_serviciosselected: this.state.array_serviciosselected, });
    }
    cargar_detalle() {
        return (
            <div className="forms-groups" style={{ marginTop: 20, }}>
                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingBottom: 0, paddingTop: 0, }}>
                    <div className='cols-lg-2 cols-md-2'></div>
                    <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                            <button className="mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                style={{fontSize: 10, }}
                            >
                                NRO. ORDEN SERVICIO
                            </button>
                        </div>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                            <div className='inputs-groups'>
                                <input type='text' readOnly 
                                    style={{ textAlign: 'center', height: 33, cursor: 'default', background: '#eee', }}
                                    className={`forms-control`} value={this.state.nroventa}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                            <button className="mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                style={{fontSize: 10, }}
                            >
                                CODIGO
                            </button>
                        </div>
                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingTop: 0, paddingBottom: 0 ,}}>
                            <div className='inputs-groups'>
                                <input type='text' onChange={(event) => this.setState({codigo: event.target.value, errorcodigo: '', })} 
                                    style={{ height: 33, paddingRight: 5, }}
                                    className={`forms-control ${this.state.errorcodigo}`} value={this.state.codigo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingBottom: 0, paddingTop: 8, }}>
                    <div className="forms-groups">
                        <div className="tabless" 
                            style={{ overflowY: 'auto', overflowX: 'none', maxHeight: 400, 
                                border: `2px solid ${this.state.error_servicio == '' ? 'transparent' : 'red'}` 
                            }}
                        >
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <td className={`title_form ${this.props.buttoncolor}`}>DESCRIPCION</td>
                                        <td className={`title_form ${this.props.buttoncolor}`}>CANT</td>
                                        <td className={`title_form ${this.props.buttoncolor}`}>PREC UNIT</td>
                                        <td className={`title_form ${this.props.buttoncolor}`}>DESC</td>
                                        <td className={`title_form ${this.props.buttoncolor}`}>DETALLE</td>
                                        <td className={`title_form ${this.props.buttoncolor}`}>SUBTOTAL</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.array_serviciosselected.map(
                                        (data, key) => {
                                            if (data.id == null) {
                                                return (
                                                    <tr key={key}>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                        <td style={{height: 40, cursor: 'default', }}> </td>
                                                    </tr>
                                                );
                                            }
                                            var error = data.error == null ? {} : {boxShadow: '0 0 15px 5px red inset'};
                                            return (
                                                <tr key={key} style={error}>
                                                    <td style={{cursor: 'default', position: 'relative', }}>
                                                        <label className='cols_show'> DESCRIPCION: </label>
                                                        <div style={{display: 'block',}}>
                                                            <div style={{display: 'flex', paddingBottom: 7, fontSize: 11, }}>
                                                                <strong style={{width: 70, fontWeight: 'bold', color: '#1890ff', }}>
                                                                    CODIGO: 
                                                                </strong> 
                                                                { data.codigo == null ? ' S/Codigo' : data.codigo}
                                                            </div>
                                                            <div style={{display: 'flex', paddingBottom: 7, fontSize: 11, }}>
                                                                <strong style={{width: 70, fontWeight: 'bold', color: '#1890ff', }}>
                                                                    {data.tipo == 'S' ? 'SERVICIO: ' : 'PRODUCTO: '}
                                                                </strong> 
                                                                { data.descripcion}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{cursor: 'default', textAlign: 'right', paddingRight: 10, }}>
                                                        <label className='cols_show'>CANT: </label>
                                                        <div>
                                                            <div style={{position: 'relative', paddingBottom: 7,}}>
                                                                <strong style={{fontWeight: 'bold', color: '#1890ff', position: 'absolute', left: 0, 
                                                                        fontSize: 10,
                                                                    }}
                                                                >
                                                                    CANT: 
                                                                </strong> 
                                                                <Popover placement='top' trigger='click'
                                                                    visible={data.visible_cantidad}
                                                                    onVisibleChange={this.onVisibleCantidad.bind(this, data)}
                                                                    content={
                                                                        <div>
                                                                            <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                                <div className='inputs-groups' style={{width: 150, }}>
                                                                                    <input type='text' placeholder=''
                                                                                        className={`forms-control`} 
                                                                                        style={{paddingRight: 25, color: '#1890ff', }}
                                                                                        value={data.cantidad}
                                                                                        disabled
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div style={{textAlign: 'center', }}>
                                                                                <Button size='small'
                                                                                    onClick={this.onVisibleCantidad.bind(this, data)}
                                                                                >
                                                                                    ACEPTAR
                                                                                </Button> 
                                                                            </div>
                                                                        </div>
                                                                    } //&nbsp;
                                                                    title='CANTIDAD'
                                                                >
                                                                    <a style={{color: 'blue', paddingLeft: 2, paddingRight: 2, border: '1px dashed blue',
                                                                            fontSize: 11, position: 'relative', left: 4, top: -1,
                                                                        }}
                                                                    >
                                                                        {data.cantidad}
                                                                    </a>
                                                                </Popover>
                                                            </div>
                                                            {data.tipo == 'S' ? null :
                                                                <div style={{position: 'relative', paddingBottom: 7,}}>
                                                                    <strong style={{fontWeight: 'bold', color: '#1890ff', position: 'absolute', left: 0, 
                                                                            fontSize: 10, 
                                                                        }}
                                                                    >
                                                                        STOCK: 
                                                                    </strong> 
                                                                    <a style={{color: 'rgb(32, 201, 151)', paddingLeft: 2, paddingRight: 2, border: '1px dashed #52c41a',
                                                                            fontSize: 11, position: 'relative', left: 4, top: -4,
                                                                        }}
                                                                    >
                                                                        {parseInt(data.stockactual)}
                                                                    </a>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td style={{cursor: 'default', textAlign: 'right', paddingRight: 20, }}>
                                                        <label className='cols_show'>PRECIO UNIT: </label>
                                                        <Popover placement='top' trigger='click'
                                                            visible={data.visible_precio}
                                                            onVisibleChange={this.onVisiblePrecio.bind(this, data)}
                                                            content={
                                                                <div>
                                                                    <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                        <div className='inputs-groups' style={{width: 150, }}>
                                                                            <input type='text' placeholder=''
                                                                                className={`forms-control`} 
                                                                                style={{paddingRight: 25, color: '#1890ff', }}
                                                                                value={data.precio}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div style={{textAlign: 'center', }}>
                                                                        <Button size='small'
                                                                            onClick={this.onVisiblePrecio.bind(this, data)}
                                                                        >
                                                                            ACEPTAR
                                                                        </Button> &nbsp;
                                                                    </div>
                                                                </div>
                                                            } 
                                                            title='PRECIO'
                                                        >
                                                            <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                {data.precio}
                                                            </a>
                                                        </Popover>
                                                    </td>
                                                    <td style={{cursor: 'default', textAlign: 'right', paddingRight: 20, }}>
                                                        <label className='cols_show'>DESC: </label>
                                                        <Popover placement='top' trigger='click'
                                                            visible={data.visible_desc}
                                                            onVisibleChange={this.onVisibleDescuento.bind(this, data)}
                                                            content={
                                                                <div>
                                                                    <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                        <div className='inputs-groups' style={{width: 150, }}>
                                                                            <input type='text' placeholder=''
                                                                                className={`forms-control`} 
                                                                                style={{paddingRight: 25, color: '#1890ff', }}
                                                                                value={data.descuento}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div style={{textAlign: 'center', }}>
                                                                        <Button size='small'
                                                                            onClick={this.onVisibleDescuento.bind(this, data)}
                                                                        >
                                                                            ACEPTAR
                                                                        </Button> &nbsp;
                                                                    </div>
                                                                </div>
                                                            } 
                                                            title='DESCUENTO'
                                                        >
                                                            <a style={{color: 'blue', fontSize: 12, paddingLeft: 4, paddingRight: 4, border: '1px dashed blue' ,}}>
                                                                {data.descuento + '%'}
                                                            </a>
                                                        </Popover>
                                                    </td>
                                                    <td style={{cursor: 'default', display: 'flex', paddingRight: 5,
                                                            justifyContent: data.tipo == 'S' ? 'space-between': 'center',  
                                                        }}
                                                    >
                                                        <label className='cols_show'>DETALLE: </label>
                                                        {/* <div style={{display: 'block',}}> */}
                                                            <div style={{paddingBottom: 7, }}>
                                                                <Popover placement='top' trigger='click'
                                                                    visible={data.visible_nota}
                                                                    onVisibleChange={this.onVisibleNota.bind(this, data)}
                                                                    content={
                                                                        <div>
                                                                            <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                                                <div className='inputs-groups' style={{width: 200, }}>
                                                                                    <Input.TextArea type='text' placeholder=''
                                                                                        style={{paddingRight: 5, width: '100%', minWidth: '100%', maxHeight: 100,}}
                                                                                        value={data.nota}
                                                                                        disabled
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div style={{textAlign: 'center', }}>
                                                                                <Button size='small'
                                                                                    onClick={this.onVisibleNota.bind(this, data)}
                                                                                >
                                                                                    ACEPTAR
                                                                                </Button> &nbsp;
                                                                            </div>
                                                                        </div>
                                                                    } 
                                                                    title='NOTA'
                                                                >
                                                                    <a style={{color: data.nota == '' ? 'blue' : 'rgb(32, 201, 151)', 
                                                                        paddingLeft: 4, paddingRight: 4, fontSize: 12,
                                                                        border: data.nota == '' ? '1px dashed blue' : '1px dashed rgb(32, 201, 151)' ,}}
                                                                    >
                                                                        {'NOTA'} 
                                                                    </a>
                                                                </Popover>
                                                                {data.nota.trim().length == 0 ? null :
                                                                    <Checkbox checked  style={{position: 'relative', left: 5, top: 1,}} />
                                                                }
                                                            </div>
                                                    </td>
                                                    <td style={{cursor: 'default', textAlign: 'right', paddingRight: 20, }}>
                                                        <label className='cols_show'>SUBTOTAL: </label>
                                                        {data.subtotal}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 8, }}>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 10, paddingTop: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Ingresar Descripcion' readOnly 
                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'DATOS DEL CLIENTE'}
                                    />
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Nombre del cliente'
                                        className={`forms-control`} 
                                        value={this.state.cliente_first.nombre}
                                        onChange={this.onChangeNombreCliente.bind(this)}
                                        readOnly={true}
                                        style={{background: '#eee', cursor: 'default', }}
                                    />
                                    <label className="lbls-input">Nombre</label>
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingLeft: 0, paddingTop: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='Empresa del cliente'
                                            className={`forms-control`} 
                                            value={this.state.cliente_first.empresa}
                                            onChange={this.onChangeEmpresaCliente.bind(this)}
                                            readOnly={true}
                                            style={{background: '#eee', cursor: 'default', }}
                                        />
                                        <label className="lbls-input">Empresa</label>
                                    </div>
                                </div>
                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingLeft: 0, paddingRight: 0, paddingTop: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='Nit del cliente'
                                            className={`forms-control`} 
                                            value={this.state.cliente_first.nit}
                                            style={{background: '#eee',
                                                cursor: 'default',
                                            }} disabled
                                        />
                                        <label className="lbls-input">Nit</label>
                                    </div>
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Email del cliente'
                                        className={`forms-control`} 
                                        value={this.state.cliente_first.email}
                                        style={{background: '#eee',
                                            cursor:  'default',
                                        }} disabled
                                    />
                                    <label className="lbls-input">Email</label>
                                </div>
                            </div>
                        </div>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 8,}}>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 10, paddingTop: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Ingresar Descripcion' readOnly 
                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'DATOS DEL MECANICO'}
                                    />
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Nombre del cliente'
                                        className={`forms-control`} 
                                        value={this.state.mecanico_first.nombre}
                                        readOnly={true}
                                        style={{background: '#eee', cursor:  'default', }}
                                    />
                                    <label className="lbls-input">Nombre</label>
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingLeft: 0, paddingTop: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='Empresa del cliente'
                                            className={`forms-control`} 
                                            value={this.state.mecanico_first.telefono}
                                            readOnly={true}
                                            style={{background: '#eee', cursor:  'default', }}
                                        />
                                        <label className="lbls-input">Telefono</label>
                                    </div>
                                </div>
                                <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{paddingLeft: 0, paddingTop: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' placeholder='Empresa del cliente'
                                            className={`forms-control`} 
                                            value={this.state.mecanico_first.celular}
                                            readOnly={true}
                                            style={{background: '#eee', cursor:  'default', }}
                                        />
                                        <label className="lbls-input">Celular</label>
                                    </div>
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{padding: 0, paddingBottom: 8, }}>
                                <div className='inputs-groups'>
                                    <input type='text' placeholder='Nombre del cliente'
                                        className={`forms-control`} 
                                        value={this.state.mecanico_first.email}
                                        readOnly={true}
                                        style={{background: '#eee', cursor:  'default', }}
                                    />
                                    <label className="lbls-input">Email</label>
                                </div>
                            </div>
                        </div>
                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 6, }}>
                            <div className="forms-groups">
                                <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6' style={{padding: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' className={`forms-control title_form ${this.props.buttoncolor}`} 
                                            value={'SUBTOTAL'} readOnly style={{textAlign: 'left', paddingLeft: 15, }}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6' style={{padding: '0 10px 0 10px', }}>
                                    <div className='inputs-groups'>
                                        <input type='text'
                                            className={`forms-control`}
                                            placeholder='' disabled
                                        />
                                        <a style={{position: 'absolute', top: 9, right: 8, color: 'black', padding: '0 4px 0 4px', border: '1px dashed black', }}>
                                            {parseFloat(this.state.subtotal).toFixed(2)}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3' style={{padding: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' className={`forms-control title_form ${this.props.buttoncolor}`} 
                                            value={'DESC'} readOnly style={{textAlign: 'left', paddingLeft: 15, }}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3' style={{padding: '0 0 0 3px', }}>
                                    <div className='inputs-groups'>
                                        <input type='text'
                                            className={`forms-control`}
                                            placeholder='' disabled
                                        />
                                        <Popover placement='top' trigger='click'
                                            visible={this.state.visible_descuento}
                                            onVisibleChange={() => this.setState({visible_descuento: !this.state.visible_descuento,})}
                                            content={
                                                <div>
                                                    <div style={{textAlign: 'center', paddingBottom: 5,}}>
                                                        <div className='inputs-groups' style={{width: 150, }}>
                                                            <input type='text' placeholder=''
                                                                className={`forms-control`} 
                                                                style={{paddingRight: 25, color: '#1890ff', }}
                                                                value={this.state.descuento}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{textAlign: 'center', }}>
                                                        <Button size='small'
                                                            onClick={() => this.setState({visible_descuento: !this.state.visible_descuento,})}
                                                        >
                                                            ACEPTAR
                                                        </Button> &nbsp;
                                                    </div>
                                                </div>
                                            } 
                                            title='DESCUENTO'
                                        >
                                            <a style={{position: 'absolute', top: 9, right: 8, color: 'blue', padding: '0 4px 0 4px', border: '1px dashed blue', }}>
                                                {this.state.descuento + '%'}
                                            </a>
                                        </Popover>
                                    </div>
                                </div>
                                <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6' style={{padding: '0 10px 0 10px', }}>
                                    <div className='inputs-groups'>
                                        <input type='text'
                                            className={`forms-control`}
                                            placeholder='' disabled
                                        />
                                        <a style={{position: 'absolute', top: 9, right: 8, color: 'black', padding: '0 4px 0 4px', border: '1px dashed black', }}>
                                            {parseFloat( this.state.subtotal * (this.state.descuento / 100) ).toFixed(2)}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6' style={{padding: 0, }}>
                                    <div className='inputs-groups'>
                                        <input type='text' className={`forms-control title_form ${this.props.buttoncolor}`} 
                                            value={'TOTAL'} readOnly style={{textAlign: 'left', paddingLeft: 15, }}
                                        />
                                    </div>
                                </div>
                                <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6' style={{padding: '0 10px 0 10px', }}>
                                    <div className='inputs-groups'>
                                        <input type='text'
                                            className={`forms-control`}
                                            placeholder='' disabled
                                        />
                                        <a style={{position: 'absolute', top: 9, right: 8, color: 'black', padding: '0 4px 0 4px', border: '1px dashed black', }}>
                                            {parseFloat(this.state.total).toFixed(2)}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        const contentList = {
            tab1: this.cargar_general(),
            tab2: this.cargar_detalle(),
        };

        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;

        return (
            <div className="rows">
                {this.onModalCliente()}
                {this.onModalMecanico()}
                {this.onModalServicio()}
                <Modal
                    title={(this.state.cliente_first == null) ? 'S/Cliente' : 
                        this.state.cliente_first.nombre + ' ' + this.state.cliente_first.apellido
                    }
                    visible={this.state.visible_clienteshow}
                    onCancel={() => this.setState({visible_clienteshow: false,}) }
                    bodyStyle={{padding: 10, paddingTop: 6,}}
                    footer={null}
                >

                    <div className='forms-groups'>
                        <Card title="Infomación del cliente" type="inner">
                            <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'
                                style={{border: '1px solid #e8e8e8', }}
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    previewVisible={false}
                                    action=""
                                    disabled={true}
                                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}
                                    //beforeUpload={null}
                                    //onChange={null}
                                >
                                    {<img src={'/img/descarga.jpg'} alt="avatar" style={{ width: '100%' }} />}
                                </Upload>
                            </div>
                            <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12'></div>
                        </Card>
                    </div>

                </Modal>
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <div className="forms-groups">
                                <Card
                                    style={{ width: '100%', }}
                                    title="DETALLE DE MANTENIMIENTO"
                                    bodyStyle={{padding: 0,}}
                                    headStyle={{fontSize: 14, }}
                                    extra={ 
                                        <div>
                                            <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                                onClick={this.onBack.bind(this)}
                                            >
                                                Atras
                                            </button>
                                        </div>
                                    }
                                    tabList={tabList}
                                    activeTabKey={this.state.key}
                                    onTabChange={key => this.setState({ key: key, }) }
                                    >
                                    {contentList[this.state.key]}
                                </Card>
                            </div>
                            <div className='forms-groups txts-center mt-4'>
                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                    onClick={this.onValidar.bind(this)}
                                >
                                    Aceptar
                                </button>
                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                    onClick={this.onBack.bind(this)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>:
                    
                        <div className='forms-groups'>
                            <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                                <div className='loaders'>
                                    <div className='balls-scales-multiples'>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

ShowVenta.propTypes = {
    venta: PropTypes.object,
    buttoncolor: PropTypes.string,
}

ShowVenta.defaultProps = {
    venta: {
        create: 0, 
        array_vehiculo: [],
        nroventa: 0,
        codigo: '',
        observaciones: '',
        cliente_first: null,
        mecanico_first: null,
        vehiculo_first: null,
        array_serviciosselected: [],
        array_articulo: [],
        descuento: 0,
        key: 'tab1',
    },
    buttoncolor: '',
}

export default withRouter(ShowVenta);
