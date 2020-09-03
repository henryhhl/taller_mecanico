
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs, Pagination, notification, Modal  } from 'antd';
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import web from '../../utils/services';
import { isPermission } from '../../utils/functions';
import permissions from '../../utils/permisions';

class IndexVehiculo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            search: '',
            timeoutSearch: undefined,
            active_search: 'active',
        }
    }
    componentDidMount() {
        this.props.get_link('vehiculo', true);
        this.get_data(1);
    }
    get_data(page = 1) {
        axios.get( web.servidor + '/vehiculo/get_data?page=' + page).then(
            (response) => {
                console.log(response)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculo(response.data.data.data, response.data.vehiculo_pagination, page, response.data.visitasitio);
                        this.props.getvehiculotipo(response.data.vehiculotipo.data, response.data.vehiculotipo_pagination, page, response.data.visitasitio);
                        this.props.getvehiculomarca(response.data.vehiculomarca.data, response.data.vehiculomarca_pagination, page, response.data.visitasitio);
                        this.props.getvehiculomodelo(response.data.vehiculomodelo.data, response.data.vehiculomodelo_pagination, page, response.data.visitasitio);
                        this.props.getvehiculocolor(response.data.vehiculocolor.data, response.data.vehiculocolor_pagination, page, response.data.visitasitio);
                        this.props.getvehiculoyear(response.data.vehiculoyear.data, response.data.vehiculoyear_pagination, page, response.data.visitasitio);
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
            console.log(error);
        } );
    }
    get_vehiculo(page, search) {
        axios.get( web.servidor + '/vehiculo/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculo(response.data.data.data, response.data.pagination, page);
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
    get_vehiculotipo(page, search) {
        axios.get( web.servidor + '/vehiculo_tipo/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculotipo(response.data.data.data, response.data.pagination, page);
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
    get_vehiculo_marca(page, search) {
        axios.get( web.servidor + '/vehiculo_marca/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculomarca(response.data.data.data, response.data.pagination, page);
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
    get_vehiculo_modelo(page, search) {
        axios.get( web.servidor + '/vehiculo_modelo/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculomodelo(response.data.data.data, response.data.pagination, page);
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
    get_color(page, search) {
        axios.get( web.servidor + '/vehiculo_color/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculocolor(response.data.data.data, response.data.pagination, page);
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
    get_year(page, search) {
        axios.get( web.servidor + '/vehiculo_year/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getvehiculoyear(response.data.data.data, response.data.pagination, page);
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
    onAdd() {
        if (this.props.activeKey == 1 ) {
            this.props.history.push( web.serv_link + '/vehiculo/create');
        }
        if (this.props.activeKey == 2 ) {
            this.props.history.push( web.serv_link + '/vehiculo_tipo/create');
        }
        if (this.props.activeKey == 3 ) {
            this.props.history.push( web.serv_link + '/vehiculo_marca/create');
        }
        if (this.props.activeKey == 4 ) {
            this.props.history.push( web.serv_link + '/vehiculo_modelo/create');
        }
        if (this.props.activeKey == 5 ) {
            this.props.history.push( web.serv_link + '/vehiculo_color/create');
        }
        if (this.props.activeKey == 6 ) {
            this.props.history.push( web.serv_link + '/vehiculo_year/create');
        }
    }
    formato(date) {
        let fecha = date.split('-');
        let year = parseInt(fecha[0]);
        let month = (parseInt(fecha[1]) < 10)?'0' + parseInt(fecha[1]):parseInt(fecha[1]);
        let day = (parseInt(fecha[2]) < 10)?'0' + parseInt(fecha[2]):parseInt(fecha[2]);

        return day + '/' + month + '/' + year;
    }
    onEdit(data, event) {
        event.preventDefault();
        if (this.props.activeKey == 1 ) {
            this.props.history.push( web.serv_link + '/vehiculo/editar/' + data.id);
        }
        if (this.props.activeKey == 2 ) {
            this.props.history.push( web.serv_link + '/vehiculo_tipo/editar/' + data.id);
        }
        if (this.props.activeKey == 3 ) {
            this.props.history.push( web.serv_link + '/vehiculo_marca/editar/' + data.id);
        }
        if (this.props.activeKey == 4 ) {
            this.props.history.push( web.serv_link + '/vehiculo_modelo/editar/' + data.id);
        }
        if (this.props.activeKey == 5 ) {
            this.props.history.push( web.serv_link + '/vehiculo_color/editar/' + data.id);
        }
        if (this.props.activeKey == 6 ) {
            this.props.history.push( web.serv_link + '/vehiculo_year/editar/' + data.id);
        }
    }
    onDelete(data) {
        if (this.props.activeKey == 1 ) {
            this.props.onModalActive(data, 'vehiculo');
        }
        if (this.props.activeKey == 2 ) {
            this.props.onModalActive(data, 'vehiculotipo');
        }
        if (this.props.activeKey == 3 ) {
            this.props.onModalActive(data, 'vehiculomarca');
        }
        if (this.props.activeKey == 4 ) {
            this.props.onModalActive(data, 'vehiculomodelo');
        }
        if (this.props.activeKey == 5 ) {
            this.props.onModalActive(data, 'vehiculocolor');
        }
        if (this.props.activeKey == 6 ) {
            this.props.onModalActive(data, 'vehiculoyear');
        }
    }
    onChangePagina(page) {
        if (this.props.activeKey == 1 ) {
            this.get_vehiculo(page, this.state.search);
        }
        if (this.props.activeKey == 2 ) {
            this.get_vehiculotipo(page, this.state.search);
        }
        if (this.props.activeKey == 3 ) {
            this.get_vehiculo_marca(page, this.state.search);
        }
        if (this.props.activeKey == 4 ) {
            this.get_vehiculo_modelo(page, this.state.search);
        }
        if (this.props.activeKey == 5 ) {
            this.get_color(page, this.state.search);
        }
        if (this.props.activeKey == 6 ) {
            this.get_year(page, this.state.search);
        }
    }
    onchangeSearch(event) {
        var search = event.target.value;
        this.setState({
            search: event.target.value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => {
            if (this.props.activeKey == 1 ) {
                this.get_vehiculo(1, search);
            }
            if (this.props.activeKey == 2 ) {
                this.get_vehiculotipo(1, search);
            }
            if (this.props.activeKey == 3 ) {
                this.get_vehiculo_marca(1, search);
            }
            if (this.props.activeKey == 4 ) {
                this.get_vehiculo_modelo(1, search);
            }
            if (this.props.activeKey == 5 ) {
                this.get_color(1, search);
            }
            if (this.props.activeKey == 6 ) {
                this.get_year(1, search);
            }
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    render() {
        var color = this.props.buttoncolor == '' ? 'outline-focus' : this.props.buttoncolor;
        var optioneditar = this.props.buttoncolor == '' ? 'primary' : 'outline-' + this.props.buttoncolor;
        var optiondelete = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;

        let nuevo = this.props.activeKey;
        nuevo = (nuevo == 1) ? 'Nuevo Vehiculo' : (nuevo == 2) ? 'Nuevo Vehiculo Tipo' : (nuevo == 3) ? 'Nueva Marca' : 
                (nuevo == 4) ? 'Nuevo Modelo' : (nuevo == 5) ? 'Nuevo Color' : ' Nuevo Año';
        return (
            <div className="rows">
                <div className="cards" style={{width: '100%', maxWidth: '100%'}}>
                    <div className="card-header-tab card-header mt-4" style={{border: '1px solid transparent'}}>
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal mb-4">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                GESTIONAR VEHICULO
                        </div>
                        <div className="app-header-left mb-4 ml-4">
                            <div className={`search-wrapper ${this.state.active_search}`}>
                                <div className="input-holder">
                                    <input type="text" className="search-input" placeholder="Ingresar Dato..." 
                                        value={this.state.search} onChange={this.onchangeSearch.bind(this)}
                                    />
                                    <button className="search-icon" onClick={ () => this.setState({active_search: 'active'}) }><span></span></button>
                                </div>
                                <button className="close" onClick={ () => this.setState({search: '', active_search: ''}) }></button>
                            </div>      
                        </div>
                        <div className="btn-actions-pane-right text-capitalize mb-4">
                            <button className={"btn-wide btn-outline-2x mr-md-2 btn btn-sm btn-" + color }
                                onClick={this.onAdd.bind(this)}
                            >
                                {nuevo}
                            </button>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <Tabs type="card" activeKey={this.props.activeKey} 
                            onChange={(key) => {this.props.activeKeyVehiculo(key); this.setState({search: ''}); }}
                        >
                            <TabPane style={{width: '100%', maxWidth: '100%'}} tab="VEHICULO" key="1">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Cliente</td>
                                                    <td>Vehiculo</td>
                                                    <td>Placa</td>
                                                    <td>Marca</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculo.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Cliente: </label>
                                                                {data.apellido == null ? data.nombre : data.nombre + ' ' + data.apellido}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Vehiculo: </label>
                                                                {data.vehiculotipo}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Placa: </label>
                                                                    {data.placa}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Marca: </label>
                                                                    {data.marca + ' - ' + data.modelo}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.vehiculoeditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.vehiculodelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.vehiculo.total}
                                            current={this.props.paginate.vehiculo}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="VEHICULO TIPO" key="2">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Descripcion</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculotipo.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.vehiculotipoeditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.vehiculotipodelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.tipo.total}
                                            current={this.props.paginate.tipo}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="MARCA" key="3">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Descripcion</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculomarca.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.marcaeditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.marcadelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.marca.total}
                                            current={this.props.paginate.marca}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="MODELO" key="4">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Marca</td>
                                                    <td>Descripcion</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculomodelo.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Marca: </label>
                                                                {data.marca}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.modeloeditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.modelodelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.modelo.total}
                                            current={this.props.paginate.modelo}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="COLOR" key="5">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Descripcion</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculocolor.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.coloreditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.colordelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.color.total}
                                            current={this.props.paginate.color}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="AÑO" key="6">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Descripcion</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.vehiculoyear.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                {data.descripcion}
                                                            </td>
                                                            <td>
                                                            { isPermission(this.props.permisos_habilitados, permissions.yeareditar) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                                    onClick={this.onEdit.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-edit'></i>
                                                                </button> : null 
                                                            }
                                                            { isPermission(this.props.permisos_habilitados, permissions.yeardelete) ?
                                                                <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optiondelete}
                                                                    onClick={this.onDelete.bind(this, data)}
                                                                >
                                                                    <i className='fa fa-trash'></i>
                                                                </button> : null 
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.year.total}
                                            current={this.props.paginate.year}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

IndexVehiculo.propTypes = {
    vehiculo: PropTypes.array,
    vehiculotipo: PropTypes.array,
    vehiculomarca: PropTypes.array,
    vehiculomodelo: PropTypes.array,
    vehiculocolor: PropTypes.array,
    vehiculoyear: PropTypes.array,

    pagination: PropTypes.object,
    paginate: PropTypes.object,

    activeKey: PropTypes.any,

    buttoncolor: PropTypes.string,
    permisos_habilitados: PropTypes.array,
}

IndexVehiculo.defaultProps = {
    vehiculo: [],
    vehiculotipo: [],
    vehiculomarca: [],
    vehiculomodelo: [],
    vehiculocolor: [],
    vehiculoyear: [],

    activeKey: '1',

    pagination: {
        vehiculo: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        tipo: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        marca: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        modelo: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        color: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        year: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
    },

    paginate: {
        vehiculo: 1,
        tipo: 1,
        marca: 1,
        modelo: 1,
        color: 1,
        year: 1,
    },

    buttoncolor: '',
    permisos_habilitados: [],
}

export default withRouter(IndexVehiculo);
