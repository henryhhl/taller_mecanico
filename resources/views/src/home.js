
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import { notification, Card, Transfer, Switch, Button, Modal } from 'antd';
import 'antd/dist/antd.css';

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
    get_informacion() {
        axios.get( web.servidor + '/get_informacion').then(
            (response) => {
                if (response.status == 200) {
                    this.setState({
                        auth: response.data.auth,
                    });
                }
            }
        ).catch(
            error => {
                if (error.response.status == 401) {
                    console.log(error);
                    notification.error({
                        message: 'ERROR',
                        description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
                    });
                }
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
                                    Inicio al sistema
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}