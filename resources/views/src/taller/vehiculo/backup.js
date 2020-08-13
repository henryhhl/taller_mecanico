
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Modal, Card, notification, Tooltip } from 'antd';
import 'antd/dist/antd.css';

class EditarVehiculo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,

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
            bandera: 0,
        }
    }
    componentDidMount() {
        this.props.get_link('vehiculo');
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
        this.get_data();
    }
    get_data() {
        axios.get('/vehiculo/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    var data = response.data.data;
                    this.setState({
                        array_tipo: response.data.tipo,
                        array_marca: response.data.marca,
                        array_year: response.data.year,
                        array_color: response.data.color,
                        array_modelo: response.data.modelo,
                        placa: data.placa,
                        idcliente: data.idcliente,
                        idtipo: data.idvehiculotipo,
                        idmarca: data.idmarca,
                        idyear: data.idvehiculoyear,
                        idcolor: data.idvehiculocolor,
                        idmodelo: data.idmodelo,
                        nota: (data.observacion == null)?'': data.observacion,
                        
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
                }
                if (response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        ).catch(
            error => {
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onChangePlaca(event) {
        this.setState({
            placa: event.target.value,
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
            message: 'Advertencia',
            description: 'Cliente extraido exitosamente..',
        });
        this.setState({
            idcliente: data.id,
            erroridcliente: '',
            visible_cliente: false,
            namecliente: data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido,
            razonsocialcliente: data.razonsocial == null ? 'S/Empresa' : data.razonsocial,
        });
    }
    onChangeIDVehiculoTipo(event) {
        this.setState({
            idtipo: event.target.value,
            erroridvehiculo: '',
        });
    }
    onMarcaID(data) {
        axios.post('/vehiculo/modeloMarca', { idMarca: data.id }).then(
            (response) => {
                if (response.status == 200) {
                    this.setState({
                        array_modelo: response.data.data,
                        marca: data,
                        erroridmarca: '',
                        idmarca: data.id,
                        visible_marca: false,
                        modelo: null,
                        idmodelo: '',
                    });
                }
                if (response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        ).catch(
            error => {
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onBack() {
        this.props.history.goBack();
    }
    onSearchCliente() {
        axios.post('/cliente/searchcliente', { search: this.state.search_cliente, }).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        this.setState({
                            array_cliente: response.data.data,
                            visible_searchcliente: false,
                            search_cliente: '',
                        });
                        if (response.data.data.length == 0) {
                            notification.error({
                                message: 'Advertencia',
                                description: 'No hay registro de cliente Favor de registrar uno..',
                                placement: 'bottomRight',
                            });
                        } else {
                            notification.success({
                                message: 'Advertencia',
                                description: 'Clientes extraido exitosamente..',
                                placement: 'bottomRight',
                            });
                        }
                        setTimeout(() => {
                            this.setState({
                                visible_cliente: true,
                            })
                        }, 500);
                    }
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    onUltimoCliente() {
        axios.get('/cliente/getultimo').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        var data = response.data.data;
                        if (data != null) {
                            notification.success({
                                message: 'Advertencia',
                                description: 'Cliente extraido exitosamente..',
                            });
                            this.setState({
                                idcliente: data.id,
                                erroridcliente: '',
                                namecliente: data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido,
                                razonsocialcliente: data.razonsocial == null ? 'S/Empresa' : data.razonsocial,
                            });
                        } else {
                            notification.error({
                                message: 'Advertencia',
                                description: 'No hay registro de cliente Favor de registrar uno..',
                            });
                        }
                    }
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    onValidar() {
        if (this.state.placa.toString().trim().length > 0 && 
            this.state.idcliente != '' && this.state.idtipo != '' &&
            this.state.idmarca != '' && this.state.idmodelo != '' &&
            this.state.idyear != '' && this.state.idcolor != ''
        ) {
            this.onSubmit();
        } else {
            if (this.state.placa.toString().trim().length == 0) {
                this.setState({
                    errorplaca: 'error',
                });
            }
            if (this.state.idcliente == '') {
                this.setState({
                    erroridcliente: 'error',
                });
            }
            if (this.state.idtipo == '') {
                this.setState({
                    erroridtipo: 'error',
                });
            }
            if (this.state.idmarca == '') {
                this.setState({
                    erroridmarca: 'error',
                });
            }
            if (this.state.idmodelo == '') {
                this.setState({
                    erroridmodelo: 'error',
                });
            }
            if (this.state.idyear == '') {
                this.setState({
                    erroridyear: 'error',
                });
            }
            if (this.state.idcolor == '') {
                this.setState({
                    erroridcolor: 'error',
                });
            }
            notification.error({
                message: 'ERROR',
                description: 'Favor de llenar los campos requeridos..',
            });
        }
    }
    onSubmit() {
        this.setState({
            loading: true,
        });
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
        formdata.append('bandera', this.state.bandera);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: '/vehiculo/update',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype': 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                this.setState({
                    loading: false,
                });
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'VEHICULO ACTUALIZADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite Placa repetido..',
                        });
                        this.setState({
                            errorplaca: 'error',
                        });
                    }
                }
                if (response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        ).catch(
            error => {
                this.setState({
                    loading: false,
                });
                notification.error({
                    message: 'Advertencia',
                    description: 'No se pudo guardar la informacion revisar conexion..',
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onChangeFoto(event) {
        let files = event.target.files;
        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    foto: e.target.result,
                    imagen: files[0],
                    bandera: 1,
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
                        visible_searchcliente: false,
                        search_cliente: '',
                    })
                }}
                bodyStyle={{ padding: 10, paddingTop: 6, }}
                footer={null}
                style={{ top: 20, }}
            >
                <div className='forms-groups' style={{ marginTop: -30 }}>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <textarea type='text' placeholder='Ingresar Descripcion'
                                    style={{
                                        background: '#1890ff', color: 'white',
                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                        height: 'auto', paddingTop: 8, paddingBottom: 0,
                                    }}
                                    className={`forms-control`}
                                    value={'Nombre, Empresa'}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center'
                        style={{ display: 'flex', justifyContent: 'center', marginTop: -35, }}
                    >
                        <div className='cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12 txts-center'>
                            <div className='inputs-groups'>
                                <input type='text' placeholder='Buscar...'
                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                    className={`forms-control`}
                                    value={this.state.search_cliente}
                                    onChange={(event) => {
                                        this.setState({
                                            search_cliente: event.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                        style={{ display: 'flex', justifyContent: 'center', marginTop: -15, }}
                    >
                        <button className=" mt-1 mr-2 btn-hover-shine btn btn-light"
                            onClick={() => this.setState({
                                visible_searchcliente: false,
                                search_cliente: '',
                            })}
                        >
                            Cancelar
                        </button>
                        <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
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
                        <div style={{marginTop: -30, display: 'flex', justifyContent: 'center',}}>
                            <button className="btn-hover-shine btn btn-primary pull-right mb-2"
                                onClick={() => {
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
                                    this.props.vehiculocreate(objeto);
                                    setTimeout(() => {
                                        this.props.history.push('/taller_mecanico/cliente/create');
                                    }, 500);
                                }}
                            >
                                NUEVO CLIENTE
                            </button>
                        </div>
                    </div>
                    <Card title="CLIENTES ENCONTRADOS" bodyStyle={{ padding: 0, }}
                        extra={
                            <button className="btn-hover-shine btn btn-secondary"
                                onClick={() => {
                                    this.setState({
                                        visible_cliente: false,
                                        array_cliente: [],
                                    });
                                    setTimeout(() => {
                                        this.setState({
                                            visible_searchcliente: true,
                                            search_cliente: '',
                                        });
                                    }, 400);
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
                                padding: 0, height: 'auto', maxHeight: 300, overflowY: 'auto',
                                overflowX: 'none',
                            }}
                        >
                            {this.state.array_cliente.map(
                                (data, key) => (
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                        style={{ padding: 0, }} key={key}
                                        onClick={() => {
                                            this.onChangeIDCliente(data)
                                        }}
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
    onModalVehiculoTipo() {
        var tipo = this.state.tipo;
        return (
            <Modal
                title={(!this.state.new_tipo) ? "LISTADO" : null}
                visible={this.state.visible_tipo}
                onCancel={() => {
                    if (!this.state.new_tipo) {
                        this.setState({
                            visible_tipo: false,
                            new_tipo: false,
                            loading_tipo: false,
                            descripcion_tipo: '',
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                footer={null}
                style={{ top: 100, }}
                width={500}
            >
                <div className="forms-groups">
                    {(!this.state.new_tipo) ?
                        <Card title="VEHICULO TIPO" 
                            bodyStyle={{ padding: 0, }}
                            headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold'}}
                            extra={
                                <button className="btn-hover-shine btn btn-secondary"
                                    onClick={() => this.setState({new_tipo: true,})}
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
                                                    tipo: data,
                                                    visible_tipo: false,
                                                    idtipo: data.id,
                                                    erroridtipo: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 15,
                                                    height: 20, lineHeight: 0, textAlign: 'center',
                                                    background: (tipo == null) ? 'white' : (tipo.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (tipo == null) ? 'rgba(0, 0, 0, 0.65)' : (tipo.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (tipo == null) ? '400' : (tipo.id == data.id) ? 'bold' : '400',
                                                }}
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
                        <div className="cards" style={{marginTop: -20,}}>
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO VEHICULO TIPO
                                </div>
                            </div>
                            {(!this.state.loading_tipo) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_tipo}
                                                    onChange={(event) => this.setState({descripcion_tipo: event.target.value}) }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                            onClick={this.onValidarVehiculoTipo.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                            onClick={() => this.setState({new_tipo: false, descripcion_tipo: '',})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 

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
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoMarca() {
        var marca = this.state.marca;
        return (
            <Modal
                title={(!this.state.new_marca) ? "LISTADO" : null}
                visible={this.state.visible_marca}
                onCancel={() => {
                    if (!this.state.new_marca) {
                        this.setState({
                            visible_marca: false,
                            new_marca: false,
                            loading_marca: false,
                            descripcion_marca: '',
                        })
                    }
                }}
                footer={null}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 100, }}
                width={500}
            >
                <div className="forms-groups">
                    {(!this.state.new_marca) ?
                        <Card title="MARCA" 
                            bodyStyle={{ padding: 0, }}
                            headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold'}}
                            extra={
                                <button className="btn-hover-shine btn btn-secondary"
                                    onClick={() => this.setState({new_marca: true,})}
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
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 15,
                                                    height: 20, lineHeight: 0, textAlign: 'center',
                                                    background: (marca == null) ? 'white' : (marca.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (marca == null) ? 'rgba(0, 0, 0, 0.65)' : (marca.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (marca == null) ? '400' : (marca.id == data.id) ? 'bold' : '400',
                                                }}
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
                        <div className="cards" style={{marginTop: -20,}}>
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVA MARCA
                                </div>
                            </div>
                            {(!this.state.loading_marca) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_marca}
                                                    onChange={(event) => this.setState({descripcion_marca: event.target.value}) }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                            onClick={this.onValidarMarca.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                            onClick={() => this.setState({new_marca: false, descripcion_marca: '',})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 

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
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoModelo() {
        var modelo = this.state.modelo;
        return (
            <Modal
                title={(!this.state.new_modelo) ? "LISTADO" : null}
                visible={this.state.visible_modelo}
                onCancel={() => {
                    if (!this.state.new_modelo) {
                        this.setState({
                            visible_modelo: false,
                            new_modelo: false,
                            loading_modelo: false,
                            descripcion_modelo: '',
                        })
                    }
                }}
                footer={null}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 100, }}
                width={500}
            >
                <div className="forms-groups">
                    {(!this.state.new_modelo) ?
                        <Card title="MODELO" 
                            bodyStyle={{ padding: 0, }}
                            headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold'}}
                            extra={
                                (this.state.idmarca != '') ?
                                    <button className="btn-hover-shine btn btn-secondary"
                                        onClick={() => this.setState({new_modelo: true,})}
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
                                                    modelo: data,
                                                    idmodelo: data.id,
                                                    erroridmodelo: '',
                                                    visible_modelo: false,
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 15,
                                                    height: 20, lineHeight: 0, textAlign: 'center',
                                                    background: (modelo == null) ? 'white' : (modelo.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (modelo == null) ? 'rgba(0, 0, 0, 0.65)' : (modelo.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (modelo == null) ? '400' : (modelo.id == data.id) ? 'bold' : '400',
                                                }}
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
                        <div className="cards" style={{marginTop: -20,}}>
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO MODELO
                                </div>
                            </div>
                            {(!this.state.loading_modelo) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_modelo}
                                                    onChange={(event) => this.setState({descripcion_modelo: event.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                            onClick={this.onValidarModelo.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                            onClick={() => this.setState({new_modelo: false, descripcion_modelo: '',})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 

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
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoYear() {
        var year = this.state.year;
        return (
            <Modal
                title={(!this.state.new_year) ? "LISTADO" : null}
                visible={this.state.visible_year}
                onCancel={() => {
                    if (!this.state.new_year) {
                        this.setState({
                            visible_year: false,
                            new_year: false,
                            loading_year: false,
                            descripcion_year: '',
                        })
                    }
                }}
                footer={null}
                style={{ top: 100, }}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                width={500}
            >
                <div className="forms-groups">
                    {(!this.state.new_year) ?
                        <Card title="AÑO" 
                            bodyStyle={{ padding: 0, }}
                            headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold'}}
                            extra={
                                <button className="btn-hover-shine btn btn-secondary"
                                    onClick={() => this.setState({new_year: true,})}
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
                                                    year: data,
                                                    visible_year: false,
                                                    idyear: data.id,
                                                    erroridyear: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 15,
                                                    height: 20, lineHeight: 0, textAlign: 'center',
                                                    background: (year == null) ? 'white' : (year.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (year == null) ? 'rgba(0, 0, 0, 0.65)' : (year.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (year == null) ? '400' : (year.id == data.id) ? 'bold' : '400',
                                                }}
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
                        <div className="cards" style={{marginTop: -20,}}>
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO AÑO
                                </div>
                            </div>
                            {(!this.state.loading_year) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_year}
                                                    onChange={(event) => {
                                                        if (!isNaN(event.target.value)) {
                                                            this.setState({descripcion_year: event.target.value})
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                            onClick={this.onValidarYear.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                            onClick={() => this.setState({new_year: false, descripcion_year: '',})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 

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
                    }
                </div>
            </Modal>
        );
    }
    onModalVehiculoColor() {
        var color = this.state.color;
        return (
            <Modal
                title={(!this.state.new_color) ? "LISTADO" : null}
                visible={this.state.visible_color}
                onCancel={() => {
                    if (!this.state.new_color) {
                        this.setState({
                            visible_color: false,
                            new_color: false,
                            loading_color: false,
                            descripcion_color: '',
                        })
                    }
                }}
                footer={null}
                style={{ top: 100, }}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                width={500}
            >
                <div className="forms-groups">
                    {(!this.state.new_color) ?
                        <Card title="COLOR" 
                            headStyle={{color: 'white', background: '#1890ff', fontWeight: 'bold'}}
                            bodyStyle={{ padding: 0, }}
                            extra={
                                <button className="btn-hover-shine btn btn-secondary"
                                    onClick={() => this.setState({new_color: true,})}
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
                                                    color: data,
                                                    idcolor: data.id,
                                                    visible_color: false,
                                                    erroridcolor: '',
                                                })
                                            }}
                                        >
                                            <Card.Grid hoverable={false}
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 15,
                                                    height: 20, lineHeight: 0, textAlign: 'center',
                                                    background: (color == null) ? 'white' : (color.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (color == null) ? 'rgba(0, 0, 0, 0.65)' : (color.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (color == null) ? '400' : (color.id == data.id) ? 'bold' : '400',
                                                }}
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
                        <div className="cards" style={{marginTop: -20,}}>
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVO COLOR
                                </div>
                            </div>
                            {(!this.state.loading_color) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.descripcion_color}
                                                    onChange={(event) => this.setState({descripcion_color: event.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                            onClick={this.onValidarColor.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                            onClick={() => this.setState({new_color: false, descripcion_color: '',})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div> : 

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
                    }
                </div>
            </Modal>
        );
    }
    onValidarVehiculoTipo() {
        if (this.state.descripcion_tipo.toString().trim().length == 0) {
            notification.error({
                message: 'Advertencia',
                description: 'Campo descripcion requerido..',
            });
            return;
        }
        this.setState({
            loading_tipo: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_tipo);
        axios(
            {
                method: 'post',
                url: '/vehiculo_tipo/store',
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
                        this.state.array_tipo.push(response.data.data);
                        this.setState({
                            visible_tipo: false,
                            new_tipo: false,
                            loading_tipo: false,
                            descripcion_tipo: '',
                            tipo: response.data.data,
                            idtipo: response.data.data.id,
                            array_tipo: this.state.array_tipo,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite vehiculo tipo repetido..',
                        });
                    }
                }
                this.setState({
                    loading_tipo: false,
                });
            }
        ).catch(
            error => {
                this.setState({
                    loading_tipo: false,
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onValidarMarca() {
        if (this.state.descripcion_marca.toString().trim().length == 0) {
            notification.error({
                message: 'Advertencia',
                description: 'Campo descripcion requerido..',
            });
            return;
        }
        this.setState({
            loading_marca: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_marca);
        axios(
            {
                method: 'post',
                url: '/vehiculo_marca/store',
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
                            description: 'Marca registrado exitosamente..',
                        });
                        this.state.array_marca.push(response.data.data);
                        this.setState({
                            visible_marca: false,
                            new_marca: false,
                            loading_marca: false,
                            descripcion_marca: '',
                            marca: response.data.data,
                            idmarca: response.data.data.id,
                            array_marca: this.state.array_marca,
                            array_modelo: [],
                            modelo: null,
                            idmodelo: '',
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite marca repetido..',
                        });
                    }
                }
                this.setState({
                    loading_marca: false,
                });
            }
        ).catch(
            error => {
                this.setState({
                    loading_marca: false,
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onValidarModelo() {
        if (this.state.descripcion_modelo.toString().trim().length == 0) {
            notification.error({
                message: 'Advertencia',
                description: 'Campo descripcion requerido..',
            });
            return;
        }
        this.setState({
            loading_modelo: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_modelo);
        formdata.append('idmarca', this.state.idmarca);
        axios(
            {
                method: 'post',
                url: '/vehiculo_modelo/store',
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
                            description: 'MODELO registrado exitosamente..',
                        });
                        this.state.array_modelo.push(response.data.data);
                        this.setState({
                            visible_modelo: false,
                            new_modelo: false,
                            loading_modelo: false,
                            descripcion_modelo: '',
                            modelo: response.data.data,
                            idmodelo: response.data.data.id,
                            array_modelo: this.state.array_modelo,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite modelo repetido..',
                        });
                    }
                }
                this.setState({
                    loading_modelo: false,
                });
            }
        ).catch(
            error => {
                this.setState({
                    loading_modelo: false,
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onValidarYear() {
        if (this.state.descripcion_year.toString().trim().length == 0) {
            notification.error({
                message: 'Advertencia',
                description: 'Campo descripcion requerido..',
            });
            return;
        }
        this.setState({
            loading_year: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_year);
        axios(
            {
                method: 'post',
                url: '/vehiculo_year/store',
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
                            description: 'Año registrado exitosamente..',
                        });
                        this.state.array_year.push(response.data.data);
                        this.setState({
                            visible_year: false,
                            new_year: false,
                            loading_year: false,
                            descripcion_year: '',
                            year: response.data.data,
                            idyear: response.data.data.id,
                            array_year: this.state.array_year,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite año repetido..',
                        });
                    }
                }
                this.setState({
                    loading_year: false,
                });
            }
        ).catch(
            error => {
                this.setState({
                    loading_year: false,
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    onValidarColor() {
        if (this.state.descripcion_color.toString().trim().length == 0) {
            notification.error({
                message: 'Advertencia',
                description: 'Campo descripcion requerido..',
            });
            return;
        }
        this.setState({
            loading_color: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_color);
        axios(
            {
                method: 'post',
                url: '/vehiculo_color/store',
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
                            description: 'Color registrado exitosamente..',
                        });
                        this.state.array_color.push(response.data.data);
                        this.setState({
                            visible_color: false,
                            new_color: false,
                            loading_color: false,
                            descripcion_color: '',
                            color: response.data.data,
                            idcolor: response.data.data.id,
                            array_color: this.state.array_color,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'Advertencia',
                            description: 'No se permite color repetido..',
                        });
                    }
                }
                this.setState({
                    loading_color: false,
                });
            }
        ).catch(
            error => {
                this.setState({
                    loading_color: false,
                });
                if (error.response.status == 401) {
                    this.setState({
                        auth: true,
                    });
                }
            }
        );
    }
    render() {
        if (this.state.auth) {
            <Redirect to='/login' />
        }
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
                    <div className="card-header-tab card-header">
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                EDITAR DE VEHICULO
                        </div>
                        <div className="btn-actions-pane-right text-capitalize">
                            <Tooltip placement='top' title='NUEVO CLIENTE'>
                                <button className="btn-hover-shine btn btn-sm btn-outline-alternate rounded-circle mr-2 fa fa-street-view" //odnoklassniki
                                    style={{fontSize: 18, padding: 5, paddingLeft: 7, paddingRight: 7, }}
                                    onClick={() => {
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
                                        this.props.vehiculocreate(objeto);
                                        setTimeout(() => {
                                            this.props.history.push('/taller_mecanico/cliente/create');
                                        }, 500);
                                    }}
                                ></button>
                            </Tooltip>
                            <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                onClick={this.onBack.bind(this)}
                            >
                                Atras
                            </button>
                        </div>
                    </div>
                    {(!this.state.loading) ?
                        <div className='forms-groups'>
                            <div className="forms-groups">
                                <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12' style={{ marginTop: -15 }}></div>
                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{ marginTop: -80 }}>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                        <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Clave Cliente'}
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
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 txts-center'>
                                            <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                                onClick={() => this.setState({
                                                    visible_searchcliente: true,
                                                })}
                                            >
                                                Buscar Cliente
                                            </button>
                                        </div>
                                        <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'>
                                            <button className=" mt-1 mr-2 btn-hover-shine btn btn-light btn-lg btn-block"
                                                onClick={this.onUltimoCliente.bind(this)}
                                            >
                                                Ultimo Cliente
                                            </button>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Nombre del Cliente'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder=''
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.namecliente}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    style={{
                                                        background: '#1890ff', color: 'white',
                                                        fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                    }}
                                                    className={`forms-control`} value={'Empresa del Cliente'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder=''
                                                    style={{ textAlign: 'left', paddingLeft: 10, }}
                                                    className={`forms-control`}
                                                    value={this.state.razonsocialcliente}
                                                    readOnly
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
                                                    <input type='text'
                                                        style={{
                                                            background: 'red', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Placa'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, }}
                                                        className={`forms-control ${this.state.errorplaca}`}
                                                        value={this.state.placa}
                                                        onChange={this.onChangePlaca.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Tipo Vehiculo'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'pointer', }}
                                                        className={`forms-control ${this.state.erroridtipo}`}
                                                        value={this.state.tipo == null ? '' : this.state.tipo.descripcion}
                                                        readOnly
                                                        onClick={
                                                            () => this.setState({ visible_tipo: true, })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Marca'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'pointer' }}
                                                        onClick={() => this.setState({ visible_marca: true })}
                                                        className={`forms-control ${this.state.erroridmarca}`}
                                                        value={this.state.marca == null ? "" : this.state.marca.descripcion}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Modelo'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridmodelo}`}
                                                        value={this.state.modelo == null ? '' : this.state.modelo.descripcion}
                                                        readOnly
                                                        onClick={
                                                            () => this.setState({visible_modelo: true,})
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`}
                                                        value={'Año'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridyear}`}
                                                        value={this.state.year == null ? '' : this.state.year.descripcion}
                                                        readOnly
                                                        onClick={
                                                            () => this.setState({visible_year: true,})
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Color'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'pointer' }}
                                                        className={`forms-control ${this.state.erroridcolor}`}
                                                        value={this.state.color == null ? '' : this.state.color.descripcion}
                                                        readOnly
                                                        onClick={
                                                            () => this.setState({visible_color: true,})
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text'
                                                        style={{
                                                            background: '#1890ff', color: 'white',
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer',
                                                        }}
                                                        className={`forms-control`} value={'Nro de Serie'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, }}
                                                        className={`forms-control`}
                                                        value={this.state.nroserie}
                                                        onChange={(event) => this.setState({nroserie: event.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ paddingTop: 0, marginTop: -20, }}
                                        >
                                            <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <textarea type='text' placeholder='Ingresar Descripcion' 
                                                        style={{ background: '#1890ff', color: 'white', 
                                                            fontWeight: 'bold', textAlign: 'center', cursor: 'pointer', 
                                                            height: 'auto', paddingTop: 8, paddingBottom: 2, maxHeight: 40,
                                                        }}
                                                        className={`forms-control`} value={'Observaciones'}
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
                                                    <textarea placeholder='...' 
                                                        style={{ 
                                                            height: 110, maxHeight: 110, paddingTop: 8,
                                                        }}
                                                        className={`forms-control`} value={this.state.nota}
                                                        onChange={(event) => this.setState({
                                                            nota: event.target.value,
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='forms-groups txts-center mt-4'>
                                <button className="mb-2 mr-2 btn-hover-shine btn btn-primary"
                                    onClick={this.onValidar.bind(this)}
                                >
                                    Aceptar
                                </button>
                                <button className="mb-2 mr-2 btn-hover-shine btn btn-danger"
                                    onClick={this.onBack.bind(this)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div> :

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

EditarVehiculo.propTypes = {
    vehiculo: PropTypes.object,
}

EditarVehiculo.defaultProps = {
    vehiculo: {
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
}

export default withRouter(EditarVehiculo);
