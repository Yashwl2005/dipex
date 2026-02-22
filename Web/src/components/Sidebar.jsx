import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Activity, FileText, Settings, ShieldCheck } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ type = 'light' }) => {
    const location = useLocation();
    const isDark = type === 'dark';

    const menuItems = isDark ? [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/athletes', label: 'Athlete Management', icon: Users },
        { path: '/shortlisted', label: 'Shortlisted Athletes', icon: UserCheck },
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/settings', label: 'Settings', icon: Settings },
    ] : [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/athletes', label: 'Athletes', icon: Users },
        { path: '/analytics', label: 'Analytics', icon: Activity },
        { path: '/compliance', label: 'Compliance', icon: ShieldCheck },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const adminInfo = isDark ? {
        name: 'Admin User',
        email: 'admin@sai.gov.in',
        avatarBg: '#ffb800'
    } : {
        name: 'Admin User',
        email: 'Central Office',
        avatarBg: '#ff7f50'
    };

    return (
        <aside className={`sidebar ${isDark ? 'sidebar-dark' : 'sidebar-light'}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-circle">
                        <span className="logo-text">SAI</span>
                    </div>
                    {!isDark ? (
                        <div className="logo-title">
                            <strong>SAI</strong>
                            <span>National Performance</span>
                        </div>
                    ) : (
                        <div className="logo-title">
                            <strong>Sports Authority<br />of India</strong>
                            <span>Admin Portal</span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    // For prototype: matching exact paths since they are placeholders
                    const isActive = location.pathname === item.path ||
                        (item.path === '/shortlisted' && location.pathname.includes('/shortlisted')) ||
                        (item.path === '/analytics' && location.pathname === '/'); // highlight analytics on dashboard somewhat?

                    // Let's rely on exact matches or simple logic
                    const activeClass = location.pathname === item.path || (location.pathname === '/' && item.path === '/') ? 'active' : '';

                    return (
                        <Link to={item.path} key={item.label} className={`nav-item ${activeClass}`}>
                            <item.icon size={20} className="nav-icon" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                {isDark && <div className="logged-in-label">LOGGED IN AS</div>}
                <div className="admin-profile">
                    <div className="admin-avatar" style={{ backgroundColor: adminInfo.avatarBg }}></div>
                    <div className="admin-info">
                        <div className="admin-name">{adminInfo.name}</div>
                        <div className="admin-role">{adminInfo.email}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
