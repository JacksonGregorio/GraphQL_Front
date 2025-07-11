import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>My Frontend App</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
            </nav>
        </header>
    );
};

export default Header;
