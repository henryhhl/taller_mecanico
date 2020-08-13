
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { Modal, Card, notification } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

class CreateVehiculoModelo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            visible_marca: false,

            new_create: false,
            loading_marca: false,
            descripcion_marca: '',
            error_descripcionmarca: '',
            
            descripcion: '',
            errordescripcion: '',
            erroridmarca: '',

            marca: {
                id: null,
                descripcion: '',
            },

            array_marca: [],
        }
    }
    componentDidMount() {
        this.props.get_link('vehiculo');
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/vehiculo_modelo/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            array_marca: response.data.data,
                        });
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
                }
            }
        ).catch( error => {
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
            errordescripcion: '',
        });
    }
    onMarcaID(data) {
        this.setState({
            marca: data, erroridmarca: '',
            visible_marca: false,
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if (this.state.descripcion.toString().trim().length > 0 && this.state.marca.id != null) {
            this.onSesion(1);
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({ errordescripcion: 'error', });
            }
            if (this.state.marca.id == null) {
                this.setState({ erroridmarca: 'error', });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR CAMPOS REQUERIDOS.',
            });
        }
    }
    onSesion(bandera) {
        if (bandera == 1) this.setState({ loading: true, });
        axios.get(  web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    if (bandera == 2) this.setState({ visible_marca: false, });
                    this.props.logout();
                    return;
                }
                if (bandera == 1)  this.onSubmit();
                if (bandera == 2)  this.onSubmitMarca();
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ loading: false, });
            if (bandera == 2)  this.setState({ loading_marca: false, });
        } ).catch( error => {
            this.setState({ loading: false, });
            if (bandera == 2) this.setState({ loading_marca: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {
        this.setState({ loading: true, });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('idmarca', this.state.marca.id);

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
                this.setState({ loading: false, });
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        notification.success({
                            message: 'SUCCESS',
                            description: 'MODELO DE MARCA CREADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE MODELO DE MARCA REPETIDO',
                        });
                        this.setState({ errordescripcion: 'error', });
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
    onModalVehiculoMarca() {
        var marca = this.state.marca;
        return (
            <Modal
                title={(!this.state.new_create) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_marca}
                onCancel={() => {
                    if (!this.state.new_create) {
                        this.setState({
                            visible_marca: false, new_create: false,
                            loading_marca: false, descripcion_marca: '', 
                            error_descripcionmarca: '',
                        })
                    }
                }}
                bodyStyle={{padding: 0, paddingBottom: 5,}}
                style={{ top: 100, }} width={450} footer={null}
            >
                <div className="forms-groups">
                    {(!this.state.new_create) ?
                        <Card title="VEHICULO MARCA" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className="btn-hover-shine btn btn-secondary"
                                    onClick={() => this.setState({new_create: true,})}
                                >
                                    Nuevo
                                </button>
                            }
                        >
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                style={{
                                    padding: 0, height: 'auto', maxHeight: 350, overflowY: 'auto', overflowX: 'none',
                                }}
                            >
                                {this.state.array_marca.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={this.onMarcaID.bind(this, data)}
                                        >
                                            <Card.Grid hoverable={false} 
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 13,
                                                    height: 18, lineHeight: 0, textAlign: 'center',
                                                    background: (marca.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (marca.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (marca.id == data.id) ? 'bold' : '400',
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
                        <div className="cards">
                            <div className="card-header-tab card-header">
                                <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                    <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        NUEVA MARCA
                                </div>
                            </div>
                            {(!this.state.loading_marca) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ paddingTop: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text'
                                                    className={`forms-control title_form`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='INGRESAR DESCRIPCION'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_descripcionmarca}`}
                                                    value={this.state.descripcion_marca}
                                                    onChange={ (event) => this.setState({ descripcion_marca: event.target.value, error_descripcionmarca: '', }) }
                                                />
                                                {this.state.descripcion_marca.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ descripcion_marca: '', }) }
                                                    ></i> 
                                                }
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
                                            onClick={() => this.setState({new_create: false, descripcion_marca: '', error_descripcionmarca: '', })}
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
    onValidarMarca() {
        if (this.state.descripcion_marca.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTNCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ error_descripcionmarca: 'error', });
            return;
        }
        this.setState({ loading_marca: true, });
        this.onSesion(2);
    }
    onSubmitMarca() {
        this.setState({ loading_marca: true, });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_marca);
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
                            loading_marca: false, descripcion_marca: '',
                            marca: response.data.data,
                            array_marca: response.data.marca,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE MARCA REPETIDO',
                        });
                        this.setState({ error_descripcionmarca: 'error', });
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
                this.setState({ auth: true, });
            }
        } );
    }
    render() {
        return (
            <div className="rows">
                {this.onModalVehiculoMarca()}
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="NUEVO MODELO DE MARCA"
                                headStyle={{fontSize: 14, }}
                                bodyStyle={{padding: 4, paddingTop: 0, }}
                                extra={ <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                        onClick={this.onBack.bind(this)}
                                    >
                                        Atras
                                    </button> 
                                }
                            >
                                <div className="forms-groups">
                                    <div className='cols-lg-3 cols-md-3'></div>
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form`} value={'Descripcion'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR DESCRIPCION'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control ${this.state.errordescripcion}`}
                                                        value={this.state.descripcion}
                                                        onChange={this.onChangeDescripcion.bind(this)}
                                                    />
                                                    {this.state.descripcion.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ descripcion: '', }) }
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
                                                        className={`forms-control title_form`} value={'Marca'}
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
                                                    {this.state.marca.id == null ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ marca: {id: null, descripcion: '', }, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
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

export default withRouter(CreateVehiculoModelo);
