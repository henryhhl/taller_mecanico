
import React, { Component } from 'react';
import axios from 'axios';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import web from '../../utils/services';

class IndexArticulo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        axios.get( web.servidor + '/taller_mecanico/articulo/index').then(
            (response) => {
                if (response.data.response == 1) {
                    this.props.getarticulo(response.data.data);
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }
    onAdd() {
        this.props.history.push('/taller_mecanico/articulo/create');
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
        this.props.history.push('/taller_mecanico/articulo/editar/' + data.id);
    }
    onDelete(data) {
        this.props.onModalActive(data, 'articulo');
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
                                Gestionar Articulo
                        </div>
                        <div className="btn-actions-pane-right text-capitalize">
                            <button className="btn-wide btn-outline-2x mr-md-2 btn btn-outline-focus btn-sm"
                                onClick={this.onAdd.bind(this)}
                            >
                                Nuevo
                            </button>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <td>ID</td>
                                        <td>Descripcion</td>
                                        <td>Registro</td>
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
                                                        {data.descripcion}
                                                </td>
                                                <td>
                                                    <label className='cols_show'>Registro: </label>
                                                    {data.created_at}
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
                    </div>
                </div>
            </div>
        );
    }
}

IndexArticulo.propTypes = {
    articulo: PropTypes.array,
}

IndexArticulo.defaultProps = {
    articulo: [],
}

export default withRouter(IndexArticulo);
