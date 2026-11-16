export default function BlogPost({title, author, date, content}:
                                 { title: string, author: string, date: Date, content:string}) {

    return (<div>
        <h1>{title}</h1>
        <div className={"display-inline-block"}><p>{author}</p></div>
        <div className={"display-inline-block"}><p>{date}</p></div>
        <div className={'blog-summary-sample'}><p>{content}</p></div>
    </div>)
}