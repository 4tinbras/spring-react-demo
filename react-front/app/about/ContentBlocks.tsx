'use client'
import React from "react";

export function OverflowingTwoColumnBlock({ children }: {children: React.ReactNode[]}) {
    return (<div className={"full-width two-column-layout"}>
        {children}
    </div>)
}