export default function LoginBlock({setAccessToken}: { setAccessToken: any }) {
    return (
        <>
            <form>
                <label>Username</label>
                <input type={'text'}/>
                <label>Password</label>
                <input type={'password'}/>
            </form>
        </>
    )
}