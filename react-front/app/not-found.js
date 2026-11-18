import Link from 'next/link'

export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>We couldn't find resource you requested. Please use navigation buttons to chose available content.</p>
            <Link href="/" className={'link-button'}>Return Home</Link>
        </div>
    )
}