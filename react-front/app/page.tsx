import ContactBlock from "@/app/ContactsBlock";
import NavBar from "@/app/NavBar";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

  return (
      <>
          <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
              crossOrigin="anonymous"
          />
          <div>
              <NavBar></NavBar>
              <div className={'container justify-content-center d-flex my-5'}>
                  <ContactBlock></ContactBlock>
              </div>
          </div>
      </>
  )


}
