import {render, screen} from "@testing-library/react";
import BlogPost from "@/app/about/blog/[postId]/BlogPost";

describe('Blog Post ', () => {

    const date = Date.now();

    it('shows image, author, date and full text', async () => {
        render(<BlogPost title={"Sample Title"} content={"Sample content of full text"}
                            author={"Joe Doe"} date={date}></BlogPost>)

        expect(screen.findByText('Sample Title'))
        expect(screen.findByText('Sample content of full text'))
        expect(screen.findByText('Joe Doe'))
        expect(screen.findByText(date))
    })
})