'use client'

import PostSummary from "@/app/about/blog/PostSummary";
import {loremIpsum} from "lorem-ipsum";

export default function Blog() {

    return (<div>
        <PostSummary title={"Sample Title1"} textSample={loremIpsum({count: 3, units: "sentences"})}
                     // imageSrc={undefined}
                     author={"Joe Doe"} date={new Date(Date.now()).toISOString()}></PostSummary>
        <PostSummary title={"Sample Title2"} textSample={loremIpsum({count: 3, units: "sentences"})}
            // imageSrc={undefined}
                     author={"Joe Doe"} date={new Date(Date.now()).toISOString()}></PostSummary>
        <PostSummary title={"Sample Title3"} textSample={loremIpsum({count: 3, units: "sentences"})}
            // imageSrc={undefined}
                     author={"Joe Doe"} date={new Date(Date.now()).toISOString()}></PostSummary>
    </div>)
}