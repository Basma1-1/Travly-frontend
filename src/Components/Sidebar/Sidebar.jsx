import React from 'react';
import { NavLink } from 'react-router-dom';

import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>

        <li>Gestion voyages
          <ul>
            <li>
              <NavLink to="/admin/dashboard/voyage/create" className={({ isActive }) => isActive ? 'active' : ''}>
                Créer les voyages
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/dashboard/voyage/list" className={({ isActive }) => isActive ? 'active' : ''}>
                Liste les voyages
              </NavLink>
            </li>
          </ul>
        </li>

        <li>Gestion notification
          <ul>
            <li>
              <NavLink to="/admin/dashboard/notification/create" className={({ isActive }) => isActive ? 'active' : ''}>
                Créer les notifications
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/dashboard/notification/list" className={({ isActive }) => isActive ? 'active' : ''}>
                Liste les notification
              </NavLink>
            </li>
          </ul>
        </li>

        <li>Gestion utilisateur
          <ul>
            <li>
              <NavLink to="/admin/dashboard/users" className={({ isActive }) => isActive ? 'active' : ''}>
                gerer les utilisateurs
              </NavLink>
            </li>
          </ul>
        </li>

        <li>Statique
          <ul>
            <li>
              <NavLink to="/admin/dashboard/statistique" className={({ isActive }) => isActive ? 'active' : ''}>
                Statique
              </NavLink>
            </li>
          </ul>
        </li>
        
      </ul>

    </aside>
  );
}




