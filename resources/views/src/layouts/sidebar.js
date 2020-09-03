
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import web from '../utils/services';

import { isPermission } from '../utils/functions';
import permissions from '../utils/permisions';

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={"app-sidebar sidebar-shadow " + this.props.sidebarcolor}>
                <div className="app-header__logo">
                    <div className="logo-src"></div>
                    <div className="header__pane ml-auto">
                        <div>
                            <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="app-header__mobile-menu">
                    <div>
                        <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="app-header__menu">
                    <span>
                        <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                            <span className="btn-icon-wrapper">
                                <i className="fa fa-ellipsis-v fa-w-6"></i>
                            </span>
                        </button>
                    </span>
                </div> 

                <div className="scrollbar-sidebar">
                    <div className="app-sidebar__inner">
                        
                        <ul className="vertical-nav-menu">
                            <li className={"app-sidebar__heading" + ' ' + this.props.sizetext}>inicio</li>

                            {/* <li>
                                <Link to='/home' className="mm-active">
                                    <i className="fa fa-clone pe-7s-rocket"></i>
                                        Home
                                </Link>
                            </li> */}

                            {/* <li className={this.props.menu_active.dashboards}>
                                <a href="#">
                                    <i className="fa fa-clone pe-7s-rocket"></i>
                                        Dashboards
                                    <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                </a>
                                <ul> */}
                                    <li>
                                        <Link to={ web.home + '/home'} onClick={this.props.init} 
                                            className={this.props.link_active.home + ' ' + this.props.sizetext}
                                        >
                                            <i className="metismenu-icon">
                                            </i>HOME
                                        </Link>
                                    </li>
                                {/* </ul>
                            </li> */}
                            
                            <li className={"app-sidebar__heading" + ' ' + this.props.sizetext}>MÓDULO</li>
                            
                            { isPermission(this.props.permisos_habilitados, permissions.paqueteseguridad) ?
                                <li className={this.props.menu_active.seguridad}>
                                    <a href="#">
                                        <i className="fa fa-clone pe-7s-rocket"></i>
                                            <label className={this.props.sizetext}> SEGURIDAD </label>
                                        <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                    </a>
                                    <ul>
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarusuario) ?
                                            <li>
                                                <Link to={ web.serv_link + '/usuario'} onClick={this.props.init} 
                                                    className={this.props.link_active.usuario + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Usuario
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarrol) ?
                                            <li>
                                                <Link to={ web.serv_link + '/rol'} onClick={this.props.init} 
                                                    className={this.props.link_active.rol + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Rol
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.asignarpermiso) ?
                                            <li>
                                                <Link to={ web.serv_link + '/asignar_permiso'} onClick={this.props.init} 
                                                    className={this.props.link_active.asignar_permiso + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i> Asignar Permiso
                                                </Link>
                                            </li> : null 
                                        }
                                    </ul>
                                </li> : null 
                            }

                            { isPermission(this.props.permisos_habilitados, permissions.paqueteservicio) ?

                                <li className={this.props.menu_active.servicio}>
                                    <a href="#" className={ this.props.sizetext }>
                                        <i className="fa fa-clone pe-7s-rocket"></i>
                                            <label className={this.props.sizetext}> SERVICIO </label>
                                        <i className="metismenu-state-icon pe-7s-angle-down fa fa-angle-double-down"></i>
                                    </a>
                                    <ul>
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarmantenimiento) ?
                                            <li>
                                                <Link to={ web.serv_link + '/mantenimiento'} onClick={this.props.init} 
                                                    className={this.props.link_active.venta + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Mantenimiento
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarcliente) ?
                                            <li>
                                                <Link to={ web.serv_link + '/cliente'} onClick={this.props.init} 
                                                    className={this.props.link_active.cliente + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Cliente
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarmecanico) ?
                                            <li>
                                                <Link to={ web.serv_link + '/mecanico'} onClick={this.props.init} 
                                                    className={this.props.link_active.mecanico + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Mecanico
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarvehiculo) ?
                                            <li>
                                                <Link to={ web.serv_link + '/vehiculo'} onClick={this.props.init} 
                                                    className={this.props.link_active.vehiculo + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Vehiculo
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarservicio) ?
                                            <li>
                                                <Link to={ web.serv_link + '/almacen'} onClick={this.props.init} 
                                                    className={this.props.link_active.almacen + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Almacen
                                                </Link>
                                            </li> : null 
                                        }
                                        { isPermission(this.props.permisos_habilitados, permissions.gestionarpromocion) ?
                                            <li>
                                                <Link to={ web.serv_link + '/promocion'} onClick={this.props.init} 
                                                    className={this.props.link_active.promocion + ' ' + this.props.sizetext}
                                                >
                                                    <i className="metismenu-icon">
                                                    </i>Promocion
                                                </Link>
                                            </li> : null 
                                        }
                                        
                                    </ul>
                                </li> : null 
                            }

                        </ul>
                    </div>
                </div>
            </div> 
        );
    }
}

Sidebar.propTypes = {
    menu_active: PropTypes.object,
    link_active: PropTypes.object,
    sidebarcolor: PropTypes.string,
    sizetext: PropTypes.string,
    permisos_habilitados: PropTypes.array,
}

Sidebar.defaultProps = {
    menu_active: {
        dashboards: '',
        seguridad: '',
        servicio: '',
    },
    link_active: {
        home: '',
        usuario: '',
        rol: '',
        asignar_permiso: '',

        venta: '',
        cliente: '',
        mecanico: '',
        vehiculo: '',
        almacen: '',
        promocion: '',
    },
    sidebarcolor: '',
    sizetext: '',
    permisos_habilitados: [],
}


