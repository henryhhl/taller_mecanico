
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import { Card, Modal, Table, notification, Upload, message } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

class CreateCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            nrocliente: '',
            nombre: '',
            apellido: '',
            nit: '',
            genero: 'N',
            telefono: '',
            celular: '',
            razonsocial: '',
            direccion: '',
            ciudad: 1,
            provincia: '',
            email: '',

            imagen: '',
            foto: '',
            deleteimg: false,

            errorname: '',
            erroremail: '',
        }
    }
    componentDidMount() {
        this.props.get_link('cliente');
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/cliente/create').then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.setState({
                            nrocliente: response.data.data,
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
    onChangeNombre(event) {
        this.setState({
            nombre: event.target.value,
            errorname: '',
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event.target.value,
        });
    }
    onChangeNit(event) {
        this.setState({
            nit: event.target.value,
        });
    }
    onChangeGenero(event) {
        this.setState({
            genero: event.target.value,
        });
    }
    onChangeRazonsocial(event) {
        this.setState({
            razonsocial: event.target.value,
        });
    }
    onChangeTelefono(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                telefono: event.target.value,
            });
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onChangeCelular(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                celular: event.target.value,
            });
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        console.log(document.getElementById('img-img').value)
        if (this.state.email.toString().length > 0) {
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!email.test(this.state.email)) {
                notification.error({
                    message: 'ERROR',
                    description: 'EMAIL INCORRECTO.',
                });
                this.setState({ erroremail: 'error', });
                return;
            }
        }
        if ((this.state.nombre.toString().trim().length > 0)) {
            this.onSesion();
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    errorname: 'error',
                });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOS REQUERIDOS.',
            });
        }
    }
    onSesion() {
        this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            console.log(response.data)
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
        this.setState({ loading: true, });
        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('nit', this.state.nit);
        formdata.append('genero', this.state.genero);
        formdata.append('telefono', this.state.telefono);
        formdata.append('razonsocial', this.state.razonsocial);
        formdata.append('celular', this.state.celular);
        formdata.append('direccion', this.state.direccion);
        formdata.append('ciudad', this.state.ciudad);
        formdata.append('provincia', this.state.provincia);
        formdata.append('email', this.state.email);
        formdata.append('imagen', this.state.imagen);

        axios(
            {
                method: 'post',
                url: web.servidor + '/cliente/store',
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
                        if (this.props.vehiculocreate == 1) {
                            this.props.onStoreCliente(response.data.data, 'vehiculo');
                        }
                        if (this.props.ventacreate == 1) {
                            this.props.onStoreCliente(response.data.data, 'venta');
                        }
                        notification.success({
                            message: 'SUCCESS',
                            description: 'CLIENTE CREADO EXITOSAMENTE',
                        });
                        setTimeout(() => {
                            this.props.history.goBack();
                        }, 1000);
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
        console.log(files)
        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg') || (files[0].type === 'image/bmp')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target.result)
                this.setState({
                    foto: e.target.result,
                    imagen: files[0],
                    deleteimg: true,
                });
            };
            reader.readAsDataURL(event.target.files[0]);
            return;
        }
        setTimeout(() => {
            var img = document.getElementById('img-img');
            img.value = '';
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'ARCHIVO INVALIDO',
            });
            this.setState({
                deleteimg: false,
                foto: '',
                imagen: '',
            });
        }, 500);
        return;
    }
    onDeleteImg() {
        var img = document.getElementById('img-img');
        img.value = '';
        this.setState({
            deleteimg: false,
            foto: '',
            imagen: '',
        });
    }
    render() {
        return (
            <div className="rows">
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>

                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="NUEVO CLIENTE"
                                headStyle={{fontSize: 14, }}
                                bodyStyle={{padding: 4, paddingTop: 0, paddingBottom: 8, }}
                                extra={ <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                        onClick={this.onBack.bind(this)}
                                    >
                                        Atras
                                    </button> 
                                }
                            >

                                <div className="forms-groups">

                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -60}}>
                                        <div className='cols-lg-4 cols-md-4'></div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form`} value={'Nro. cliente'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'default', background: '#eee' }}
                                                        className={`forms-control`}
                                                        value={this.state.nrocliente}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                                        style={{ marginTop: 5, paddingTop: 0, background: '#e8e8e8', }}
                                    >
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -30}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Nombre'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR NOMBRE'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.errorname}`}
                                                            value={this.state.nombre}
                                                            onChange={this.onChangeNombre.bind(this)}
                                                        />
                                                        {this.state.nombre.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ nombre: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Apellido'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR APELLIDO'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.apellido}
                                                            onChange={this.onChangeApellido.bind(this)}
                                                        />
                                                        {this.state.apellido.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ apellido: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -40}}>
                                            <div className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form`} value={'Empresa'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR NOMBRE DE EMPRESA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control`}
                                                        value={this.state.razonsocial}
                                                        onChange={this.onChangeRazonsocial.bind(this)}
                                                    />
                                                    {this.state.razonsocial.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ razonsocial: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -40}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Direccion'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR DIRECCION'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.direccion}
                                                            onChange={(event) => this.setState({direccion: event.target.value,})}
                                                        />
                                                        {this.state.direccion.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ direccion: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Ciudad'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <select
                                                            style={{ textAlign: 'left', paddingLeft: 10, }}
                                                            className={`forms-control`}
                                                            value={this.state.ciudad}
                                                            onChange={(event) => this.setState({ciudad: event.target.value,})}
                                                        >
                                                            <option value={1}>Santa Cruz</option>
                                                            <option value={2}>Beni</option>
                                                            <option value={3}>Pando</option>
                                                            <option value={4}>Cochabamba</option>
                                                            <option value={5}>Sucre</option>
                                                            <option value={6}>Tarija</option>
                                                            <option value={7}>La Paz</option>
                                                            <option value={8}>Oruro</option>
                                                            <option value={9}>Potosi</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Prov.'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder=''
                                                            style={{ textAlign: 'left', paddingLeft: 10, }}
                                                            className={`forms-control`}
                                                            value={this.state.provincia}
                                                            onChange={(event) => this.setState({provincia: event.target.value,})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -40}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Nit'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR NIT'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.nit}
                                                            onChange={this.onChangeNit.bind(this)}
                                                        />
                                                        {this.state.nit.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ nit: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Telefono'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR NRO.'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.telefono}
                                                            onChange={this.onChangeTelefono.bind(this)}
                                                        />
                                                        {this.state.telefono.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ telefono: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Celular'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR NRO.'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            value={this.state.celular}
                                                            onChange={this.onChangeCelular.bind(this)}
                                                        />
                                                        {this.state.celular.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ celular: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -40}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Email'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR EMAIL'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.erroremail}`}
                                                            value={this.state.email}
                                                            onChange={(event) => this.setState({email: event.target.value, erroremail: '', })}
                                                        />
                                                        {this.state.email.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ email: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form`} value={'Imagen'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='file' placeholder=''
                                                            id='img-img'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingTop: 10, paddingRight: 24, }}
                                                            className={`forms-control`}
                                                            onChange={this.onChangeFoto.bind(this)}
                                                        />
                                                        {this.state.deleteimg ? 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={this.onDeleteImg.bind(this)}
                                                            ></i> :null
                                                        }
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
                            </Card>

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

CreateCliente.propTypes = {
    vehiculocreate: PropTypes.number,
    ventacreate: PropTypes.number,
}

CreateCliente.defaultProps = {
    vehiculocreate: 0,
    ventacreate: 0,
}

export default withRouter(CreateCliente);
