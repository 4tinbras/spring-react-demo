import {render, screen} from "@testing-library/react";
import PostSummary from "@/app/about/blog/PostSummary";

describe('Post summary ', () => {

    const date = Date.now();

    it('shows text, image, author, date and button to full text', async () => {
        render(<PostSummary title={"Sample Title"} textSample={"Sample content of full text"}
                            // imageSrc={undefined}
                            author={"Joe Doe"} date={date}></PostSummary>)

        expect(screen.findByText('Sample Title'))
        expect(screen.findByText('Sample content of full text'))
        expect(screen.findByText('Blog record image'))
        expect(screen.findByText('Joe Doe'))
        expect(screen.findByText(date))
    })
})