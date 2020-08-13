
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Pagination, notification } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';

class IndexVenta extends Component {

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
        this.props.get_link('venta');
        this.get_data();
    }
    get_data(page = 1, search = '') {
        axios.get( web.servidor + '/venta/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.props.getventa(response.data.data.data, response.data.pagination, page);
                }
            }
        ).catch( error => { 
            console.log(error) 
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } );
    }
    onAdd() {
        this.props.history.push('/taller_mecanico/mantenimiento/create');
    }
    onShow(data) {}
    onDelete(data) {
        this.props.onModalActive(data, 'venta');
    }
    onChangePagina(page) {
        this.get_data(page, this.state.search);
    }
    onchangeSearch(event) {
        var search = event.target.value;
        this.setState({ search: event.target.value, });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => {
            this.get_data(1, search);
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    render() {
        return (
            <div className="rows">
                <div className="cards">
                    <div className="card-header-tab card-header mt-4" style={{border: '1px solid transparent'}}>
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal mb-4">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                GESTIONAR MANTENIMIENTO
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
                                NUEVO
                            </button>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <td>ID</td>
                                        <td>CODIGO</td>
                                        <td>CLIENTE</td>
                                        <td>VEHICULO</td>
                                        <td>CANT TOTAL</td>
                                        <td>DESC</td>
                                        <td>MTO. TOTAL</td>
                                        <td>OPCION</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.venta.map(
                                        (data, key) => (
                                            <tr key={key}>
                                                <td>
                                                    <label className='cols_show'>ID: </label>
                                                    {data.id}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>CODIGO: </label>
                                                        {data.codigo == null ? 'S/CODIGO' : data.codigo}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>CLIENTE: </label>
                                                        {data.nombre == null ? 'S/CLIENTE' : data.apellido ? data.nombre : data.nombre + ' ' + data.apellido}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>VEHICULO: </label>
                                                        {data.placa == null ? 'S/VEHICULO' : data.placa}
                                                </td>
                                                <td style={{textAlign: 'right', paddingRight: 8, }}>
                                                    <label className='cols_show'>CANT TOTAL: </label>
                                                        {data.cantidadtotal}
                                                </td>
                                                <td style={{textAlign: 'right', paddingRight: 8, }}>
                                                    <label className='cols_show'>DESC: </label>
                                                        {parseInt(data.descuento) + '%'}
                                                </td>
                                                <td style={{textAlign: 'right', paddingRight: 8, }}>
                                                    <label className='cols_show'>MTO. TOTAL: </label>
                                                        {data.montototal}
                                                </td>
                                                <td style={{textAlign: 'right', paddingRight: 8, }}>
                                                    <button className="mb-2 mr-2 btn-hover-shine btn btn-xs btn-success"
                                                        onClick={this.onShow.bind(this, data)}
                                                    >
                                                        <i className='fa fa-eye'></i>
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
                                total={this.props.pagination.venta.total}
                                current={this.props.paginate.venta}
                                pageSize={10}
                                showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                style={{ textAlign: 'right', paddingRight: 20, paddingBottom: 10,}}
                                //size="small"
                                onChange={this.onChangePagina.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

IndexVenta.propTypes = {
    venta: PropTypes.array,
    pagination: PropTypes.object,
    paginate: PropTypes.object,
}

IndexVenta.defaultProps = {
    venta: [],
    pagination: {
        venta: {
            'total': 0, 'current_page': 0,
            'per_page': 0, 'last_page': 0,
            'from': 0, 'to': 0,
        },
    },
    paginate: {
        venta: 1,
    },
}

export default withRouter(IndexVenta);
