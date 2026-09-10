import {render, screen} from "@testing-library/react";
import AccountInspection from "@/app/account/AccountInspection";


describe('AccountInspection ', () => {
    it('for an end-user view shows his own details', async () => {
        render(<AccountInspection
            inspectedAccount={{uuid: "1", ownersFirstName: "Tom", ownersSurname: "Smith", contactDetails: []}}
            inspectorIsAdmin={false}>
        </AccountInspection>)

        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration')).not.toBeInTheDocument();
    })

    it('for an admin view shows his own details as well as admin options', async () => {
        render(<AccountInspection
            inspectedAccount={{uuid: "1", ownersFirstName: "Tom", ownersSurname: "Smith", contactDetails: []}}
            inspectorIsAdmin={true}>
        </AccountInspection>)

        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration')).toBeInTheDocument();
    })
})