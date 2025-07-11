import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="card__title">{title}</h3>}
            <div className="card__content">
                {children}
            </div>
        </div>
    );
};

export default Card;
