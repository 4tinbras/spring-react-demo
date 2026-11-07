'use client'
import {OverflowingTwoColumnBlock} from "@/app/about/ContentBlocks";
import {SecondaryButton} from "@/app/utilities/prefabComponents";
import {loremIpsum} from "lorem-ipsum";


export default function About() {

    //complains about broken hydration; probably because of lorem ipsum
    return (<>
        <h1>About Us</h1>
        <OverflowingTwoColumnBlock children={[
            <div key={1}>{loremIpsum({count: 10, units: "sentences"})}</div>,
            <div key={2}>{loremIpsum({count: 10, units: "sentences"})}</div>
        ]}>
        </OverflowingTwoColumnBlock>
        <SecondaryButton initialButtonText={"See Our Blog"} onClickHandler={undefined}></SecondaryButton>
    </>)
}