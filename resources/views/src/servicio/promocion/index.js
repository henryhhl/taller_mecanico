
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import { Pagination, notification, Modal  } from 'antd';
import 'antd/dist/antd.css';
import web from '../../utils/services';
import { isPermission } from '../../utils/functions';
import permissions from '../../utils/permisions';

class IndexPromocion extends Component {

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
        this.props.get_link('promocion', true); //#3f6ad8 co //#e0f3ff bg bold
        this.get_data();
    }
    get_data(page = 1, search = '') {
        axios.get( web.servidor + '/promocion/index?page=' + page + '&search=' + search).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        this.props.getpromocion(response.data.data.data, response.data.pagination, page, response.data.visitasitio);
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
            if (error.response.status == 401) {
                this.setState({
                    auth: true,
                });
            }
        } );
    }
    onAdd() {
        this.props.history.push( web.serv_link + '/promocion/create');
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
        this.props.history.push( web.serv_link + '/promocion/editar/' + data.id);
    }
    onDelete(data) {
        this.props.onModalActive(data, 'promocion');
    }
    onChangePagina(page) {
        this.get_data(page, this.state.search);
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
            this.get_data(1, search)
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    render() {
        var color = this.props.buttoncolor == '' ? 'outline-focus' : this.props.buttoncolor;
        var optioneditar = this.props.buttoncolor == '' ? 'primary' : 'outline-' + this.props.buttoncolor;
        var optiondelete = this.props.buttoncolor == '' ? 'danger' : 'outline-' + this.props.buttoncolor;
        return (
            <div className="rows">
                <div className="cards">
                    <div className="card-header-tab card-header mt-4" style={{border: '1px solid transparent'}}>
                        <div className="card-header-title font-size-lg text-capitalize font-weight-normal mb-4">
                            <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                GESTIONAR PROMOCION
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
                            { isPermission(this.props.permisos_habilitados, permissions.promocioncreate) ?
                                <button className={"btn-wide btn-outline-2x mr-md-2 btn btn-sm btn-" + color }
                                    onClick={this.onAdd.bind(this)}
                                >
                                    Nuevo
                                </button> : null 
                            }
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <td>ID</td>
                                        <td>Descripcion</td>
                                        <td>Descuento</td>
                                        <td>Fecha Inicio</td>
                                        <td>Fecha Fin</td>
                                        <td>Opcion</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.promocion.map(
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
                                                    <label className='cols_show'>Descuento: </label>
                                                    {data.descuento + ' %'}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>Fecha Inicio: </label>
                                                        {this.formato(data.fechainicio)}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>Fecha Final: </label>
                                                    {this.formato(data.fechafinal)}
                                                </td>
                                                <td>
                                                { isPermission(this.props.permisos_habilitados, permissions.promocioneditar) ?
                                                    <button className={"mb-2 mr-2 btn-hover-shine btn btn-xs btn-" + optioneditar }
                                                        onClick={this.onEdit.bind(this, data)}
                                                    >
                                                        <i className='fa fa-edit'></i>
                                                    </button> : null 
                                                }
                                                { isPermission(this.props.permisos_habilitados, permissions.promociondelete) ?
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
                                total={this.props.pagination.promocion.total}
                                current={this.props.paginate.promocion}
                                pageSize={10}
                                showTotal = {(total, range) => `${range[0]} - ${range[1]} / Total ${total}`}
                                style={{ textAlign: 'right', paddingRight: 20, }}
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

IndexPromocion.propTypes = {
    promocion: PropTypes.array,
    pagination: PropTypes.object,
    paginate: PropTypes.object,
    buttoncolor: PropTypes.string,
    permisos_habilitados: PropTypes.array,
}

IndexPromocion.defaultProps = {
    promocion: [],
    pagination: {
        promocion: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0,
        },
    },

    paginate: {
        promocion: 1,
    },
    buttoncolor: '',
}

export default withRouter(IndexPromocion);
