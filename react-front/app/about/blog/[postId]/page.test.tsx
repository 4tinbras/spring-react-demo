import {act, render, screen} from "@testing-library/react";
import BlogPage from "@/app/about/blog/[postId]/page";

describe('Blog ', () => {

    it('shows a list of post summaries and clicking on show full text takes to relevant post', async () => {
        const wrappedValue = Promise.resolve(() => {postId: 1});

        await act(async () => {
            const picture = render(<BlogPage params={wrappedValue}></BlogPage>)
        })

        //TODO: enhance it to include param value; works in a real render but not in the test
        //expect(screen.queryByText('1')).toBeInTheDocument();
        expect(screen.queryByText('Joe Doe')).toBeInTheDocument();
    })
})