
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import { notification, Card, Transfer, Switch, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import web from './utils/services';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
        }
    }
    componentDidMount() {
        this.props.get_link('home');
        // this.get_informacion();
    }
    get_data() {
        axios.get( web.servidor + '/get_informacion').then(
            (response) => {
                if (response.data.response == -3) {
                    this.props.logout();
                    return;
                }
                if (response.data.response == 1) {
                    this.setState({
                        auth: response.data.auth,
                    });
                    return;
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
        ).catch(
            error => {
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
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    zIndex: 1200,
                });
            }
        );
    }
    render() {
        return (
            <div style={{'width': '100%'}}>
                <div className="tabs-animation">
                    
                    <div className="card mb-3">
                        <div className="card-header-tab card-header">
                            <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                <i className="header-icon lnr-laptop-phone mr-3 text-muted opacity-6"> </i>
                                    BIENVENIDO AL SISTEMA ROTTERDAM
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}