'use client'
import {OverflowingTwoColumnBlock} from "@/app/about/ContentBlocks";
import {loremIpsum} from "lorem-ipsum";


export default function About() {

    return (<>
        <h1>About Us</h1>
        <OverflowingTwoColumnBlock children={[
            <div key={1}>{loremIpsum({count: 10, units: "sentences"})}</div>,
            <div key={2}>{loremIpsum({count: 10, units: "sentences"})}</div>
        ]}>
        </OverflowingTwoColumnBlock>

        <a href="/about/blog" className="link-button">See Our Blog</a>
    </>)
}