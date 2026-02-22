import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Mail, Lock, User, Calendar, Activity } from 'lucide-react';
import api from '../api';
import './Auth.css';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        sports: [],
        role: 'admin'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const sportsOptions = [
        'Athletics', 'Swimming', 'Gymnastics', 'Weightlifting',
        'Boxing', 'Wrestling', 'Archery', 'Shooting'
    ];

    const handleSportChange = (sport) => {
        setFormData(prev => {
            if (prev.sports.includes(sport)) {
                return { ...prev, sports: prev.sports.filter(s => s !== sport) };
            } else {
                return { ...prev, sports: [...prev.sports, sport] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const res = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                // Ensure only admins can log in
                if (res.data.role !== 'admin') {
                    setError('Access denied. Admin privileges required.');
                    return;
                }

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('sports', JSON.stringify(res.data.sports || []));
                navigate('/');
            } else {
                if (formData.sports.length === 0) {
                    setError('Please select at least one sport to evaluate.');
                    return;
                }
                const res = await api.post('/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    sports: formData.sports,
                    role: 'admin'
                });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role || 'admin');
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('sports', JSON.stringify(res.data.sports || formData.sports));
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Admin Portal' : 'Register Admin'}</h2>
                    <p>{isLogin ? 'Log in to manage athletes and reports' : 'Create a new administrator account'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Assigned Sports to Evaluate</label>
                            <div className="sports-grid">
                                {sportsOptions.map(sport => (
                                    <label
                                        key={sport}
                                        className={`sport-checkbox ${formData.sports.includes(sport) ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.sports.includes(sport)}
                                            onChange={() => handleSportChange(sport)}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="checkbox-custom">
                                            {formData.sports.includes(sport) && <Check size={14} color="white" />}
                                        </div>
                                        <span>{sport}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-primary auth-btn">
                        {isLogin ? 'Log In' : 'Register Now'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already registered? "}
                        <button className="auth-switch" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? 'Register' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
