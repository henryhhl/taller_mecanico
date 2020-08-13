
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

class EditarMecanico extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,
            
            nombre: '',
            apellido: '',
            genero: 'N',
            telefono: '',
            ciudad: '',
            direccion: '',

            imagen: '',
            foto: '',
            bandera: 0,

            errorname: '',
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get('/taller_mecanico/mecanico/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    this.setState({
                        nombre: response.data.data.nombre,
                        apellido: response.data.data.apellido == null ? '' : response.data.data.apellido,
                        telefono: response.data.data.telefono == null ? '' : response.data.data.telefono,
                        ciudad: response.data.data.ciudad == null ? '' : response.data.data.ciudad,
                        direccion: response.data.data.direccion == null ? '' : response.data.data.direccion,
                        genero: response.data.data.genero,
                        imagen: response.data.data.imagen == null ? '' : response.data.data.imagen,
                        foto: response.data.data.imagen == null ? '' : response.data.data.imagen,
                    });
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
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
    onChangeGenero(event) {
        this.setState({
            genero: event.target.value,
        });
    }
    onChangeCiudad(event) {
        this.setState({
            ciudad: event.target.value,
        });
    }
    onChangeDireccion(event) {
        this.setState({
            direccion: event.target.value,
        });
    }
    onChangeTelefono(event) {
        this.setState({
            telefono: event.target.value,
        });
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if ((this.state.nombre.toString().trim().length > 0)) {
            this.onSubmit();
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    errorname: 'error',
                });
            }
        }
    }
    onSubmit() {
        this.setState({
            loading: true,
        });
        var formdata = new FormData();
        formdata.append('nombre', this.state.nombre);
        formdata.append('apellido', this.state.apellido);
        formdata.append('genero', this.state.genero);
        formdata.append('telefono', this.state.telefono);
        formdata.append('ciudad', this.state.ciudad);
        formdata.append('direccion', this.state.direccion);
        formdata.append('bandera', this.state.bandera);
        formdata.append('imagen', this.state.imagen);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: '/taller_mecanico/mecanico/update',
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
                                Editar Mecanico
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

                                    <div className='cols-lg-2 cols-md-2'></div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar Telefono'
                                                className={`forms-control`} value={this.state.telefono}
                                                onChange={this.onChangeTelefono.bind(this)}
                                            />
                                            <label className="lbls-input">Telefono</label>
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <select className='forms-control'
                                                value={this.state.genero}
                                                onChange={this.onChangeGenero.bind(this)}
                                            >
                                                <option value='N'>Ninguno</option>
                                                <option value='F'>Femenino</option>
                                                <option value='M'>Masculino</option>
                                            </select>
                                            <label className="lbls-input">Genero</label>
                                        </div>
                                    </div>

                                    <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar Nombre' 
                                                className={`forms-control ${this.state.errorname}`} 
                                                value={this.state.nombre}
                                                onChange={this.onChangeNombre.bind(this)}
                                            />
                                            <label className="lbls-input">Nombre</label>
                                        </div>
                                    </div>
                                    <div className='cols-lg-8 cols-md-8 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar Apellido' 
                                                className={`forms-control`} 
                                                value={this.state.apellido}
                                                onChange={this.onChangeApellido.bind(this)}
                                            />
                                            <label className="lbls-input">Apellido</label>
                                        </div>
                                    </div>

                                    <div className='cols-lg-2 cols-md-2'></div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar ciudad' 
                                                className={`forms-control`} 
                                                value={this.state.ciudad}
                                                onChange={this.onChangeCiudad.bind(this)}
                                            />
                                            <label className="lbls-input">Ciudad</label>
                                        </div>
                                    </div>
                                    <div className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'>
                                        <div className='inputs-groups'>
                                            <input type='text' placeholder='Ingresar direccion' 
                                                className={`forms-control`} 
                                                value={this.state.direccion}
                                                onChange={this.onChangeDireccion.bind(this)}
                                            />
                                            <label className="lbls-input">Direccion</label>
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

export default withRouter(EditarMecanico);
