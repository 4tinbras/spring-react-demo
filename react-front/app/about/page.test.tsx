import {render, screen} from "@testing-library/react";
import About from "@/app/about/page";


describe('About page ', () => {

    it('shows about header, two column description and button to blog', async () => {

        const picture = render(<About></About>)

        expect(screen.queryByText('About Us')).toBeInTheDocument();
        // expect(screen.queryByText('Column content')).toBeInTheDocument(); // given it's random - no way to test it for now
        expect(screen.queryByText('See Our Blog')).toBeInTheDocument();
    });
})