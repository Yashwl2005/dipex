import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Activity, FileText, Settings, ShieldCheck, LogOut, UserPlus } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ type = 'light' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDark = type === 'dark';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('sports');
        navigate('/auth');
    };

    const menuItems = isDark ? [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/athletes', label: 'Athlete Management', icon: Users },
        { path: '/shortlisted', label: 'Shortlisted Athletes', icon: UserCheck },
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/announcements', label: 'Announcements', icon: FileText },
        { path: '/auth', label: 'New Admin Sign Up', icon: UserPlus },
    ] : [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/athletes', label: 'Athletes', icon: Users },
        { path: '/announcements', label: 'Announcements', icon: FileText },
        { path: '/auth', label: 'New Admin Sign Up', icon: UserPlus },
    ];

    const adminName = localStorage.getItem('name') || 'Admin User';
    let adminRole = 'Authority';
    try {
        const sports = JSON.parse(localStorage.getItem('sports'));
        if (sports && sports.length > 0) {
            adminRole = sports.join(', ');
        }
    } catch { }

    const adminInfo = isDark ? {
        name: adminName,
        email: adminRole,
        avatarBg: '#ffb800'
    } : {
        name: adminName,
        email: adminRole,
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
                    const activeClass = isActive || (location.pathname === '/' && item.path === '/') ? 'active' : '';

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
                <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="admin-avatar" style={{ backgroundColor: adminInfo.avatarBg }}></div>
                        <div className="admin-info">
                            <div className="admin-name">{adminInfo.name}</div>
                            <div className="admin-role">{adminInfo.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '4px', transition: 'background 0.2s' }}
                        title="Logout"
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
};
