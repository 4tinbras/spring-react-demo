'use client'

import {PrimaryButton} from "@/app/utilities/prefabComponents";

export default function PostSummary({title, author, date, textSample}:
                                    { title: string, author: string, date: Date, textSample:string}) {
    return (<div>
        <h1>{title}</h1>
        <div className={"display-inline-block"}><p>{author}</p></div>
        {/*<div className={"display-inline-block"}><img src={imageSrc} alt={"Blog record image"}/></div>*/}
        <div className={"display-inline-block"}><p>{date}</p></div>
        <div className={'blog-summary-sample'}><p>{textSample}</p></div>
        <PrimaryButton initialButtonText={"Show Full Post"} onClickHandler={undefined}></PrimaryButton>
    </div>)
}