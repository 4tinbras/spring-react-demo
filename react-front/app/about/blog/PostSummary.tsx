'use client'

export default function PostSummary({title, author, date, textSample}:
                                    { title: string, author: string, date: Date, textSample:string}) {
    return (<div>
        <h1>{title}</h1>
        <div className={'display-grid three-col-grid'}>
            <div className={"display-inline-block"}><p>{author}</p></div>
            {/*<div className={"display-inline-block"}><img src={imageSrc} alt={"Blog record image"}/></div>*/}
            <div className={'display-flex display-flex-expand'}></div>
            <div className={"display-inline-block"}><p>{date}</p></div>
        </div>
        <div className={'blog-summary-sample'}><p>{textSample}</p></div>

        <a href={"/about/blog/" + title} className="link-button">Show Full Post</a>
    </div>)
}