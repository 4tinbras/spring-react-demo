import {Table} from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';

// @ts-ignore
export default function ContactsList({contacts, handleClick}) {
// @ts-ignore
  const listItems = contacts.map(contact => {

      console.log('on enter active is ' + contact.active);
      const props = {
          readOnly: undefined
      };
      if (contact.active !== true) {
          props.readOnly = contact.active
      }
      console.log(props);

      // TODO: via props readonly isn't picked up; via property it is always present
      return <ContactsRecord key={contact.uuid} contact={contact} handleClick={handleClick}></ContactsRecord>;
      }
  );

    const formsList = contacts.map(contact => {

        //TODO turn it into a custom object with defined submit form action
        return <form method="POST" id={`form${contact.uuid}`} name={`form${contact.uuid}`} key={`form${contact.uuid}`}
                     action={`https://localhost:8080/contact`}></form>
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
          <th scope="col">Person</th>
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
    return <tr>
        <td><input type="text" form={`form${contact.uuid}`}
                   defaultValue={contact.firstName + ' ' + contact.lastName}></input></td>
        <td><input type="text" form={`form${contact.uuid}`} defaultValue={contact.phoneNo}></input></td>
        <td><input type="text" form={`form${contact.uuid}`} defaultValue={contact.email}></input></td>
        <td><EditContactButton redirectionUrl={`/edit/${contact.uuid}`} contact={contact}
                               onClick={(event) => handleClick(event, contact)}></EditContactButton></td>
    </tr>;
}

export function EditContactButton({redirectionUrl, contact, onClick}) {
    return <button onClick={onClick} key={`Edit${contact.uuid}`}
                   form={`form${contact.uuid}`}>{contact.active ? `Save` : `Edit`}</button>;
}