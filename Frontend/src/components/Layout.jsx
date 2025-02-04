import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            <h2 className="font-weight-light display-1 text-center">Arms Trade Registers</h2>
            <nav class="navbar bg-dark navbar-expand-lg" data-bs-theme="dark">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <NavLink className="nav-link custom-link" to="/United States" exact>United States</NavLink>                          
                            </li>
                            <li>
                                <NavLink className="nav-link" to="/Russia" exact>Russia</NavLink> 
                            </li>
                            <li>
                                <NavLink className="nav-link" to="/China" exact>China</NavLink> 
                            </li>
                            <li>
                                <NavLink className="nav-link" to="/France" exact>France</NavLink> 
                            </li>
                            <li>
                                <NavLink className="nav-link" to="/United Kingdom" exact>United Kingdom</NavLink> 
                            </li>
                            <li>
                                <NavLink className="nav-link" to="/Germany" exact>Germany</NavLink> 
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>

    )
}

export default Layout