import React from 'react';
import LoginForm from '../components/LoginForm';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
            <LoginForm />
        </div>
    );
};

export default Home;
