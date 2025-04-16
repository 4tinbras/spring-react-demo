import {Table} from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';

// @ts-ignore
export default function ContactsList({contacts}) {
  console.log(contacts);
// @ts-ignore
  const listItems = contacts.map(contact => {

        return <tr key={contact.uuid}>
            <td>{contact.firstName + ' ' + contact.lastName}</td>
            <td>{contact.phoneNo}</td>
            <td>{contact.email}</td>
        </tr>;
      }
  );
  return <Table className={"table-striped-columns"}>
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
  </Table>;
}