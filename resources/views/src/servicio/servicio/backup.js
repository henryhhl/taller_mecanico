
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

class EditarServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            descripcion: '',
            precio: '',
            comision: 0,
            nota: '',

            imagen: '',
            foto: '',
            bandera: 0,

            errordescripcion: '',
            errorprecio: '',
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get('/taller_mecanico/servicio/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == 1) {
                        this.setState({
                            descripcion: response.data.data.descripcion,
                            precio: response.data.data.precio,
                            comision: response.data.data.comision,
                            nota: response.data.data.nota == null ? '' : response.data.data.nota,
                            imagen: response.data.data.imagen == null ? '' : response.data.data.imagen,
                            foto: response.data.data.imagen == null ? '' : response.data.data.imagen,
                        });
                    }
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
            errordescripcion: '',
        });
    }
    onChangePrecio(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                precio: event.target.value,
                errorprecio: '',
            });
        }
        if (event.target.value == '') {
            this.setState({
                precio: '',
            });
        }
    }
    onChangeNota(event) {
        this.setState({
            nota: event.target.value,
        });
    }
    onChangeComision(event) {
        if (!isNaN(event.target.value)) {
            if (parseInt(event.target.value) <= 100) {
                this.setState({
                    comision: parseInt(event.target.value),
                });
            }
        }
        if (event.target.value == '') {
            this.setState({
                comision: 0,
            });
        }
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if ((this.state.descripcion.toString().trim().length > 0) &&
            (this.state.precio.toString().length > 0)) {

            if (parseFloat(this.state.precio) > 0) {
                this.onSubmit();
            }else {
                this.setState({
                    errorprecio: 'error',
                });
            }
            
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({
                    errordescripcion: 'error',
                });
            }
            if (this.state.precio.toString().trim().length == 0) {
                this.setState({
                    errorprecio: 'error',
                });
            }
        }
    }
    onSubmit() {
        this.setState({
            loading: true,
        });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('precio', this.state.precio);
        formdata.append('comision', this.state.comision);
        formdata.append('nota', this.state.nota);
        formdata.append('imagen', this.state.imagen);
        formdata.append('bandera', this.state.bandera);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: '/taller_mecanico/servicio/update',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',    
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
                        this.props.history.goBack();
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
    render() {
        if (this.state.auth) {
            <Redirect to='/login' />
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="card-header-tab card-header">
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                Editar Servicio
                        </div>
                        <div className="btn-actions-pane-right text-capitalize">
                            <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                onClick={this.onBack.bind(this)}
                            >
                                Atras
                            </button>
                        </div>
                    </div>
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <div className="forms-groups">
                                <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{marginTop: -15}}>

                                    <div className='cols-lg-8 cols-md-8 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar Descripcion' 
                                                className={`forms-control ${this.state.errordescripcion}`} 
                                                value={this.state.descripcion}
                                                onChange={this.onChangeDescripcion.bind(this)}
                                            />
                                            <label className="lbls-input">Descripcion</label>
                                        </div>
                                    </div>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='...' 
                                                className={`forms-control ${this.state.errorprecio}`} 
                                                value={this.state.precio}
                                                onChange={this.onChangePrecio.bind(this)}
                                            />
                                            <label className="lbls-input">Precio</label>
                                        </div>
                                    </div>
                                    <div className='cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='...' 
                                                className={`forms-control`} 
                                                value={this.state.comision}
                                                onChange={this.onChangeComision.bind(this)}
                                            />
                                            <label className="lbls-input">Comision</label>
                                        </div>
                                    </div>

                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='...' 
                                                className={`forms-control`} 
                                                value={this.state.nota}
                                                onChange={this.onChangeNota.bind(this)}
                                            />
                                            <label className="lbls-input">Nota</label>
                                        </div>
                                    </div>

                                </div>
                                <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{marginTop: -15, boxSizing: 'border-box',}}>
                                    <div className="avatar-icon-wrapper
                                        avatar-icon-xl btn-hover-shine d-flexs justifys-contents-centers"
                                        style={{boxSizing: 'border-box',}}
                                    >
                                        <div className="avatar-icon rounded mt-2"  style={{boxSizing: 'border-box', border: '1px solid #e8e8e8'}}>
                                            {(this.state.foto == '')?
                                                <img src="/images/default.jpg" alt="Avatar 5"  style={{overflow: 'hidden',}} />:
                                                <img src={this.state.foto} alt="Avatar 5" />
                                            }
                                        </div>
                                    </div>
                                    <div className="avatar-icon-wrapper
                                        avatar-icon-xl btn-hover-shine d-flexs justifys-contents-centers"
                                    >
                                        <input type='file' style={{zIndex: 50}} 
                                            className='forms-control mt-1' 
                                            onChange={this.onChangeFoto.bind(this)}
                                        />
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
            </div>
        );
    }
}

export default withRouter(EditarServicio);
