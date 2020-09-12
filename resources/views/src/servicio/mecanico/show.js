
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { Card, Modal, Table, notification, Upload, message } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

class ShowMecanico extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            nromecanico: '',
            nombre: '',
            apellido: '',
            ci: '',
            genero: 'N',
            telefono: '',
            celular: '',
            direccion: '',
            ciudad: 'SANTA CRUZ',
            provincia: '',
            email: '',

            imagen: '',
            foto: '',
            deleteimg: false,
            bandera: 0,

            errorname: '',
            errorapellido: '',
            errorci: '',
            erroremail: '',
        }
    }
    componentDidMount() {
        this.props.get_link('mecanico', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/mecanico/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    console.log(response)
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, response.data.visitasitio);
                        this.setState({
                            nombre: response.data.data.nombre,
                            apellido: response.data.data.apellido == null ? '' : response.data.data.apellido,
                            ci: response.data.data.ci == null ? '' : response.data.data.ci,
                            email: response.data.data.email == null ? '' : response.data.data.email,
                            telefono: response.data.data.telefono == null ? '' : response.data.data.telefono,
                            celular: response.data.data.celular == null ? '' : response.data.data.celular,
                            ciudad: response.data.data.ciudad == null ? '' : response.data.data.ciudad,
                            direccion: response.data.data.direccion == null ? '' : response.data.data.direccion,
                            provincia: response.data.data.provincia == null ? '' : response.data.data.provincia,
                            genero: response.data.data.genero,
                            nromecanico: response.data.data.id,
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
    onChangeNombre(event) {
        this.setState({
            nombre: event.target.value,
            errorname: '',
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event.target.value,
            errorapellido: '',
        });
    }
    onChangeCI(event) {
        this.setState({
            ci: event.target.value,
            errorci: '',
        });
    }
    onChangeGenero(event) {
        this.setState({ genero: event.target.value, });
    }
    onChangeTelefono(event) {
        if (!isNaN(event.target.value)) {
            this.setState({ telefono: event.target.value, });
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onChangeCelular(event) {
        if (!isNaN(event.target.value)) {
            this.setState({ celular: event.target.value, });
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        console.log(document.getElementById('img-img').value);
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
        if ((this.state.nombre.toString().trim().length > 0) && (this.state.apellido.toString().trim().length > 0) && (this.state.ci.toString().trim().length > 0)) {
            this.onSesion();
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    errorname: 'error',
                });
            }
            if (this.state.apellido.toString().trim().length == 0) {
                this.setState({
                    errorapellido: 'error',
                });
            }
            if (this.state.ci.toString().trim().length == 0) {
                this.setState({ errorci: 'error', });
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
        formdata.append('ci', this.state.ci);
        formdata.append('genero', this.state.genero);
        formdata.append('telefono', this.state.telefono);
        formdata.append('celular', this.state.celular);
        formdata.append('direccion', this.state.direccion);
        formdata.append('ciudad', this.state.ciudad);
        formdata.append('provincia', this.state.provincia);
        formdata.append('email', this.state.email);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);
        formdata.append('id', this.props.match.params.id);
        formdata.append('bandera', this.state.bandera);

        axios(
            {
                method: 'post',
                url: web.servidor + '/mecanico/update',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',    
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then( response => {
            this.setState({ loading: false, });
            if (response.status == 200) {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'MECANICO ACTUALIZADO EXITOSAMENTE',
                    });
                    this.props.history.goBack();
                }
            }
            if (response.status == 401) {
                this.setState({ auth: true, });
            }
        } ).catch( error => {
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
                console.log(e)
                this.setState({
                    foto: e.target.result,
                    imagen: files[0],
                    deleteimg: true,
                    bandera: 1,
                });
            };
            reader.readAsDataURL(event.target.files[0]);
            return;
        }
        setTimeout(() => {
            var img = document.getElementById('img-img');
            img.value = '';
            notification.error({
                message: 'Advertencia',
                description: 'Imagen invalida..',
            });
            this.setState({
                deleteimg: false, foto: '',
                imagen: '', bandera: 0,
            });
        }, 500);
        return;
    }
    onDeleteImg() {
        var img = document.getElementById('img-img');
        img.value = '';
        this.setState({
            deleteimg: false, foto: '',
            imagen: '', bandera: 0,
        });
    }
    render() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>

                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="DETALLE MECANICO"
                                headStyle={{fontSize: 14, }}
                                bodyStyle={{padding: 4, paddingTop: 0, }}
                                extra={ <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
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
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nro. Mecanico'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, cursor: 'default', background: '#eee' }}
                                                        className={`forms-control`}
                                                        value={this.state.nromecanico}
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Nombre'}
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Apellido'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR APELLIDO'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.errorapellido}`}
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
                                            <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Direccion'}
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Ciudad'}
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
                                                            <option value={'SANTA CRUZ'}>SANTA CRUZ</option>
                                                            <option value={'BENI'}>BENI</option>
                                                            <option value={'PANDO'}>PANDO</option>
                                                            <option value={'COCHABAMBA'}>COCHABAMBA</option>
                                                            <option value={'SUCRE'}>SUCRE</option>
                                                            <option value={'TARIJA'}>TARIJA</option>
                                                            <option value={'LA PAZ'}>LA PAZ</option>
                                                            <option value={'ORURO'}>ORURO</option>
                                                            <option value={'POTOSI'}>POTOSI</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Prov.'}
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Ced. Identidad'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder='INGRESAR CEDULA DE IDENTIDAD'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                            className={`forms-control ${this.state.errorci}`}
                                                            value={this.state.ci}
                                                            onChange={this.onChangeCI.bind(this)}
                                                        />
                                                        {this.state.ci.toString().length == 0 ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={() => this.setState({ ci: '', }) }
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{padding: 0,}}>
                                                <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' readOnly
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Telefono'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder=''
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Celular'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='text' placeholder=''
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Email'}
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
                                                            className={`forms-control title_form ${this.props.buttoncolor}`} value={'Imagen'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                    <div className='inputs-groups'>
                                                        <input type='file' placeholder=''
                                                            id='img-img'
                                                            style={{ textAlign: 'left', paddingLeft: 10, paddingTop: 10, paddingRight: 10, }}
                                                            className={`forms-control`}
                                                            onChange={this.onChangeFoto.bind(this)}
                                                        />
                                                        {!this.state.deleteimg ? null : 
                                                            <i className='fa fa-close delete_icon'
                                                                onClick={this.onDeleteImg.bind(this)}
                                                            ></i> 
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

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

ShowMecanico.propTypes = {
    buttoncolor: PropTypes.string,
}

ShowMecanico.defaultProps = {
    buttoncolor: '',
}

export default withRouter(ShowMecanico);
