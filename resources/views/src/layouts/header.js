
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import web from '../utils/services';

import {withRouter, Link} from 'react-router-dom';

import { notification, Dropdown, Menu, message } from 'antd';
import 'antd/dist/antd.css';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible_perfil: false,
            visible_search: false,
            active_search: 'active',
            search: '',
            timeoutSearch: undefined,
        };
    }

    onAjuste(event) {
        event.preventDefault();
        this.props.history.push( web.serv_link + '/ajuste');
    }

    get_search(value) {
        var formdata = new FormData();
        formdata.append('search', value);
        axios.post( web.servidor + '/ajuste/search_general', formdata).then(
            (response) => {
                console.log(response.data)
                if (response.status == 200) {
                    if (response.data.response == -3) {
                        this.props.logout();
                        return;
                    }
                    if (response.data.response == 1) {
                        console.log(response.data)
                        return;
                    }
                }
            }
        ).catch( error => {
            message.error('HUBO PROBLEMA AL SOLICITUD SERVICIO');
        } );
    }

    onchangeSearch(event) {
        var value = event.target.value;
        this.setState({
            search: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => {
            this.get_search(value)
        }, 1000);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    render() {

        var usuario = this.props.usuario;

        const menushearch = (
            <Menu style={{width: '200%'}}>
                a
            </Menu>
        );

        const menu = (
            <div tabIndex="-1" role="menu" className={`rm-pointers dropdown-menu-lg dropdown-menu dropdown-menu-right show`}>
                <div className="dropdown-menu-header">
                    <div className="dropdown-menu-header-inner bg-info">
                        <div className="menu-header-image opacity-2" 
                            style={{'backgroundImage': 'url( ' + web.img_servidor + '/assets/images/dropdown-header/city3.jpg)'}}></div>
                        <div className="menu-header-content text-left">
                            <div className="widget-content p-0">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left mr-3">
                                        { (usuario.imagen == null || usuario.imagen == '') ? 
                                            <img width="42" className="rounded-circle"
                                                src={ web.img_servidor + "/images/anonimo.jpg"}
                                                alt="" 
                                            /> : 
                                            <img width="42" className="rounded-circle"
                                                src={ usuario.imagen}
                                                alt="" 
                                            />
                                        }
                                    </div>
                                    <div className="widget-content-left">
                                        <div className="widget-heading">
                                            { usuario.apellido == null ? usuario.nombre : usuario.nombre + ' ' + usuario.apellido}
                                        </div>
                                        <div className="widget-subheading opacity-8">
                                            { usuario.rol == null ? '-' : usuario.rol}
                                        </div>
                                    </div>
                                    <div className="widget-content-right mr-2">
                                        <form action={ web.servidor + "/logout"} method="post" id='logout'>
                                            <input type="hidden" name="_token" value={this.props.token} />
                                            <button type='submit' className="btn-pill btn-shadow btn-shine btn btn-focus">
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll-area-xs" style={{'height': '150px'}}>
                    <div className="scrollbar-container ps">
                        <ul className="nav flex-column">
                            <li className="nav-item-header nav-item">
                                Actividad
                            </li>
                            <li className="nav-item">
                                <Link to={ web.serv_link + '/perfil' } onClick={ () => this.setState({ visible_perfil: false, }) } className="nav-link">
                                        Perfil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={ web.serv_link + '/ajuste' } onClick={ () => this.setState({ visible_perfil: false, }) } className="nav-link">
                                        Ajuste
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    Messages
                                    <div className="ml-auto badge badge-warning">
                                        512
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item-divider nav-item">
                    </li>
                    <li className="nav-item-btn text-center nav-item">
                        <button className="btn-wide btn btn-primary btn-sm" onChange={(event) => {
                            console.log(8)
                        }}>
                            Open Messages
                        </button>
                    </li>
                </ul>
            </div>
          );

        return (
            <div className={"app-header header-shadow " + this.props.headercolor}>
                <div className="app-header__logo">
                    <div className="logo-src" style={{background: 'none', fontWeight: 'bold',}}>
                        ROTTERDAM
                    </div>
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
                <div className="app-header__content">
                    
                    <div className="app-header-left">

                        <Dropdown overlay={menushearch} trigger={['click']} 
                            visible={this.state.visible_search}
                            onVisibleChange={ () => this.setState({visible_search: !this.state.visible_search}) }
                        >
                            <div className={`search-wrapper ${this.state.active_search}`}>
                                <div className="input-holder">
                                    <input type="text" className="search-input" placeholder="INGRESAR DATO..." 
                                        value={this.state.search} onChange={this.onchangeSearch.bind(this)}
                                    />
                                    <button className="search-icon" onClick={ () => this.setState({active_search: 'active'}) }><span></span></button>
                                </div>
                                <button className="close" onClick={ () => this.setState({search: '', active_search: ''}) }></button>
                            </div>
                        </Dropdown>
                    </div>

                    <div className="app-header-right">
                        <div className="header-dots">
                            
                            <div className="dropdown">
                                <button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" className="p-0 mr-2 btn btn-link">
                                    <span className="icon-wrapper icon-wrapper-alt rounded-circle">
                                        <span className="icon-wrapper-bg bg-danger"></span>
                                        <i className="icon text-danger icon-anim-pulse ion-android-notifications"></i>
                                        <span className="badge badge-dot badge-dot-sm badge-danger">Notifications</span>
                                    </span>
                                </button>
                                <div tabIndex="-1" role="menu" aria-hidden="true" className="dropdown-menu-xl rm-pointers dropdown-menu dropdown-menu-right">
                                    <div className="dropdown-menu-header mb-0">
                                        <div className="dropdown-menu-header-inner bg-deep-blue">
                                            <div className="menu-header-image opacity-1" style={{'backgroundImage': 'url(/assets/images/dropdown-header/city3.jpg)'}}></div>
                                            <div className="menu-header-content text-dark">
                                                <h5 className="menu-header-title">Notifications</h5>
                                                <h6 className="menu-header-subtitle">You have <b>21</b> unread messages</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="tabs-animated-shadow tabs-animated nav nav-justified tabs-shadow-bordered p-3">
                                        <li className="nav-item">
                                            <a role="tab" className="nav-link active" data-toggle="tab" href="#tab-messages-header">
                                                <span>Messages</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a role="tab" className="nav-link" data-toggle="tab" href="#tab-events-header">
                                                <span>Events</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a role="tab" className="nav-link" data-toggle="tab" href="#tab-errors-header">
                                                <span>System Errors</span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-messages-header" role="tabpanel">
                                            <div className="scroll-area-sm">
                                                <div className="scrollbar-container">
                                                    <div className="p-3">
                                                        <div className="notifications-box">
                                                            <div className="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--one-column">
                                                                <div className="vertical-timeline-item dot-danger vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">All Hands Meeting</h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-warning vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <p>Yet another one, at <span className="text-success">15:00 PM</span></p>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-success vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">Build the production release
                                                                                <span className="badge badge-danger ml-2">NEW</span>
                                                                            </h4>
                                                                            <span className="vertical-timeline-element-date"></span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-primary vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">Something not important
                                                                                <div className="avatar-wrapper mt-2 avatar-wrapper-overlap">
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img
                                                                                                src={ web.img_servidor + "/assets/images/avatars/1.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/2.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/3.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/4.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/5.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/9.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/7.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm">
                                                                                        <div className="avatar-icon">
                                                                                            <img src={ web.img_servidor + "/assets/images/avatars/8.jpg"}
                                                                                                alt="" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="avatar-icon-wrapper avatar-icon-sm avatar-icon-add">
                                                                                        <div className="avatar-icon"><i>+</i></div>
                                                                                    </div>
                                                                                </div>
                                                                            </h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-info vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">This dot has an info state</h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-danger vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">All Hands Meeting</h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-warning vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <p>Yet another one, at 
                                                                                <span className="text-success">15:00 PM</span>
                                                                            </p><span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-success vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">Build the production release
                                                                                <span className="badge badge-danger ml-2">NEW</span>
                                                                            </h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="vertical-timeline-item dot-dark vertical-timeline-element">
                                                                    <div><span className="vertical-timeline-element-icon bounce-in"></span>
                                                                        <div className="vertical-timeline-element-content bounce-in">
                                                                            <h4 className="timeline-title">This dot has a dark state</h4>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="tab-events-header" role="tabpanel">
                                            <div className="scroll-area-sm">
                                                <div className="scrollbar-container">
                                                    <div className="p-3">
                                                        <div className="vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-success"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title">All Hands Meeting</h4>
                                                                        <p>Lorem ipsum dolor sic amet, today at 
                                                                            <a href="#">12:00 PM</a>
                                                                        </p><span className="vertical-timeline-element-date"></span>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-warning"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <p>Another meeting today, at 
                                                                            <b className="text-danger">12:00 PM</b>
                                                                        </p>
                                                                        <p>Yet another one, at <span className="text-success">15:00 PM</span></p>
                                                                        <span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-danger"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title">Build the production release</h4>
                                                                        <p>Lorem ipsum dolor sit amit,consectetur eiusmdd tempor incididunt ut 
                                                                            labore et dolore magna elit enim at minim veniam quis nostrud
                                                                        </p>
                                                                        <span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-primary"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title text-success">Something not important</h4>
                                                                        <p>Lorem ipsum dolor sit amit,consectetur elit enim at 
                                                                            minim veniam quis nostrud</p>
                                                                        <span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-success"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title">All Hands Meeting</h4>
                                                                        <p>Lorem ipsum dolor sic amet, today at 
                                                                            <a href="#">12:00 PM</a>
                                                                        </p><span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-warning"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <p>Another meeting today, at <b className="text-danger">12:00 PM</b></p>
                                                                        <p>Yet another one, at <span className="text-success">15:00 PM</span></p>
                                                                        <span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-danger"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title">Build the production release</h4>
                                                                        <p>Lorem ipsum dolor sit amit,consectetur eiusmdd tempor incididunt 
                                                                            ut labore et dolore magna elit enim at minim veniam quis nostrud</p>
                                                                            <span className="vertical-timeline-element-date"></span>
                                                                        </div>
                                                                </div>
                                                            </div>
                                                            <div className="vertical-timeline-item vertical-timeline-element">
                                                                <div><span className="vertical-timeline-element-icon bounce-in">
                                                                        <i className="badge badge-dot badge-dot-xl badge-primary"> </i>
                                                                    </span>
                                                                    <div className="vertical-timeline-element-content bounce-in">
                                                                        <h4 className="timeline-title text-success">Something not important</h4>
                                                                        <p>Lorem ipsum dolor sit amit,consectetur elit enim at minim veniam quis nostrud</p>
                                                                        <span className="vertical-timeline-element-date"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="tab-errors-header" role="tabpanel">
                                            <div className="scroll-area-sm">
                                                <div className="scrollbar-container">
                                                    <div className="no-results pt-3 pb-0">
                                                        <div className="swal2-icon swal2-success swal2-animate-success-icon">
                                                            <div className="swal2-success-circular-line-left" style={{'backgroundColor': 'rgb(255, 255, 255)'}}></div>
                                                            <span className="swal2-success-line-tip"></span>
                                                            <span className="swal2-success-line-long"></span>
                                                            <div className="swal2-success-ring"></div>
                                                            <div className="swal2-success-fix" style={{'backgroundColor': 'rgb(255, 255, 255)'}}></div>
                                                            <div className="swal2-success-circular-line-right" style={{'backgroundColor': 'rgb(255, 255, 255)'}}></div>
                                                        </div>
                                                        <div className="results-subtitle">All caught up!</div>
                                                        <div className="results-title">There are no system errors!</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="nav flex-column">
                                        <li className="nav-item-divider nav-item"></li>
                                        <li className="nav-item-btn text-center nav-item">
                                            <button className="btn-shadow btn-wide btn-pill btn btn-focus btn-sm">
                                                View Latest Changes
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                        </div>
                        
                        <div className="header-btn-lg pr-0">
                            <div className="widget-content p-0">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left">
                                        <div className="btn-group">
                                            <Dropdown overlay={menu} trigger={['click']} 
                                                visible={this.state.visible_perfil}
                                                onVisibleChange={ () => this.setState({visible_perfil: !this.state.visible_perfil}) }
                                            >
                                                <a className="p-0 btn" onClick={e => e.preventDefault()}>
                                                    { (usuario.imagen == null || usuario.imagen == '') ?
                                                        <img width="42" className="rounded-circle" 
                                                            src={ web.img_servidor + "/images/anonimo.jpg"} alt="" 
                                                        /> : 
                                                        <img width="42" className="rounded-circle" 
                                                            src={ usuario.imagen } alt="" 
                                                        />
                                                    }
                                                    <i className="fa fa-angle-down ml-2 opacity-8"></i>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>    
        );
    }
}

Header.propTypes = {
    usuario: PropTypes.object,
    token: PropTypes.string,
    headercolor:PropTypes.string,
}

Header.defaultProps = {
    usuario: {
        id: '',  nombre: '', apellido: '',
        nacimiento: '', usuario: '',
        imagen: '', genero: 'N',
        email: '', rol: '', descripcion: '',
    },
    token: '',
    headercolor: '',
}

