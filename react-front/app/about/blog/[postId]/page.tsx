'use client'
import {use} from 'react'
import BlogPost from "@/app/about/blog/[postId]/BlogPost";

export default function BlogPage({params,}: {
    params: Promise<{ postId: string }>
}) {
    const {postId} = use(params)

    //TODO: query db for post of given id

    return (<BlogPost title={postId} author={'Joe Doe'} date={new Date(Date.now()).toISOString()}
                     content={'Sample Content'}></BlogPost>)
}