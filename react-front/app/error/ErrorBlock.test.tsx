import {render, screen} from "@testing-library/react";
import ErrorBlock, {ErrorDescriptor, ErrorLevel} from "@/app/error/ErrorBlock";


describe('ErrorBlock ', () => {
    it('for each input element creates valid hyperlink list item', async () => {

        const firstError: ErrorDescriptor = {
            id: "1",
            errorLevel: ErrorLevel.HardException,
            relatedField: "firstName",
            message: "Name cannot be empty"
        };
        const secondError: ErrorDescriptor = {
            id: "2",
            errorLevel: ErrorLevel.HardException,
            relatedField: "firstName",
            message: "Surname cannot be empty"
        };
        const errors = [firstError, secondError]
        render(<ErrorBlock errors={errors}/>);

        expect(screen.getByText("Name cannot be empty"));
        expect(screen.getByText("Surname cannot be empty"));
    })
})