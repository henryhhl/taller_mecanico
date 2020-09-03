
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Card, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

class EditarArticulo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            descripcion: '',
            errordescripcion: '',
        }
    }
    componentDidMount() {
        this.props.get_link('almacen', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/articulo/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.loadingservice(false, response.data.visitasitio);
                        this.setState({
                            descripcion: response.data.data.descripcion,
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
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
            errordescripcion: '',
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if (this.state.descripcion.toString().trim().length > 0) {
            this.onSesion();
        }else {
            this.setState({
                errordescripcion: 'error',
            });
            notification.error({
                message: 'ERROR',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
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
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/articulo/update',
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
                            description: 'ARTICULO ACTUALIZADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                    }
                    if (response.data.response == -1) {
                        notification.error({
                            message: 'ERROR',
                            description: 'NO SE PERMITE ARTICULO REPETIDO',
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
                                title="EDITAR ARTICULO"
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
                                    <div className='cols-lg-3 cols-md-3'></div>
                                    <div className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'>
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{ marginTop: -50 }}>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='Ingresar Descripcion'
                                                        style={{ textAlign: 'left', paddingLeft: 10, }}
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
                                    </div>
                                </div>
                            </Card>
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

EditarArticulo.propTypes = {
    buttoncolor: PropTypes.string,
}

EditarArticulo.defaultProps = {
    buttoncolor: '',
}

export default withRouter(EditarArticulo);
