import React, { useState } from 'react';

const Signup = ({ onSignup, onSwitchToLogin }) => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('calendar_users') || '[]');

        if (users.find(u => u.email === userData.email)) {
            setError('Email already exists');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData
        };

        users.push(newUser);
        localStorage.setItem('calendar_users', JSON.stringify(users));
        onSignup(newUser);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p>Join Event_Manager today</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User_Name</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">Sign Up</button>
                </form>
                <p className="auth-footer">
                    Already have an account? <span onClick={onSwitchToLogin}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
