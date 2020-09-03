
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Modal, Card, notification, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

class EditarVehiculo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            new_create: false,

            visible_searchcliente: false,
            visible_tipo: false,
            visible_cliente: false,
            visible_marca: false,
            visible_modelo: false,
            visible_year: false,
            visible_color: false,

            new_color: false,
            loading_color: false,
            descripcion_color: '',

            new_year: false,
            loading_year: false,
            descripcion_year: '',

            new_marca: false,
            loading_marca: false,
            descripcion_marca: '',

            new_tipo: false,
            loading_tipo: false,
            descripcion_tipo: '',

            new_modelo: false,
            loading_modelo: false,
            descripcion_modelo: '',

            descripcion: '',
            errordescripcion: '',

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

            search_cliente: '',

            errorplaca: '',
            erroridcliente: '',
            erroridtipo: '',
            erroridmarca: '',
            erroridmodelo: '',
            erroridcolor: '',
            erroridyear: '',
        }
    }
    componentDidMount() {
        this.props.get_link('vehiculo', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/vehiculo/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {

                        this.props.loadingservice(false, response.data.visitasitio);

                        if (this.props.vehiculo.create == 1) {
                            this.setState({
                                placa: this.props.vehiculo.placa,
                                nroserie: this.props.vehiculo.nroserie,
                                idcliente: this.props.vehiculo.idcliente,
                                idtipo: this.props.vehiculo.idtipo,
                                idmarca: this.props.vehiculo.idmarca,
                                idmodelo: this.props.vehiculo.idmodelo,
                                idcolor: this.props.vehiculo.idcolor,
                                idyear: this.props.vehiculo.idyear,
                                nota: this.props.vehiculo.nota,
                                namecliente: this.props.vehiculo.namecliente,
                                razonsocialcliente: this.props.vehiculo.razonsocialcliente,
                                marca: this.props.vehiculo.marca,
                                modelo: this.props.vehiculo.modelo,
                                year: this.props.vehiculo.year,
                                color: this.props.vehiculo.color,
                                tipo: this.props.vehiculo.tipo,
                                array_cliente: this.props.vehiculo.array_cliente,
                                array_tipo: this.props.vehiculo.array_tipo,
                                array_marca: this.props.vehiculo.array_marca,
                                array_year: this.props.vehiculo.array_year,
                                array_color: this.props.vehiculo.array_color,
                                array_modelo: this.props.vehiculo.array_modelo,
                                imagen: this.props.vehiculo.imagen,
                                foto: this.props.vehiculo.foto,
                            });
                            this.props.initvehiculo();
                            return;
                        }

                        if (this.props.ventacreate == 1) {
                            this.setState({
                                idcliente: this.props.venta.cliente_first.idcliente,
                                namecliente: this.props.venta.cliente_first.nombre,
                                razonsocialcliente: this.props.venta.cliente_first.empresa,
                            });
                        }

                        var data = response.data.data;
                        this.setState({
                            array_tipo: response.data.tipo,     array_marca: response.data.marca,
                            array_year: response.data.year,     array_color: response.data.color,
                            array_modelo: response.data.modelo, placa: data.placa,
                            idcliente: data.idcliente,     idtipo: data.idvehiculotipo,
                            idmarca: data.idmarca,         idyear: data.idvehiculoyear,
                            idcolor: data.idvehiculocolor, idmodelo: data.idmodelo,
                            nota: (data.observacion == null) ? '' : data.observacion,
                            
                            namecliente: data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido,
                            razonsocialcliente: data.razonsocial == null ? 'S/Empresa' : data.razonsocial,
                            marca: {id: data.idmarca, descripcion: data.marca},
                            tipo: {id: data.idvehiculotipo, descripcion: data.vehiculotipo},
                            year: {id: data.idvehiculoyear, descripcion: data.year},
                            color: {id: data.idvehiculocolor, descripcion: data.color},
                            modelo: {id: data.idmodelo, descripcion: data.modelo},
                            nroserie: data.nroserie == null ? '' : data.nroserie,
    
                            imagen: (response.data.imagen.length > 0) ? response.data.imagen[0].imagen:'',
                            foto: (response.data.imagen.length > 0)?response.data.imagen[0].imagen:'',
                        });
                        return;
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
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
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    ondatavehiculo() {
        var objeto = {
            create: 1, placa: this.state.placa, nroserie: this.state.nroserie,
            idcliente: this.state.idcliente, idtipo: this.state.idtipo,
            idmarca: this.state.idmarca, idmodelo: this.state.idmodelo,
            idcolor: this.state.idcolor, idyear: this.state.idyear,
            nota: this.state.nota, namecliente: this.state.namecliente,
            razonsocialcliente: this.state.razonsocialcliente, marca: this.state.marca,
            modelo: this.state.modelo, year: this.state.year, color: this.state.color,
            tipo: this.state.tipo, array_cliente: this.state.array_cliente,
            array_tipo: this.state.array_tipo, array_marca: this.state.array_marca,
            array_year: this.state.array_year, array_color: this.state.array_color,
            array_modelo: this.state.array_modelo, imagen: this.state.imagen, foto: this.state.foto,
        };
        return objeto;
    }
    onChangePlaca(event) {
        this.setState({
            placa: event.target.value.toUpperCase(),
            errorplaca: '',
        });
    }
    onChangeNroSerie(event) {
        this.setState({
            nroserie: event.target.value,
        });
    }
    onChangeIDCliente(data) {
        notification.success({
            message: 'SUCCESS',
            description: 'CLIENTE SELECCIONADO EXITOSAMENTE.',
        });
        this.setState({
            idcliente: data.id, erroridcliente: '',
            visible_cliente: false, array_cliente: [],
            namecliente: data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido,
            razonsocialcliente: data.razonsocial == null ? 'S/Empresa' : data.razonsocial,
        });
    }
    onMarcaID(data) {
        axios(
            {
                method: 'get',
                url: web.servidor + '/vehiculo/get_modelomarca',
                params: {idmarca: data.id,},
                responseType: 'json',
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.setState({ visible_marca: false, });
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_modelo: response.data.data,
                            marca: data,  erroridmarca: '',
                            idmarca: data.id,  visible_marca: false,
                            modelo: null, idmodelo: '',
                        });
                    }
                }
            }
        ).catch( error => {
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({  auth: true, });
            }
        } );
    }
    onBack() {
        this.props.history.goBack();
    }
    onSearchCliente() {
        axios(
            {
                method: 'get',
                url: web.servidor + '/cliente/searchcliente',
                params: { search: this.state.search_cliente, },
                responseType: 'json',
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        this.setState({
                            visible_searchcliente: false, 
                        });
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_cliente: response.data.data,
                            visible_searchcliente: false, search_cliente: '',
                        }, () => {
                            setTimeout(() => {
                                this.setState({ visible_cliente: true, });
                            }, 500);
                        } );
                        if (response.data.data.length == 0) {
                            notification.warning({
                                message: 'ADVERTENCIA',
                                description: 'NO HAY REGRISTRO DE CLIENTE. FAVOR DE REGISTRAR UNO.',
                                placement: 'bottomRight',
                            });
                        }
                    }
                }
            }
        ).catch( error => {
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({  auth: true, });
            }
        } );
    }
    onUltimoCliente() {
        axios.get( web.servidor + '/cliente/getultimo').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        var data = response.data.data;
                        if (data != null) {
                            this.setState({
                                idcliente: data.id,
                                erroridcliente: '',
                                namecliente: data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido,
                                razonsocialcliente: data.razonsocial == null ? 'S/Empresa' : data.razonsocial,
                            });
                        } else {
                            notification.warning({
                                message: 'ADVERTENCIA',
                                description: 'NO EXISTE REGISTRO DE CLIENTE. FAVOR DE REGISTRAR UNO.',
                            });
                        }
                    }
                }
            }
        ).catch( error => {
            console.log(error);
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    onValidar() {
        if (this.state.placa.toString().trim().length > 0 && 
            this.state.idcliente != '' && this.state.idtipo != '' &&
            this.state.idmarca != ''   && this.state.idmodelo != '' &&
            this.state.idyear != ''    && this.state.idcolor != ''
        ) {
            this.onSesion(1);
        } else {
            if (this.state.placa.toString().trim().length == 0) {
                this.setState({ errorplaca: 'error', });
            }
            if (this.state.idcliente == '') {
                this.setState({ erroridcliente: 'error', });
            }
            if (this.state.idtipo == '') {
                this.setState({ erroridtipo: 'error', });
            }
            if (this.state.idmarca == '') {
                this.setState({ erroridmarca: 'error', });
            }
            if (this.state.idmodelo == '') {
                this.setState({ erroridmodelo: 'error', });
            }
            if (this.state.idyear == '') {
                this.setState({ erroridyear: 'error', });
            }
            if (this.state.idcolor == '') {
                this.setState({ erroridcolor: 'error', });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOR REQUERIDOS.',
            });
        }
    }
    onSubmit() {
        this.setState({ loading: true, });
        var formdata = new FormData();
        formdata.append('placa', this.state.placa);
        formdata.append('nroserie', this.state.nroserie);
        formdata.append('idcliente', this.state.idcliente);
        formdata.append('idtipo', this.state.idtipo);
        formdata.append('idmarca', this.state.idmarca);
        formdata.append('idmodelo', this.state.idmodelo);
        formdata.append('idyear', this.state.idyear);
        formdata.append('idcolor', this.state.idcolor);
        formdata.append('nota', this.state.nota);
        formdata.append('imagen', this.state.imagen);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo/update',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype': 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                this.setState({ loading: false, });
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        if (this.props.ventacreate == 1) {
                            var objecto = {
                                idvehiculo: response.data.data.id,
                                marca: this.state.marca.descripcion,
                                modelo: this.state.modelo.descripcion,
                                color: this.state.color.descripcion,
                                placa: response.data.data.placa,
                                serie: response.data.data.nroserie == null ? '' : response.data.data.nroserie,
                            };
                            this.props.onStoreVehiculo(objecto, 'venta');
                        }
                        notification.success({
                            message: 'SUCCESS',
                            description: 'VEHICULO ACTUALIZADO EXITOSAMENTE',
                        });
                        setTimeout(() => {
                            this.props.history.goBack();
                        }, 500);
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE PLACA REPETIDO.',
                        });
                        this.setState({ errorplaca: 'error', });
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
                }
            }
        ).catch( error => {
            this.setState({ loading: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onChangeFoto(event) {
        let files = event.target.files;
        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    foto: e.target.result,
                    imagen: files[0],
                });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    onModalShearchCliente() {
        return (
            <Modal
                title={'Proporcionar Datos del Cliente'}
                visible={this.state.visible_searchcliente}
                onCancel={() => {
                    this.setState({
                        visible_searchcliente: false, search_cliente: '',
                    })
                }}
                bodyStyle={{ padding: 10, paddingTop: 6, }}
                footer={null} style={{ top: 20, }}
            >
                <div className='forms-groups'>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{ display: 'flex', justifyContent: 'center', paddingTop: 0, }}
                    >
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingTop: 3,}}>
                            <div className='inputs-groups'>
                                <input type='text' readOnly 
                                    className={`forms-control title_form`}
                                    value={'Nombre, Empresa'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{ display: 'flex', justifyContent: 'center', paddingTop: 0, }}
                    >
                        <div className='cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12' style={{paddingTop: 3, }}>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Buscar...'
                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                    className={`forms-control`}
                                    value={this.state.search_cliente}
                                    onChange={(event) =>  this.setState({ search_cliente: event.target.value, }) }
                                />
                                {this.state.search_cliente.toString().length == 0 ? null : 
                                    <i className='fa fa-close delete_icon'
                                        onClick={() => this.setState({ search_cliente: '', }) }
                                    ></i> 
                                }
                            </div>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{ display: 'flex', justifyContent: 'center', paddingTop: 5, }}
                    >
                        <button className=" mr-2 btn-hover-shine btn btn-light"
                            onClick={() => this.setState({ visible_searchcliente: false, search_cliente: '', })}
                        >
                            Cancelar
                        </button>
                        <button className=" mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                            onClick={this.onSearchCliente.bind(this)}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
    onModalCliente() {
        return (
            <Modal
                title={null}
                visible={this.state.visible_cliente}
                onCancel={() => {
                    this.setState({
                        visible_cliente: false,
                        array_cliente: [],
                    })
                }}
                footer={null}
                style={{ top: 20, }}
                width={800}
            >
                <div className="forms-groups">
                    <div className='forms-groups'>
                        <div style={{marginTop: -20, display: 'flex', justifyContent: 'center',}}>
                            <button className="btn-hover-shine btn btn-primary pull-right mb-2"
                                onClick={() => {
                                    this.props.vehiculocreate(this.ondatavehiculo());
                                    setTimeout(() => {
                                        this.props.history.push( web.serv_link + '/cliente/create');
                                    }, 800);
                                }}
                            >
                                NUEVO CLIENTE
                            </button>
                        </div>
                    </div>
                    <Card title="CLIENTES ENCONTRADOS" 
                        bodyStyle={{ padding: 0, }} headStyle={{fontSize: 14, }}
                        extra={
                            <button className="btn-hover-shine btn btn-secondary"
                                onClick={() => {
                                    this.setState({
                                        visible_cliente: false, array_cliente: [],
                                    }, () => {
                                        setTimeout(() => {
                                            this.setState({
                                                visible_searchcliente: true, search_cliente: '',
                                            });
                                        }, 500);
                                    });
                                }}
                            >
                                Atras
                            </button>
                        }
                    >
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ padding: 0, }}>
                            <Card.Grid hoverable={false} className='gridStyle' style={{ background: '#1890ff', color: 'white', }}>
                                Clave
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle' style={{ background: '#1890ff', color: 'white', }}>
                                Nombre
                            </Card.Grid>
                            <Card.Grid hoverable={false} className='gridStyle' style={{ background: '#1890ff', color: 'white', }}>
                                Nit
                            </Card.Grid>
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{
                                padding: 0, height: 'auto', maxHeight: 300, overflowY: 'auto', overflowX: 'none',
                            }}
                        >
                            {this.state.array_cliente.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ padding: 0, }} key={key}
                                        onClick={ () =>  this.onChangeIDCliente(data) }
                                    >
                                        <Card.Grid hoverable={false} className='gridStyle  ptb-20' 
                                            style={{ cursor: 'pointer', 
                                                background: (this.state.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                color: (this.state.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (this.state.idcliente == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                            {key + 1}
                                        </Card.Grid>
                                        <Card.Grid hoverable={false} className='gridStyle  ptb-20' 
                                            style={{ cursor: 'pointer', 
                                                background: (this.state.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                color: (this.state.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (this.state.idcliente == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                            {data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido}
                                        </Card.Grid>
                                        <Card.Grid hoverable={false} className='gridStyle  ptb-20' 
                                            style={{ cursor: 'pointer', 
                                                background: (this.state.idcliente == data.id) ? '#e0f3ff' : 'white',
                                                color: (this.state.idcliente == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                fontWeight: (this.state.idcliente == data.id) ? 'bold' : '400',
                                            }}
                                        >
                                            {data.nit == null ? 'S/Nit' : data.nit}
                                        </Card.Grid>
                                    </div>
                                )
                            )}
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{ padding: 0, }}
                            >
                                <Card.Grid hoverable={false} className='gridStyle' style={{ cursor: 'pointer', }}>
                                </Card.Grid>
                                <Card.Grid hoverable={false} className='gridStyle' style={{ cursor: 'pointer', }}>
                                </Card.Grid>
                                <Card.Grid hoverable={false} className='gridStyle' style={{ cursor: 'pointer', }}>
                                </Card.Grid>
                            </div>
                        </div>
                    </Card>
                </div>
            </Modal>
        );
    }
    onChangeDescripcion(event) {
        this.setState({descripcion: event.target.value, errordescripcion: '',});
    }
    style_selected(data, id) {
        var objecto = { cursor: 'pointer', width: '100%', minWidth: '100%', fontSize: 13,
            height: 18, lineHeight: 0, textAlign: 'center',
            background: (data == null) ? 'white' : (data.id == id) ? '#e0f3ff' : 'white',
            color: (data == null) ? 'rgba(0, 0, 0, 0.65)' : (data.id == id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
            fontWeight: (data == null) ? '400' : (data.id == id) ? 'bold' : '400',
        }
        return objecto;
    }
    onModalVehiculoTipo() {
        var tipo = this.state.tipo;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_tipo}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_tipo: false, new_create: false,
                            loading_tipo: false, descripcion: '',
                            errordescripcion: '',
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
                footer={null} style={{ top: 100, }}  width={450}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="TIPO VEHICULO" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_tipo.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => {
                                                this.setState({
                                                    tipo: data, visible_tipo: false,
                                                    idtipo: data.id, erroridtipo: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={ this.style_selected(tipo, data.id) }
                                            >
                                                {data.descripcion}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%', minWidth: '100%', }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> : 
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO TIPO VEHICULO
                                </div>
                            </div>
                            {(!this.state.loading_tipo) ?
                                this.onFormCreate('tipovehiculo') : this.onLoading()
                            }
                        </div>
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoMarca() {
        var marca = this.state.marca;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_marca}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_marca: false, new_create: false,
                            loading_marca: false, descripcion: '', errordescripcion: '',
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
                style={{ top: 100, }} width={450} footer={null}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="MARCA" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_marca.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={this.onMarcaID.bind(this, data)}
                                        >
                                            <Card.Grid hoverable={false} 
                                                style={ this.style_selected(marca, data.id) }
                                            >
                                                {data.descripcion}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%' }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> : 
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVA MARCA
                                </div>
                            </div>
                            {(!this.state.loading_marca) ?
                                this.onFormCreate('marca') : this.onLoading()
                            }
                        </div>
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoModelo() {
        var modelo = this.state.modelo;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_modelo}
                onCancel={() => {
                    if (!this.state.new_modelo) {
                        this.setState({
                            visible_modelo: false, new_create: false,
                            loading_modelo: false, descripcion: '', errordescripcion: '',
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
                style={{ top: 100, }} width={450} footer={null}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="MODELO" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                (this.state.idmarca != '') ?
                                    <button className={"btn-hover-shine btn btn-" + colornew}
                                        onClick={() => this.setState({ new_create: true,})}
                                    >
                                        Nuevo
                                    </button> : null
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_modelo.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => {
                                                this.setState({
                                                    modelo: data, idmodelo: data.id,
                                                    erroridmodelo: '', visible_modelo: false,
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={ this.style_selected(modelo, data.id) }
                                            >
                                                {data.descripcion}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%' }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> : 
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO MODELO
                                </div>
                            </div>
                            {(!this.state.loading_modelo) ? 
                                this.onFormCreate('modelo') : this.onLoading()
                            }
                        </div>
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoYear() {
        var year = this.state.year;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_year}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_year: false, new_create: false,
                            loading_year: false, descripcion: '', errordescripcion: '',
                        })
                    }
                }}
                footer={null} style={{ top: 100, }} width={450}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="AÑO" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({ new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_year.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => {
                                                this.setState({
                                                    year: data, visible_year: false,
                                                    idyear: data.id, erroridyear: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={ this.style_selected(year, data.id) }
                                            >
                                                {data.descripcion}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%' }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> :
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO AÑO
                                </div>
                            </div>
                            {(!this.state.loading_year) ?
                                this.onFormCreate('year') : this.onLoading()
                            }
                        </div>
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoColor() {
        var color = this.state.color;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_color}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_color: false, new_create: false,
                            loading_color: false, descripcion: '', errordescripcion: '',
                        })
                    }
                }}
                footer={null} style={{ top: 100, }} width={450}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="COLOR" 
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({ new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto',
                                    overflowX: 'none',
                                }}
                            >
                                {this.state.array_color.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => {
                                                this.setState({
                                                    color: data, idcolor: data.id,
                                                    visible_color: false, erroridcolor: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={ this.style_selected(color, data.id) }
                                            >
                                                {data.descripcion}
                                            </Card.Grid>
                                        </div>
                                    )
                                )}
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ padding: 0, }}
                                >
                                    <Card.Grid hoverable={false} className='gridStyle'
                                        style={{ cursor: 'pointer', width: '100%' }}>
                                    </Card.Grid>
                                </div>
                            </div>
                        </Card> : 
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO COLOR
                                </div>
                            </div>
                            {(!this.state.loading_color) ?
                                this.onFormCreate('color') : this.onLoading()
                            }
                        </div>
                    }
                </div>
            </Modal>
        );
    }
    onValidarVehiculoTipo() {
        if (this.state.descripcion.toString().trim().length == 0) {
            notification.error({
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO',
            });
            this.setState({ errordescripcion: 'error', });
            return;
        }
        this.setState({ loading_tipo: true, });
        this.onSesion(2);
    }
    onSubmitVehiculoTipo() {
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_tipo/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'VEHICULO TIPO registrado exitosamente..',
                        });
                        var data = response.data.data;
                        this.setState({
                            visible_tipo: false, new_create: false,
                            loading_tipo: false, descripcion: '', errordescripcion: '',
                            tipo: data, idtipo: data.id,
                            array_tipo: response.data.vehiculotipo,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE TIPO DE VEHICULO REPETIDO.',
                        });
                        this.setState({ errordescripcion: 'error', });
                    }
                }
                this.setState({ loading_tipo: false, });
            }
        ).catch( error => {
            this.setState({ loading_tipo: false, });ç
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onValidarMarca() {
        if (this.state.descripcion.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTNCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ errordescripcion: 'error', });
            return;
        }
        this.setState({ loading_marca: true, });
        this.onSesion(3);
    }
    onSubmitMarca() {
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_marca/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'MARCA REGISTRADO EXITOSAMENTE.',
                        });
                        this.setState({
                            visible_marca: false, new_create: false,
                            loading_marca: false, descripcion: '',
                            marca: response.data.data, errordescripcion: '',
                            idmarca: response.data.data.id,
                            array_marca: response.data.marca,
                            array_modelo: [], modelo: null, idmodelo: '',
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE MARCA REPETIDO',
                        });
                        this.setState({ errordescripcion: 'error', });
                    }
                }
                this.setState({ loading_marca: false, });
            }
        ).catch( error => {
            this.setState({ loading_marca: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({
                    auth: true,
                });
            }
        } );
    }
    onValidarModelo() {
        if (this.state.descripcion.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ errordescripcion: 'error', });
            return;
        }
        this.setState({ loading_modelo: true, });
        this.onSesion(4);
    }
    onSubmitModelo() {
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('idmarca', this.state.idmarca);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_modelo/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'MODELO DE MARCA REGISTRADO EXITOSAMENTE.',
                        });
                        this.setState({
                            visible_modelo: false, new_create: false,
                            loading_modelo: false, descripcion: '',
                            modelo: response.data.data, errordescripcion: '',
                            idmodelo: response.data.data.id,
                            array_modelo: response.data.modelo,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE MODELO MARCA REPETIDO.',
                        });
                        this.setState({ errordescripcion: 'error', });
                    }
                }
                this.setState({ loading_modelo: false, });
            }
        ).catch( error => {
            this.setState({ loading_modelo: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onValidarYear() {
        if (this.state.descripcion.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ errordescripcion: 'error', });
            return;
        }
        this.setState({ loading_year: true, });
        this.onSesion(5);
    }
    onSubmitYear() {
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_year/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'AÑO REGISTRADO EXITOSAMENTE.',
                        });
                        this.setState({
                            visible_year: false, new_create: false,
                            loading_year: false, descripcion: '',
                            year: response.data.data, errordescripcion: '',
                            idyear: response.data.data.id,
                            array_year: response.data.year,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE AÑO REPETIDO',
                        });
                        this.setState({ errordescripcion: 'error', });
                    }
                }
                this.setState({ loading_year: false, });
            }
        ).catch( error => {
            this.setState({ loading_year: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onValidarColor() {
        if (this.state.descripcion.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ errordescripcion: 'error', });
            return;
        }
        this.setState({ loading_color: true, });
        this.onSesion(6);
    }
    onSubmitColor() {
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        axios(
            {
                method: 'post',
                url: web.servidor + '/vehiculo_color/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'COLOR REGISTRADO EXITOSAMENTE.',
                        });
                        this.setState({
                            visible_color: false, new_create: false,
                            loading_color: false, descripcion: '',
                            color: response.data.data, errordescripcion: '',
                            idcolor: response.data.data.id,
                            array_color: response.data.color,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE COLOR REPETIDO.',
                        });
                        this.setState({ errordescripcion: 'error', });
                    }
                }
                this.setState({ loading_color: false, });
            }
        ).catch( error => {
            this.setState({ loading_color: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({  auth: true, });
            }
        } );
    }
    onValidarData(value) {
        if (value == 'tipovehiculo') {
            this.onValidarVehiculoTipo();
        }
        if (value == 'marca') {
            this.onValidarMarca();
        }
        if (value == 'modelo') {
            this.onValidarModelo();
        }
        if (value == 'year') {
            this.onValidarYear();
        }
        if (value == 'color') {
            this.onValidarColor();
        }
    }
    onFormCreate(value) {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        return (
            <div className='forms-groups'>
                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ paddingTop: 0, }}>
                    <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                        <div className='inputs-groups'>
                            <input type='text'
                                className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                        <div className='inputs-groups'>
                            <input type='text' placeholder='INGRESAR DESCRIPCION'
                                style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                className={`forms-control ${this.state.errordescripcion}`}
                                value={this.state.descripcion}
                                onChange={this.onChangeDescripcion.bind(this) }
                            />
                            {this.state.descripcion.toString().length == 0 ? null : 
                                <i className='fa fa-close delete_icon'
                                    onClick={() => this.setState({ descripcion: '', }) }
                                ></i> 
                            }
                        </div>
                    </div>
                </div>
                <div className='forms-groups txts-center mt-4'>
                    <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                        onClick={this.onValidarData.bind(this, value)}
                    >
                        Aceptar
                    </button>
                    <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                        onClick={() => this.setState({new_create: false, descripcion: '', errordescripcion: '', })}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }
    onLoading() {
        return (
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
        );
    }
    onSesion(bandera) {
        if (bandera == 1) this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    this.props.logout();
                    return;
                }
                if (bandera == 1) this.onSubmit();
                if (bandera == 2) this.onSubmitVehiculoTipo();
                if (bandera == 3) this.onSubmitMarca();
                if (bandera == 4) this.onSubmitModelo();
                if (bandera == 5) this.onSubmitYear();
                if (bandera == 6) this.onSubmitColor();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            if (bandera == 1) this.setState({ loading: false, });
            if (bandera == 2) this.setState({loading_tipo: false, });
            if (bandera == 3) this.setState({loading_marca: false, });
            if (bandera == 4) this.setState({loading_modelo: false, });
            if (bandera == 5) this.setState({loading_year: false, });
            if (bandera == 6) this.setState({loading_color: false, });
        } ).catch( error => {
            if (bandera == 1) this.setState({ loading: false, });
            if (bandera == 2) this.setState({loading_tipo: false, });
            if (bandera == 3) this.setState({loading_marca: false, });
            if (bandera == 4) this.setState({loading_modelo: false, });
            if (bandera == 5) this.setState({loading_year: false, });
            if (bandera == 6) this.setState({loading_color: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                {this.onModalShearchCliente()}
                {this.onModalCliente()}
                {this.onModalVehiculoTipo()}
                {this.onModalVehiculoMarca()}
                {this.onModalVehiculoModelo()}
                {this.onModalVehiculoYear()}
                {this.onModalVehiculoColor()}
                <div className="cards">
                    {(!this.state.loading) ?
                        <Card
                            style={{ width: '100%', minWidth: '100%', }}
                            title="EDITAR VEHICULO"
                            headStyle={{fontSize: 14, }}
                            bodyStyle={{padding: 4, paddingTop: 0, }}
                            extra={ 
                                <div>
                                    <Tooltip placement='top' title='NUEVO CLIENTE'>
                                        <button className="btn-hover-shine btn btn-sm btn-outline-alternate rounded-circle mr-2 fa fa-street-view" //odnoklassniki
                                            style={{fontSize: 18, padding: 5, paddingLeft: 7, paddingRight: 7, }}
                                            onClick={() => {
                                                this.props.vehiculocreate(this.ondatavehiculo());
                                                setTimeout(() => {
                                                    this.props.history.push( web.serv_link + '/cliente/create');
                                                }, 500);
                                            }}
                                        ></button>
                                    </Tooltip>
                                    <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                        onClick={this.onBack.bind(this)}
                                    >
                                        Atras
                                    </button>
                                </div>
                            }
                        >
                            <div className="forms-groups">
                                <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{ marginTop: -5 }}></div>
                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{ marginTop: -60 }}>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                        <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Clave Cliente'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder=''
                                                    style={{
                                                        textAlign: 'center', paddingLeft: 3,
                                                        cursor: this.state.idcliente != '' ? 'pointer' : 'default'
                                                    }}
                                                    className={`forms-control ${this.state.erroridcliente}`}
                                                    value={this.state.idcliente == '' ? 0 : this.state.idcliente}
                                                    readOnly
                                                    onClick={() => {
                                                        if (this.state.idcliente != '') {
                                                            // this.setState({
                                                            //     visible_clienteshow: true,
                                                            // });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {this.props.ventacreate == 0 ?
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 txts-center'>
                                                <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                                    onClick={() => this.setState({
                                                        visible_searchcliente: true,
                                                    })}
                                                >
                                                    Buscar Cliente
                                                </button>
                                            </div> : null
                                        }
                                        {this.props.ventacreate == 0 ?
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'>
                                                <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                                    onClick={this.onUltimoCliente.bind(this)}
                                                >
                                                    Ultimo Cliente
                                                </button>
                                            </div> : null
                                        }
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre del Cliente'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder=''
                                                    style={{ textAlign: 'left', paddingLeft: 10, 
                                                        paddingRight: 10, cursor: 'default', background: '#eee',
                                                    }}
                                                    className={`forms-control`} readOnly
                                                    value={this.state.namecliente}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Empresa del Cliente'}
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder=''
                                                    style={{ textAlign: 'left', paddingLeft: 10, 
                                                        paddingRight: 10, cursor: 'default', background: '#eee',
                                                    }}
                                                    className={`forms-control`} readOnly
                                                    value={this.state.razonsocialcliente}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ marginTop: 20, paddingTop: 0, background: '#e8e8e8' }}
                                    >
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ paddingTop: 0, }}>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        style={{ background: 'red', }}
                                                        className={`forms-control title_form`} value={'Placa'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR PLACA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control ${this.state.errorplaca}`}
                                                        value={this.state.placa}
                                                        onChange={this.onChangePlaca.bind(this)}
                                                    />
                                                    {this.state.placa.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ placa: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Tipo Vehiculo'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR TIPO VEHICULO'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer', }}
                                                        className={`forms-control ${this.state.erroridtipo}`}
                                                        value={this.state.tipo == null ? '' : this.state.tipo.descripcion}
                                                        readOnly
                                                        onClick={ () => this.setState({ visible_tipo: true, }) }
                                                    />
                                                    {this.state.idtipo.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ idtipo: '', tipo: null, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Marca'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR MARCA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer' }}
                                                        onClick={() => this.setState({ visible_marca: true })}
                                                        className={`forms-control ${this.state.erroridmarca}`}
                                                        value={this.state.marca == null ? "" : this.state.marca.descripcion}
                                                        readOnly
                                                    />
                                                    {this.state.idmarca.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ idmarca: '', marca: null, 
                                                                idmodelo: '', modelo: null, array_modelo: [], }) 
                                                            }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Modelo'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR MODELO DE MARCA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridmodelo}`}
                                                        value={this.state.modelo == null ? '' : this.state.modelo.descripcion}
                                                        readOnly
                                                        onClick={ () => {
                                                            if (this.state.idmarca == '') {
                                                                notification.warning({
                                                                    message: 'ADVERTENCIA',
                                                                    description: 'FAVOR DE SELECCIONAR MARCA.',
                                                                });
                                                                this.setState({ erroridmarca: 'error',});
                                                                return;
                                                            }
                                                            this.setState({visible_modelo: true,})
                                                        } }
                                                    />
                                                    {this.state.idmodelo.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ idmodelo: '', modelo: null, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Año'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR AÑO'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridyear}`}
                                                        value={this.state.year == null ? '' : this.state.year.descripcion}
                                                        readOnly
                                                        onClick={ () => this.setState({visible_year: true,}) }
                                                    />
                                                    {this.state.idyear.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ idyear: '', year: null, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Color'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR COLOR'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridcolor}`}
                                                        value={this.state.color == null ? '' : this.state.color.descripcion}
                                                        readOnly
                                                        onClick={ () => this.setState({visible_color: true,}) }
                                                    />
                                                    {this.state.idcolor.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ idcolor: '', color: null, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nro de Serie'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR NRO SERIE'
                                                        style={{ textAlign: 'left', paddingLeft: 10, }}
                                                        className={`forms-control`}
                                                        value={this.state.nroserie}
                                                        onChange={(event) => this.setState({nroserie: event.target.value})}
                                                    />
                                                    {this.state.nroserie.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ nroserie: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <textarea type='text' placeholder='Ingresar Descripcion' 
                                                        style={{ 
                                                            height: 'auto', paddingTop: 8, paddingBottom: 2, maxHeight: 40,
                                                        }}
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Observaciones'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <textarea placeholder='INGRESAR OBSERVACION' 
                                                        style={{ paddingRight: 30, paddingBottom: 5, 
                                                            height: 110, maxHeight: 110, paddingTop: 8,
                                                        }}
                                                        className={`forms-control`} value={this.state.nota}
                                                        onChange={(event) => this.setState({
                                                            nota: event.target.value,
                                                        })}
                                                    />
                                                    {this.state.nota.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: '3%'}}
                                                            onClick={() => this.setState({ nota: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups txts-center mt-2'>
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
                        </Card> : this.onLoading()
                    }
                </div>
                {/* <div className='loaders-wrappers d-flexs justifys-contents-centers aligns-items-centers'>
                    <div className='loaders'>
                        <div className='balls-scales-ripples-multiples'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

EditarVehiculo.propTypes = {
    vehiculo: PropTypes.object,
    ventacreate: PropTypes.number,
    venta: PropTypes.object,
    buttoncolor: PropTypes.string,
}

EditarVehiculo.defaultProps = {
    ventacreate: 0,
    venta: {
        cliente_first: {
            idcliente: 0, nombre: '', empresa: '',
        },
    },
    vehiculo: {
        create: 0, placa: '', nroserie: '',
        idcliente: '', idtipo: '', idmarca: '',
        idmodelo: '', idcolor: '', idyear: '',
        nota: '', namecliente: '',
        razonsocialcliente: '',
        marca: null, modelo: null, year: null,
        color: null, tipo: null,
        array_cliente: [], array_tipo: [],
        array_marca: [],  array_year: [],
        array_color: [], array_modelo: [],
        imagen: '', foto: '',
    },
    buttoncolor: '',
}

export default withRouter(EditarVehiculo);
