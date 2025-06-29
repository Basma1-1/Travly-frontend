import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "../../Components/Sidebar/Sidebar";

import Statique from "../../Pages/Statique/Statique";
import AdminVoyageCreate from "../../Pages/admin/AdminVoyageCreate";
import AdminVoyageEdit from "../../Pages/admin/AdminVoyageEdit";
import AdminVoyageList from "../../Pages/admin/AdminVoyageList";
import AdminNotificationCreate from "../admin/AdminNotificationCreate";
import AdminNotificationEdit from "../../Pages/admin/AdminNotificationEdit";
import AdminNotificationList from "../../Pages/admin/AdminNotificationList";
import AdminUser from "../../Pages/admin/AdminUser";
import DashboardHome from "../../Pages/admin/DashboardHome";


import "./DashboardAdmin.css"
export default function DashboardAdmin() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="voyage/create" element={<AdminVoyageCreate />} />
            <Route path="voyage/edit/:id" element={<AdminVoyageEdit />} />
            <Route path="voyage/list" element={<AdminVoyageList />} />
            <Route path="notification/create" element={<AdminNotificationCreate />} />
            <Route path="notification/edit/:id" element={<AdminNotificationEdit />} />
            <Route path="notification/list" element={<AdminNotificationList />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="statistique" element={<Statique />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}








