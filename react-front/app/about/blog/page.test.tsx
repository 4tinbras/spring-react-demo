import {render, screen} from "@testing-library/react";
import Blog from "@/app/about/blog/page";

describe('Blog ', () => {

    it('shows a list of post summaries and clicking on show full text takes to relevant post', async () => {
        const picture = render(<Blog></Blog>)

        expect(screen.queryByText('Sample Title1')).toBeInTheDocument();
        expect(screen.queryByText('Sample Title2')).toBeInTheDocument();
        expect(screen.queryByText('Sample Title3')).toBeInTheDocument();

        expect(screen.queryAllByText('Show Full Post')).toHaveLength(3);
        expect(screen.queryAllByText('Joe Doe')).toHaveLength(3);
    })
})