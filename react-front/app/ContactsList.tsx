import {Table} from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';

// @ts-ignore
export default function ContactsList({contacts, handleClick}: { ContactState, any }) {

// @ts-ignore
  const listItems = contacts.map(contact => {

      const props = {
          readOnly: undefined
      };
      if (contact.active !== true) {
          props.readOnly = contact.active
      }

      // TODO: via props readonly isn't picked up; via property it is always present
      return <tr key={`${contact.uuid}`}>
          <ContactsRecord key={`${contact.uuid}records`} contact={contact} handleClick={handleClick}></ContactsRecord>
          {/*needs to set status text based on cell state*/}
          <th>Prompt</th>
      </tr>;
      }
  );

    const formsList = contacts.map(contact => {

        //TODO turn it into a custom object with defined submit form action
        return <form id={`form${contact.uuid}`} name={`form${contact.uuid}`} key={`form${contact.uuid}`}
                     onSubmit={(event) => {
                         useSubmitForm(`https://localhost:8080/contact`, fieldsArray)
                     }}></form>
    });

    return <div>
        <div>
            {formsList}
        </div>
        <Table className={"table-striped-columns"}>
      <caption>
          Known contacts
      </caption>
      <thead>
      <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Phone no.</th>
          <th scope="col">Email address</th>
      </tr>
      </thead>
      <tbody>
        {listItems}
      </tbody>
        </Table>
    </div>
}

export function ContactsRecord({contact, handleClick}) {
    return <>
        <td><input type="text" name="first-name" form={`form${contact.uuid}`} defaultValue={contact.firstName}></input>
        </td>
        <td><input type="text" name="last-name" form={`form${contact.uuid}`} defaultValue={contact.lastName}></input>
        </td>
        <td><input type="text" name="phone-no" form={`form${contact.uuid}`} defaultValue={contact.phoneNo}></input></td>
        <td><input type="text" name="email" form={`form${contact.uuid}`} defaultValue={contact.email}></input></td>
        <td><EditContactButton redirectionUrl={`/edit/${contact.uuid}`} contact={contact}
                               onClick={(event) => handleClick(event, contact)}></EditContactButton></td>
        <td hidden><input hidden readOnly type="text" name="uuid" form={`form${contact.uuid}`}
                          defaultValue={contact.uuid}></input></td>
    </>;
}

export function EditContactButton({redirectionUrl, contact, onClick}) {
    return <button onClick={onClick} key={`Edit${contact.uuid}`}
                   form={`form${contact.uuid}`}>{contact.active ? `Save` : `Edit`}</button>;
}
