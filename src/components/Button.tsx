import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', variant = 'primary' }) => {
    return (
        <button 
            type={type} 
            onClick={onClick}
            className={`button button--${variant}`}
        >
            {children}
        </button>
    );
};

export default Button;
