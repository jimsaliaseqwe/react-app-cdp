import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

export default function () {
    return (
        <div
            className="absolute bg-black-alpha-20 flex align-items-start"
            style={{ inset: 0, zIndex: 2 }}
        >
            <ProgressSpinner style={{ width: '50px', marginTop: '20%' }} />
        </div>
    );
}
