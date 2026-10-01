'use client'


import React from "react";

export const enum ErrorLevel {
    HardException = 'HardException',
    SoftException = 'SoftException',
    Warning = 'Warning'
}

export interface ErrorDescriptor {
    id: string,
    errorLevel: ErrorLevel,
    message: string,
    relatedField: string
}

export default function ErrorBlock({errors}: { errors: ErrorDescriptor[] }) {

    const errorElements = errors.map((item) => {
        return <li key={`${item.id}`} id={`error${item.id}`}>
            <a href={`#${item.relatedField}`}>{item.message}</a>
        </li>;
    })

    return (<>
        <ul>
            {errorElements}
        </ul>
    </>)
}