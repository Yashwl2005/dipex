import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './Header.css';

export const Header = () => {
    return (
        <header className="top-header">
            <div className="header-logo">
                <div className="logo-circle header-icon">
                    <span className="logo-text">SAI</span>
                </div>
                <strong>SAI Portal</strong>
            </div>

            <nav className="header-nav">
                <Link to="/" className="header-link">Dashboard</Link>
                <Link to="/review" className="header-link active">Submissions</Link>
                <Link to="/athletes" className="header-link">Athletes</Link>
                <Link to="/reports" className="header-link">Reports</Link>
            </nav>

            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="user-text">
                        <strong>Arjun Singh</strong>
                        <span>Chief Reviewer</span>
                    </div>
                    <div className="user-avatar" style={{ backgroundColor: '#ff9478' }}>
                        <img src="https://i.pravatar.cc/150?img=11" alt="Arjun Singh" />
                    </div>
                </div>
            </div>
        </header>
    );
};
