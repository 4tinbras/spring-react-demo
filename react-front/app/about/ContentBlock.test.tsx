import {OverflowingTwoColumnBlock} from "@/app/about/ContentBlocks";
import {render, screen} from "@testing-library/react";


describe('Two Column Block ', () => {

    it('allows content to overflow from first column to the second', async () => {

        //TODO: not sure if there is a better way to assert it
        //height to match max set on the columns so that it blocked whole first column and overflew to the other
        const firstColumnBlocker = <div key={1} style={{height: '35vh', width: '100%'}}></div>
        const overflowingContent = <div key={2}>Overflew to the second column</div>

        const picture = render(<OverflowingTwoColumnBlock children={[firstColumnBlocker, overflowingContent]}></OverflowingTwoColumnBlock>)

        expect(screen.queryByText('Overflew to the second column')).toBeInTheDocument();
    });
})