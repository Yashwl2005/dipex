import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children, sidebarType = 'light', showHeader = false }) => {
    return (
        <div className="app-container">
            {sidebarType !== 'none' && <Sidebar type={sidebarType} />}
            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {showHeader && <Header />}
                <div style={{ flex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
};
