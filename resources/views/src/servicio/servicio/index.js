
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import { Tabs, Pagination, notification  } from 'antd';
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import web from '../../utils/services';

class IndexServicio extends Component {

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
        this.props.get_link('almacen');
        this.get_data(1);
    }
    get_data(page) {
        axios.get( web.servidor + '/servicio/get_data?page=' + page).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getservicio(response.data.data.data, response.data.pagination, page);
                        this.props.getcategoria(response.data.categoria.data, response.data.categoria_pagination, page);
                        this.props.getarticulo(response.data.articulo.data, response.data.articulo_pagination, page);
                    }
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
    get_servico(page, search) {
        axios.get( web.servidor + '/servicio/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data);
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getservicio(response.data.data.data, response.data.pagination, page);
                    }
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
    get_categoria(page, search) {
        axios.get( web.servidor + '/categoria/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getcategoria(response.data.data.data, response.data.pagination, page);
                    }
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
    get_articulo(page, search) {
        axios.get( web.servidor + '/articulo/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getarticulo(response.data.data.data, response.data.pagination, page);
                    }
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
    onAdd() {
        if (this.props.activeKey == 1 ) {
            this.props.history.push( web.serv_link + '/almacen/create');
        }
        if (this.props.activeKey == 2 ) {
            this.props.history.push( web.serv_link + '/categoria/create');
        }
        if (this.props.activeKey == 3 ) {
            this.props.history.push( web.serv_link + '/articulo/create');
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
            this.props.history.push( web.serv_link + '/almacen/editar/' + data.id);
        }
        if (this.props.activeKey == 2 ) {
            this.props.history.push( web.serv_link + '/categoria/editar/' + data.id);
        }
        if (this.props.activeKey == 3 ) {
            this.props.history.push( web.serv_link + '/articulo/editar/' + data.id);
        }
    }
    onDelete(data) {
        if (this.props.activeKey == 1 ) {
            this.props.onModalActive(data, 'servicio');
        }
        if (this.props.activeKey == 2 ) {
            this.props.onModalActive(data, 'categoria');
        }
        if (this.props.activeKey == 3 ) {
            this.props.onModalActive(data, 'articulo');
        }
    }
    onChangePagina(page) {
        if (this.props.activeKey == 1 ) {
            this.get_servico(page, this.state.search);
        }
        if (this.props.activeKey == 2 ) {
            this.get_categoria(page, this.state.search);
        }
        if (this.props.activeKey == 3 ) {
            this.get_articulo(page, this.state.search);
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
                this.get_servico(1, search);
            }
            if (this.props.activeKey == 2 ) {
                this.get_categoria(1, search);
            }
            if (this.props.activeKey == 3 ) {
                this.get_articulo(1, search);
            }
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    render() {
        let nuevo = this.props.activeKey;
        nuevo = (nuevo == 1) ? 'Nuevo Producto o Servicio' : (nuevo == 2) ? 'Nueva Categoria' : 'Nuevo Articulo';

        return (
            <div className="rows">
                <div className="cards">
                    <div className="card-header-tab card-header mt-4">
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal mb-4">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                ALMACEN
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
                            <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                onClick={this.onAdd.bind(this)}
                            >
                                {nuevo}
                            </button>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <Tabs type="card" activeKey={this.props.activeKey} 
                            onChange={(key) => { this.props.activeKeyAlmacen(key); this.setState({ search: '', }); }}
                        >
                            <TabPane style={{width: '100%', maxWidth: '100%'}} tab="PRODUCTO Y SERVICIO" key="1">
                                <div className="forms-groups">
                                    <div className="tabless">
                                        <table className="tables-respons">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Descripcion</td>
                                                    <td>Precio</td>
                                                    <td>Comision</td>
                                                    <td>Opcion</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.servicio.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                    {data.descripcion} &nbsp;
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Precio: </label>
                                                                    {data.precio}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Comision: </label>
                                                                {data.comision + '%'}
                                                            </td>
                                                            <td>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-primary"
                                                                onClick={this.onEdit.bind(this, data)}
                                                            >
                                                                <i className='fa fa-edit'></i>
                                                            </button>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-danger"
                                                                onClick={this.onDelete.bind(this, data)}
                                                            >
                                                                <i className='fa fa-trash'></i>
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.producto.total}
                                            current={this.props.paginate.producto}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane style={{width: '100%', maxWidth: '100%'}} tab="CATEGORIA" key="2">
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
                                                {this.props.categoria.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                    {data.descripcion} &nbsp;
                                                            </td>
                                                            <td>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-primary"
                                                                onClick={this.onEdit.bind(this, data)}
                                                            >
                                                                <i className='fa fa-edit'></i>
                                                            </button>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-danger"
                                                                onClick={this.onDelete.bind(this, data)}
                                                            >
                                                                <i className='fa fa-trash'></i>
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.categoria.total}
                                            current={this.props.paginate.categoria}
                                            pageSize={10}
                                            showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                            style={{ textAlign: 'right', paddingRight: 20, }}
                                            //size="small"
                                            onChange={this.onChangePagina.bind(this)}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane style={{width: '100%', maxWidth: '100%'}} tab="ARTICULO" key="3">
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
                                                {this.props.articulo.map(
                                                    (data, key) => (
                                                        <tr key={key}>
                                                            <td>
                                                                <label className='cols_show'>ID: </label>
                                                                {data.id}
                                                            </td>
                                                            <td>
                                                                <label className='cols_show'>Descripcion: </label>
                                                                    {data.descripcion} &nbsp;
                                                            </td>
                                                            <td>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-primary"
                                                                onClick={this.onEdit.bind(this, data)}
                                                            >
                                                                <i className='fa fa-edit'></i>
                                                            </button>
                                                            <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-danger"
                                                                onClick={this.onDelete.bind(this, data)}
                                                            >
                                                                <i className='fa fa-trash'></i>
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 main-card card card-body">
                                        <Pagination 
                                            total={this.props.pagination.articulo.total}
                                            current={this.props.paginate.articulo}
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

IndexServicio.propTypes = {
    servicio: PropTypes.array,
    categoria: PropTypes.array,
    articulo: PropTypes.array,

    pagination: PropTypes.object,
    paginate: PropTypes.object,

    activeKey: PropTypes.any,
}

IndexServicio.defaultProps = {
    servicio: [],
    categoria: [],
    articulo: [],
    activeKey: '1',

    pagination: {
        producto: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        categoria: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
        articulo: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
    },

    paginate: {
        producto: 1,
        categoria: 1,
        articulo: 1,
    },
}

export default withRouter(IndexServicio);
