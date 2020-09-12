
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';

import { notification, Checkbox, Modal, Card, message, Select } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

import PropTypes from 'prop-types';

class ShowServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: false,

            visible_categoria: false,
            visible_marca: false,

            new_marca: false,
            loading_marca: false,
            descripcion_marca: '',
            error_descripcionmarca: '',

            new_categoria: false,
            loading_categoria: false,
            descripcion_categoria: '',
            error_descripcioncategoria: '',
            
            codigo: '',
            descripcion: '',
            categoria: {
                id: '',
                descripcion: '',
            },
            marca: {
                id: '',
                descripcion: '',
            },
            stockactual: 0,
            stockmin: 0,
            stockmax: 0,

            stocks: {
                actual: 0,
                min: 0,
                max: 0,
                comision: 0,
                costo: 0,
                incremento: 0,
                precio: 0,
                tipo: 'P',
            },

            precio: 0,
            costo: 0,
            incremento: 0,
            tipo: 'P',
            comision: 0,
            nota: '',

            imagen: '',
            foto: '',
            deleteimg: false,
            bandera: 0,
            tipoproducto: false,
            tiposervicio: true,

            array_marca: [],
            array_categoria: [],

            errordescripcion: '',
            errorprecio: '',
            errorcodigo: '',
        }
    }
    componentDidMount() {
        this.props.get_link('almacen', true);
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/servicio/edit/' + this.props.match.params.id).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        
                        var marca = {id: '', descripcion: ''};
                        if (response.data.data.idmarca != null) {
                            marca = {id: response.data.data.idmarca, descripcion: response.data.data.marca,};
                        }

                        var categoria = {id: '', descripcion: ''};
                        if (response.data.data.idcategoria != null) {
                            categoria = {id: response.data.data.idcategoria, descripcion: response.data.data.categoria,};
                        }

                        var stocks = {
                            actual: response.data.data.stockactual, 
                            min: response.data.data.stockmin, 
                            max: response.data.data.stockmax,
                            comision: response.data.data.comision,
                            costo: response.data.data.costo,
                            incremento: response.data.data.incremento,
                            precio: response.data.data.precio,
                            tipo: response.data.data.tipoincremento,
                        };

                        this.props.loadingservice(false, response.data.visitasitio);
                        
                        this.setState({
                            stocks: stocks,

                            array_marca: response.data.marca,
                            array_categoria: response.data.categoria,

                            tiposervicio: response.data.data.tipo == 'S' ? true: false,
                            tipoproducto: response.data.data.tipo == 'P' ? true: false,
                            descripcion: response.data.data.descripcion,
                            categoria: categoria,
                            marca: marca,
                            codigo: response.data.data.codigo == null ? '' : response.data.data.codigo,
                            stockactual: response.data.data.stockactual,
                            stockmin: response.data.data.stockmin,
                            stockmax: response.data.data.stockmax,
                            comision: response.data.data.comision,
                            costo: response.data.data.costo,
                            tipo: response.data.data.tipoincremento,
                            incremento: response.data.data.incremento,
                            precio: response.data.data.precio,
                            nota: response.data.data.nota == null ? '' : response.data.data.nota,
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
    onChangeTipoServicio() {
        if (this.state.tiposervicio) {
            this.setState({
                tiposervicio: false, tipoproducto: true, 
                comision: 0,
                stockactual: this.state.stocks.actual, 
                stockmin: this.state.stocks.min, 
                stockmax: this.state.stocks.max,
                costo: this.state.stocks.costo,
                precio: this.state.stocks.precio,
                incremento: this.state.stocks.incremento,
            });
        }else {
            this.setState({
                tiposervicio: true, tipoproducto: false, 
                incremento: 0, costo: 0,
                stockactual: 0, stockmin: 0, stockmax: 0,
                comision: this.state.stocks.comision,
                precio: this.state.stocks.precio,
            });
        }
    }
    onChangeTipoProducto() {
        if (this.state.tipoproducto) {
            this.setState({
                tiposervicio: true, tipoproducto: false, 
                incremento: 0, costo: 0,
                stockactual: 0, stockmin: 0, stockmax: 0,
                comision: this.state.stocks.comision,
                precio: this.state.stocks.precio,
            });
        }else {
            this.setState(
                {tiposervicio: false, tipoproducto: true, 
                comision: 0,
                stockactual: this.state.stocks.actual, 
                stockmin: this.state.stocks.min, 
                stockmax: this.state.stocks.max,
                costo: this.state.stocks.costo,
                precio: this.state.stocks.precio,
                incremento: this.state.stocks.incremento,
                tipo: this.state.stocks.tipo,
            });
        }
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event.target.value,
            errordescripcion: '',
        });
    }
    onChangePrecio(event) {
        var precio = event.target.value == '' ? 0 : event.target.value;
        if (!isNaN(precio)) {
            if (precio * 1 >= 0) {
                var lista = precio.toString().split('.');
                if (lista.length > 1) {
                    if (lista[1].length < 3) {
                        this.setState({precio: precio, incremento: 0, });
                    }else {
                        message.warning('SOLO SE PERMITE DOS DECIMALES.');
                    }
                }else {
                    this.setState({precio: precio, incremento: 0, });
                }
            }
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onChangeComision(event) {
        var comision = event.target.value == '' ? 0 : event.target.value;
        if (!isNaN(comision)) {
            if (parseInt(comision) <= 100 && parseInt(comision) >= 0) {
                this.setState({ comision: parseInt(comision), });
            }
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onChangeCosto(event) {
        var costo = event.target.value == '' ? 0 : event.target.value;
        if (!isNaN(costo)) {
            if (costo * 1 >= 0) {
                if (this.state.tipo == 'P') {
                    var lista = costo.toString().split('.');
                    if (lista.length > 1) {
                        if (lista[1].length < 3) {
                            var precio = parseFloat( costo * 1 + (costo * this.state.incremento / 100) ).toFixed(2);
                            this.setState({costo: costo, precio: precio, });
                        }else {
                            message.warning('SOLO SE PERMITE DOS DECIMALES.');
                        }
                    }else {
                        var precio = parseFloat( costo * 1 + (costo * this.state.incremento / 100) ).toFixed(2);
                        this.setState({costo: costo, precio: precio, });
                    }
                }else {
                    var lista = costo.toString().split('.');
                    if (lista.length > 1) {
                        if (lista[1].length < 3) {
                            var precio = parseFloat( costo * 1 + this.state.incremento * 1 ).toFixed(2);
                            this.setState({costo: costo, precio: precio, });
                        }else {
                            message.warning('SOLO SE PERMITE DOS DECIMALES.');
                        }
                    }else {
                        var precio = parseFloat( costo * 1 + this.state.incremento * 1 ).toFixed(2);
                        this.setState({costo: costo, precio: precio, });
                    }
                }
            }
        }else {
            message.warning('SOLO SE PERMITE NUMERO.');
        }
    }
    onChangeIncremento(event) {
        var incremento = event.target.value == '' ? 0 : event.target.value;
        if (this.state.tipo == 'P') {
            if (!isNaN(incremento)) {
                if (incremento >= 0) {
                    var precio = parseFloat( this.state.costo * 1 + (this.state.costo * incremento / 100) );
                    this.setState({
                        incremento: parseInt(incremento),
                        precio: precio.toFixed(2),
                    });
                }
            }else {
                message.warning('SOLO SE PERMITE NUMERO.');
            }
        }
        if (this.state.tipo == 'F') {
            if (!isNaN(incremento)) {
                if (incremento >= 0) {
                    var lista = incremento.toString().split('.');
                    if (lista.length > 1) {
                        if (lista[1].length < 3) {
                            var precio = parseFloat( this.state.costo * 1 + incremento * 1 ).toFixed(2);
                            this.setState({incremento: incremento, precio: precio, });
                        }else {
                            message.warning('SOLO SE PERMITE DOS DECIMALES.');
                        }
                    }else {
                        var precio = parseFloat( this.state.costo * 1 + incremento * 1 ).toFixed(2);
                        this.setState({incremento: incremento, precio: precio, });
                    }
                }
            }else {
                message.warning('SOLO SE PERMITE NUMERO.');
            }
        }
    }
    onBack() {
        this.props.history.goBack();
    }
    onValidar() {
        if ((this.state.descripcion.toString().trim().length > 0) &&
            (this.state.precio.toString().length > 0)) {

            if (parseFloat(this.state.precio) > 0) {
                this.onSesion(1);
            }else {
                this.setState({ errorprecio: 'error', });
                notification.warning({
                    message: 'WARNING',
                    description: 'PRECIO INCORRECTO, DEBE SER MAYOR A 0',
                });
            }
            
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({ errordescripcion: 'error', });
            }
            if (this.state.precio.toString().trim().length == 0) {
                this.setState({ errorprecio: 'error', });
            }
            notification.error({
                message: 'ERROR',
                description: 'FAVOR DE LLENAR LOS CAMPOS REQUERIDOS.',
            });
        }
    }
    onSesion(bandera) {
        if (bandera == 1) this.setState({ loading: true, });
        axios.get( web.servidor + '/home/sesion')
        .then( response => {
            if (response.data.response == 1) {
                if (response.data.sesion) {
                    if (bandera == 2) this.setState({visible_marca: false,});
                    if (bandera == 3) this.setState({visible_categoria: false,});
                    this.props.logout();
                    return;
                }
                if (bandera == 1) this.onSubmit();
                if (bandera == 2) this.onSubmitMarca();
                if (bandera == 3) this.onSubmitCategoria();
                
                return;
            }
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO. INTENTAR NUEVAMENTE.',
            });
            this.setState({ loading: false, });
            if (bandera == 2) this.setState({loading_marca: false, });
            if (bandera == 3) this.setState({loading_categoria: false,});
        } ).catch( error => {
            this.setState({ loading: false, });
            if (bandera == 2) this.setState({loading_marca: false, });
            if (bandera == 3) this.setState({loading_categoria: false,});
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        });
    }
    onSubmit() {
        this.setState({ loading: true, });
        var formdata = new FormData();
        formdata.append('tipo', this.state.tiposervicio ? 'S' : 'P');
        formdata.append('codigo', this.state.codigo);
        formdata.append('descripcion', this.state.descripcion);
        formdata.append('idcategoria', this.state.categoria.id);
        formdata.append('idmarca', this.state.marca.id);
        formdata.append('stockactual', this.state.stockactual);
        formdata.append('stockmin', this.state.stockmin);
        formdata.append('stockmax', this.state.stockmax);
        formdata.append('comision', this.state.comision);
        formdata.append('costo', this.state.costo);
        formdata.append('tipoincremento', this.state.tipo);
        formdata.append('incremento', this.state.incremento);
        formdata.append('precio', this.state.precio);
        formdata.append('nota', this.state.nota);
        formdata.append('imagen', this.state.imagen);
        formdata.append('foto', this.state.foto);
        formdata.append('bandera', this.state.bandera);
        formdata.append('id', this.props.match.params.id);

        axios(
            {
                method: 'post',
                url: web.servidor + '/servicio/update',
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
                            description: 'SERVICIO/PRODUCTO ACTUALIZADO EXITOSAMENTE',
                        });
                        this.props.history.goBack();
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'WARNING',
                            description: 'LA DESCRIPCION DEL SERVICIO/PRODUCTO YA EXISTE. INTENTAR NUEVAMENTE.',
                        });
                        this.setState({
                            loading: false, errordescripcion: 'error',
                        });
                    }
                    if (response.data.response == -2) {
                        notification.warning({
                            message: 'WARNING',
                            description: 'EL CODIGO DEL SERVICIO/PRODUCTO YA EXISTE. INTENTAR NUEVAMENTE.',
                        });
                        this.setState({ loading: false, errorcodigo: 'error', });
                    }
                }
                if (response.status == 401) {
                    this.setState({ auth: true, });
                }
            }
        ).catch(
            error => {
                console.log(error)
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                });
                this.setState({ loading: false, });
                if (error.response.status == 401) {
                    this.setState({ auth: true, });
                }
            }
        );
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
    onModalCategoria() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_categoria) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_categoria}
                onCancel={() => {
                    if (!this.state.new_categoria) {
                        this.setState({
                            visible_categoria: false, new_categoria: false,
                            loading_categoria: false, descripcion_categoria: '',
                        })
                    }
                }}
                footer={null}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 100, }}
                width={450}
            >
                <div className="forms-groups">
                    {(!this.state.new_categoria) ?
                        <Card title="CATEGORIA" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
                                    onClick={() => this.setState({new_categoria: true,})}
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
                                {this.state.array_categoria.map(
                                    (data, key) => (
                                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                            style={{ padding: 0, }} key={key}
                                            onClick={() => this.setState({categoria: data, visible_categoria: false, })}
                                        >
                                            <Card.Grid hoverable={false} 
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 13,
                                                    height: 18, lineHeight: 0, textAlign: 'center',
                                                    background: (this.state.categoria.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (this.state.categoria.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (this.state.categoria.id == data.id) ? 'bold' : '400',
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
                                        NUEVA CATEGORIA
                                </div>
                            </div>
                            {(!this.state.loading_categoria) ?
                                <div className='forms-groups'>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 mb-4' style={{ marginTop: -45 }}>
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
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_descripcioncategoria}`}
                                                    value={this.state.descripcion_categoria}
                                                    onChange={(event) => 
                                                        this.setState({descripcion_categoria: event.target.value, error_descripcioncategoria: '', }) 
                                                    }
                                                />
                                                {this.state.descripcion_categoria.toString().length == 0 ? null : 
                                                    <i className='fa fa-close delete_icon'
                                                        onClick={() => this.setState({ descripcion_categoria: '', }) }
                                                    ></i> 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='forms-groups txts-center mt-4'>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                            onClick={this.onValidarCategoria.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                            onClick={() => this.setState({new_categoria: false, descripcion_categoria: '', error_descripcioncategoria: '', })}
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
    onModalMarca() {
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colornew = this.props.buttoncolor == '' ? 'secondary' : this.props.buttoncolor;
        return (
            <Modal
                title={(!this.state.new_marca) ? <div>&nbsp;</div> : null}
                visible={this.state.visible_marca}
                onCancel={() => {
                    if (!this.state.new_marca) {
                        this.setState({
                            visible_marca: false, new_marca: false,
                            loading_marca: false, descripcion_marca: '',
                        })
                    }
                }}
                footer={null}
                bodyStyle={{padding: 0, paddingTop: 5, paddingBottom: 5,}}
                style={{ top: 100, }}
                width={450}
            >
                <div className="forms-groups">
                    {(!this.state.new_marca) ?
                        <Card title="MARCA" 
                            bodyStyle={{ padding: 0, }} style={{position: 'relative', top: -9,}}
                            headStyle={{color: 'white', background: '#1890ff', fontSize: 14, fontWeight: 'bold'}}
                            extra={
                                <button className={"btn-hover-shine btn btn-" + colornew}
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
                                            onClick={() => this.setState({marca: data, visible_marca: false, })}
                                        >
                                            <Card.Grid hoverable={false} 
                                                style={{ cursor: 'pointer', width: '100%', fontSize: 13,
                                                    height: 18, lineHeight: 0, textAlign: 'center',
                                                    background: (this.state.marca.id == data.id) ? '#e0f3ff' : 'white',
                                                    color: (this.state.marca.id == data.id) ? '#3f6ad8' : 'rgba(0, 0, 0, 0.65)',
                                                    fontWeight: (this.state.marca.id == data.id) ? 'bold' : '400',
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
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' placeholder='Ingresar Descripcion'
                                                    style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                    className={`forms-control ${this.state.error_descripcionmarca}`}
                                                    value={this.state.descripcion_marca}
                                                    onChange={(event) => 
                                                        this.setState({descripcion_marca: event.target.value, error_descripcionmarca: '', }) 
                                                    }
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
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colorsuccess}
                                            onClick={this.onValidarMarca.bind(this)}
                                        >
                                            Aceptar
                                        </button>
                                        <button className={"mb-2 mr-2 btn-hover-shine btn btn-" + colordanger}
                                            onClick={() => this.setState({new_marca: false, descripcion_marca: '', error_descripcionmarca: '', })}
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
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({ error_descripcionmarca: 'error', });
            return;
        }
        this.setState({ loading_marca: true, });
        this.onSesion(2);
    }
    onValidarCategoria() {
        if (this.state.descripcion_categoria.toString().trim().length == 0) {
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'CAMPO DESCRIPCION REQUERIDO.',
            });
            this.setState({error_descripcioncategoria: 'error', });
            return;
        }
        this.setState({ loading_categoria: true, });
        this.onSesion(3)
    }
    onSubmitCategoria() {
        this.setState({ loading_categoria: true, });
        var formdata = new FormData();
        formdata.append('descripcion', this.state.descripcion_categoria);
        axios(
            {
                method: 'post',
                url: web.servidor + '/categoria/store',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(  response => {
            if (response.status == 200) {
                if (response.data.response == 1) {
                    notification.success({
                        message: 'SUCCESS',
                        description: 'CATEGORIA REGISTRADO EXITOSAMENTE.',
                    });
                    this.setState({
                        visible_categoria: false, new_categoria: false,
                        loading_categoria: false, descripcion_categoria: '',
                        categoria: response.data.data,
                        array_categoria: response.data.categoria,
                    });
                    return;
                }
                if (response.data.response == -1) {
                    notification.warning({
                        message: 'ADVERTENCIA',
                        description: 'NO SE PERMITE CATEGORIA REPETIDO.',
                    });
                    this.setState({ error_descripcioncategoria: 'error', });
                }
            }
            this.setState({ loading_categoria: false, });
        } ).catch( error => {
            this.setState({ loading_categoria: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
            if (error.response.status == 401) {
                this.setState({ auth: true, });
            }
        } );
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
                            visible_marca: false, new_marca: false,
                            loading_marca: false, descripcion_marca: '',
                            marca: response.data.data,
                            array_marca: response.data.marca,
                        });
                        return;
                    }
                    if (response.data.response == -1) {
                        notification.warning({
                            message: 'ADVERTENCIA',
                            description: 'NO SE PERMITE MARCA REPETIDO.',
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
        var colorsuccess = this.props.buttoncolor == '' ? 'primary' : this.props.buttoncolor;
        var colordanger = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        var colorback = this.props.buttoncolor == '' ? 'focus' : this.props.buttoncolor;
        return (
            <div className="rows">
                {this.onModalCategoria()}
                {this.onModalMarca()}
                <div className="cards">
                    {(!this.state.loading)?
                        <div className='forms-groups'>
                            <Card
                                style={{ width: '100%', minWidth: '100%', }}
                                title="DETALLE PRODUCTO O SERVICIO"
                                headStyle={{fontSize: 14, }} bodyStyle={{padding: 4, paddingTop: 0, }}
                                extra={ 
                                    <button className={"btn-wide btn-outline-2x mr-md-2 btn-sm btn btn-outline-" + colorback}
                                        onClick={this.onBack.bind(this)}
                                    >
                                        Atras
                                    </button> 
                                }
                            >  
                                <div className='forms-groups' style={{background: '#e8e8e8', paddingBottom: 8, }}>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -10, padding: 0,}}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4'></div>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'ALMACEN'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -20, padding: 0,}}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4'></div>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' 
                                                        className={`forms-control`}
                                                        value={'Servicio'} readOnly
                                                        style={{paddingLeft: 25, cursor: 'pointer',}}
                                                        onClick={this.onChangeTipoServicio.bind(this)}
                                                    />
                                                    <Checkbox style={{position: 'absolute', left: 5, top: 10,}}
                                                        checked={this.state.tiposervicio} 
                                                        onChange={this.onChangeTipoServicio.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12'>
                                                <div className='inputs-groups'>
                                                    <input type='text' 
                                                        className={`forms-control`}
                                                        value={'Producto'} readOnly
                                                        style={{paddingLeft: 25, cursor: 'pointer',}}
                                                        onClick={this.onChangeTipoProducto.bind(this)}
                                                    />
                                                    <Checkbox style={{position: 'absolute', left: 5, top: 10,}}
                                                        checked={this.state.tipoproducto} 
                                                        onChange={this.onChangeTipoProducto.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: 10, padding: 0, }}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Codigo'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='INGRESAR CODIGO'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control ${this.state.errorcodigo}`}
                                                        value={this.state.codigo}
                                                        onChange={(event) => this.setState({codigo: event.target.value, errorcodigo: '', })}
                                                    />
                                                    {this.state.codigo.toString().length == 0 ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ codigo: '', }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Descripcion'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
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
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: 10, padding: 0, }}>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Categoria'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR CATEGORIA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer', }}
                                                        className={`forms-control`} readOnly
                                                        value={this.state.categoria.descripcion}
                                                        onClick={ () => this.setState({ visible_categoria: true, }) }
                                                    />
                                                    {this.state.categoria.id == '' ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ categoria: {id: '', descripcion: ''}, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Marca'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder='SELECCIONAR MARCA'
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, cursor: 'pointer', }}
                                                        className={`forms-control`} readOnly
                                                        value={this.state.marca.descripcion}
                                                        onClick={ () => this.setState({ visible_marca: true, }) }
                                                    />
                                                    {this.state.marca.id == '' ? null : 
                                                        <i className='fa fa-close delete_icon'
                                                            onClick={() => this.setState({ marca: {id: '', descripcion: ''}, }) }
                                                        ></i> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: 0,}}>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2'></div>
                                        <div className='cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12' style={{padding: 0}}>
                                            <div className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Imagen'}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12' style={{paddingTop: 0,}}>
                                                <div className='inputs-groups'>
                                                    <input type='file' placeholder='' id='img-img'
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

                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -10, padding: 0,}}>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4'></div>
                                        <div className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12'>
                                            <div className='inputs-groups'>
                                                <input type='text' readOnly
                                                    className={`forms-control title_form ${this.props.buttoncolor}`} value={'STOCK'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: 10, padding: 0, }}>
                                        <div className='cols-lg-3 cols-md-3 cols-sm-3'></div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Actual'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Mínimo'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Máximo'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -5, padding: 0, }}>
                                        <div className='cols-lg-3 cols-md-3 cols-sm-3'></div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.tiposervicio ? '#e8e8e8' : 'white'
                                                        }}
                                                        className={`forms-control`} maxLength='10'
                                                        value={this.state.stockactual}
                                                        disabled={ this.state.tiposervicio ? true : false }
                                                        onChange={ (event) => {
                                                            var stockactual = event.target.value == '' ? 0 : event.target.value;
                                                            if (!isNaN(stockactual)) {
                                                                if (parseInt(stockactual) >= 0) {
                                                                    this.setState({stockactual: parseInt(stockactual),});
                                                                    return;
                                                                }
                                                            }
                                                            message.warning('SOLO SE PERMITE NUMERO.');
                                                        }}
                                                    />
                                                    {this.state.stockactual == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ stockactual: 0, }) }
                                                        ></i> 
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockactual) >= 0) {
                                                                    this.setState({ stockactual: parseInt(this.state.stockactual) + 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockactual) > 0) {
                                                                    this.setState({ stockactual: parseInt(this.state.stockactual) - 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.tiposervicio ? '#e8e8e8' : 'white'
                                                        }}
                                                        className={`forms-control`} maxLength='10'
                                                        value={this.state.stockmin}
                                                        disabled={ this.state.tiposervicio ? true : false }
                                                        onChange={ (event) => {
                                                            var stockmin = event.target.value == '' ? 0 : event.target.value;
                                                            if (!isNaN(stockmin)) {
                                                                if (parseInt(stockmin) >= 0) {
                                                                    this.setState({stockmin: parseInt(stockmin),});
                                                                    return;
                                                                }
                                                            }
                                                            message.warning('SOLO SE PERMITE NUMERO.');
                                                        }}
                                                    />
                                                    {this.state.stockmin == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ stockmin: 0, }) }
                                                        ></i> 
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockmin) >= 0) {
                                                                    this.setState({ stockmin: parseInt(this.state.stockmin) + 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockmin) > 0) {
                                                                    this.setState({ stockmin: parseInt(this.state.stockmin) - 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.tiposervicio ? '#e8e8e8' : 'white'
                                                        }}
                                                        className={`forms-control`} maxLength='10'
                                                        value={this.state.stockmax}
                                                        disabled={ this.state.tiposervicio ? true : false }
                                                        onChange={ (event) => {
                                                            var stockmax = event.target.value == '' ? 0 : event.target.value;
                                                            if (!isNaN(stockmax)) {
                                                                if (parseInt(stockmax) >= 0) {
                                                                    this.setState({stockmax: parseInt(stockmax),});
                                                                    return;
                                                                }
                                                            }
                                                            message.warning('SOLO SE PERMITE NUMERO.');
                                                        }}
                                                    />
                                                    {this.state.stockmax == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ stockmax: 0, }) }
                                                        ></i> 
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockmax) >= 0) {
                                                                    this.setState({ stockmax: parseInt(this.state.stockmax) + 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                    {this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.stockmax) > 0) {
                                                                    this.setState({ stockmax: parseInt(this.state.stockmax) - 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: 10, padding: 0, }}>
                                        <div className='cols-lg-1 cols-md-1 cols-sm-1'></div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Comisión'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Costo'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Tipo'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Incremento'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' readOnly
                                                        className={`forms-control title_form ${this.props.buttoncolor}`} value={'Precio'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{marginTop: -5, padding: 0, }}>
                                        <div className='cols-lg-1 cols-md-1 cols-sm-1'></div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.tiposervicio ? 'white' : '#e8e8e8',
                                                        }}
                                                        className={`forms-control`}
                                                        value={this.state.comision}
                                                        disabled={ this.state.tiposervicio ? false : true }
                                                        onChange={this.onChangeComision.bind(this)}
                                                    />
                                                    {this.state.comision == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ comision: 0, }) }
                                                        ></i> 
                                                    }
                                                    {!this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={ () => {
                                                                if (parseInt(this.state.comision) >= 0 && parseInt(this.state.comision) < 100) {
                                                                    this.setState({ comision: parseInt(this.state.comision) + 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                    {!this.state.tiposervicio ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.comision) > 0) {
                                                                    this.setState({ comision: parseInt(this.state.comision) - 1, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.tipoproducto ? 'white' : '#e8e8e8',
                                                        }}
                                                        className={`forms-control`}
                                                        value={this.state.costo}
                                                        disabled={ this.state.tipoproducto ? false : true }
                                                        onChange={this.onChangeCosto.bind(this)}
                                                    />
                                                    {this.state.costo == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ incremento: 0, precio: 0, costo: 0, }) }
                                                        ></i> 
                                                    }
                                                    {!this.state.tipoproducto ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={ () => {
                                                                var array = this.state.costo.toString().split('.');
                                                                var costo = parseInt(array[0]) + 1;
                                                                costo = array.length > 1 ? costo + '.' + array[1] : costo;
                                                                var precio = 0;
                                                                if (this.state.tipo == 'P') {
                                                                    precio = parseFloat( costo * 1 + (costo * this.state.incremento / 100) ).toFixed(2);
                                                                }else {
                                                                    precio = parseFloat( costo * 1 + this.state.incremento * 1 ).toFixed(2);
                                                                }
                                                                this.setState({ costo: costo, precio: precio, });
                                                            }}
                                                        ></i>
                                                    }
                                                    {!this.state.tipoproducto ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (this.state.costo >= 1) {
                                                                    var array = this.state.costo.toString().split('.');
                                                                    var costo = parseInt(array[0]) - 1;
                                                                    costo = array.length > 1 ? costo + '.' + array[1] : costo;
                                                                    var precio = 0;
                                                                    if (this.state.tipo == 'P') {
                                                                        precio = parseFloat( costo * 1 + (costo * this.state.incremento / 100) ).toFixed(2);
                                                                    }else {
                                                                        precio = parseFloat( costo * 1 + this.state.incremento * 1 ).toFixed(2);
                                                                    }
                                                                    this.setState({ costo: costo, precio: precio, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <Select
                                                        style={{ width: '100%', minWidth: '100%', }}
                                                        value={this.state.tipo} className={'hg_40'}
                                                        onChange={(value) => this.setState({tipo: value, incremento: 0, precio: this.state.costo, })}
                                                        disabled={ this.state.tipoproducto ? false : true }
                                                    >
                                                        <Select.Option value='P'>Porcentaje</Select.Option>
                                                        <Select.Option value='F'>Fijo</Select.Option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24,
                                                            background: this.state.costo > 0 ? 'white': '#e8e8e8',
                                                        }}
                                                        className={`forms-control`}
                                                        value={this.state.incremento}
                                                        onChange={this.onChangeIncremento.bind(this)}
                                                        disabled={ this.state.costo > 0 && this.state.tipoproducto ? false : true }
                                                    />
                                                    {this.state.incremento == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ incremento: 0, precio: this.state.costo, }) }
                                                        ></i> 
                                                    }
                                                    {this.state.costo == 0 ? null : 
                                                        <i className='fa fa-angle-up blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={ () => {
                                                                if (parseInt(this.state.incremento) >= 0) {
                                                                    var array = this.state.incremento.toString().split('.');
                                                                    var incremento = parseInt(array[0]) + 1;
                                                                    incremento = array.length > 1 ? incremento + '.' + array[1] : incremento;
                                                                    var precio = 0;
                                                                    if (this.state.tipo == 'P') {
                                                                        precio = parseFloat( this.state.costo * 1 + (this.state.costo * incremento / 100) ).toFixed(2);
                                                                    }else {
                                                                        precio = parseFloat( this.state.costo * 1 + incremento * 1 ).toFixed(2);
                                                                    }
                                                                    this.setState({ incremento: incremento, precio: precio, });
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                    {this.state.costo == 0 ? null : 
                                                        <i className='fa fa-angle-down blue_hover' 
                                                            style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                                padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                            }}
                                                            onClick={() => {
                                                                if (parseInt(this.state.incremento) > 0) {
                                                                    if (this.state.tipo == 'P') {
                                                                        var array = this.state.incremento.toString().split('.');
                                                                        var incremento = parseInt(array[0]) - 1;
                                                                        incremento = array.length > 1 ? incremento + '.' + array[1] : incremento;
                                                                        var precio = 0;
                                                                        if (this.state.tipo == 'P') {
                                                                            precio = parseFloat( this.state.costo * 1 + (this.state.costo * incremento / 100) ).toFixed(2);
                                                                        }else {
                                                                            precio = parseFloat( this.state.costo * 1 + incremento * 1 ).toFixed(2);
                                                                        }
                                                                        this.setState({ incremento: incremento, precio: precio, });
                                                                    }
                                                                }
                                                            }}
                                                        ></i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12' style={{padding: 0,}}>
                                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' style={{paddingTop: 5,}}>
                                                <div className='inputs-groups'>
                                                    <input type='text' placeholder=''
                                                        style={{ textAlign: 'left', paddingLeft: 10, paddingRight: 24, }}
                                                        className={`forms-control ${this.state.errorprecio}`}
                                                        value={this.state.precio}
                                                        onChange={this.onChangePrecio.bind(this)}
                                                    />
                                                    {this.state.precio == 0 ? null : 
                                                        <i className='fa fa-close delete_icon' style={{right: 23, }}
                                                            onClick={() => this.setState({ precio: 0, incremento: 0, }) }
                                                        ></i> 
                                                    }
                                                    <i className='fa fa-angle-up blue_hover' 
                                                        style={{fontSize: 14, position: 'absolute', top: 3, right: 5, cursor: 'pointer',
                                                            padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                        }}
                                                        onClick={ () => {
                                                            var array = this.state.precio.toString().split('.');
                                                            var precio = parseInt(array[0]) + 1;
                                                            precio = array.length > 1 ? precio + '.' + array[1] : precio;
                                                            this.setState({ precio: precio, incremento: 0, });
                                                        }}
                                                    ></i>
                                                    <i className='fa fa-angle-down blue_hover' 
                                                        style={{fontSize: 14, position: 'absolute', bottom: 3, right: 5, cursor: 'pointer',
                                                            padding: 0, paddingLeft: 2, paddingRight: 2, 
                                                        }}
                                                        onClick={() => {
                                                            if (this.state.precio >= 1) {
                                                                var array = this.state.precio.toString().split('.');
                                                                var precio = parseInt(array[0]) - 1;
                                                                precio = array.length > 1 ? precio + '.' + array[1] : precio;
                                                                this.setState({ precio: precio, incremento: 0, });
                                                            }
                                                        }}
                                                    ></i>
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

ShowServicio.propTypes = {
    ventacreate: PropTypes.number,
    buttoncolor: PropTypes.string,
}

ShowServicio.defaultProps = {
    ventacreate: 0,
    buttoncolor: '',
}

export default withRouter(ShowServicio);
