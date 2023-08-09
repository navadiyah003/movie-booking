import { Link } from "react-router-dom"

const Logo = ({ to = '/', className = '' }) => {
    return (
        <>
            <Link
                to={to}
                className={`text-white font-bold flex items-center space-x-2 ${className}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 flex-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
                <span className="text-2xl font-extrabold whitespace-nowrap truncate">
                    IWS
                </span>
            </Link>
        </>
    )
}

export default Logo;