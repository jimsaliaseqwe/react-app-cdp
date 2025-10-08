import React from 'react';

export default function LabelRequired(props) {
    return (
        <label htmlFor={props['htmlFor']} style={{ whiteSpace: 'nowrap' }}>
            {props['children']} <span className={'text-red-500'}>(*)</span>
        </label>
    );
}
