import LogoutBtn from "../LogoutBtn";
import LoginForm from "../LoginForm";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import Logo from "../UI/Logo";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminPanelLayout = ({ children }) => {
    const { user, isAdmin } = useAuth();
    return (
        <>
            <div className="relative min-h-screen md:flex">
                <input type="checkbox" id="menu-open" className="hidden" />
                <label
                    htmlFor="menu-open"
                    className="absolute right-2 bottom-2 shadow-lg rounded-full p-2 bg-gray-100 text-gray-600 md:hidden"
                    data-dev-hint="floating action button"
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </label>
                <header
                    className="bg-gray-600 text-gray-100 flex justify-between md:hidden"
                    data-dev-hint="mobile menu bar"
                >
                    <Logo to="/admin" className="ml-5" />

                    <label
                        htmlFor="menu-open"
                        id="mobile-menu-button"
                        className="m-2 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md"
                    >
                        <svg
                            id="menu-open-icon"
                            className="h-6 w-6 transition duration-200 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <svg
                            id="menu-close-icon"
                            className="h-6 w-6 transition duration-200 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </label>
                </header>
                {/* desktop view */}
                <aside
                    id="sidebar"
                    className="bg-gray-800 text-gray-100 md:w-64 w-3/4 z-40 space-y-6 pt-6 px-0 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out  md:flex md:flex-col md:justify-between overflow-y-auto"
                    data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation"
                >
                    <div
                        className="flex flex-col space-y-6 relative h-full"
                        data-dev-hint="optional div for having an extra footer navigation"
                    >
                        <Logo to="/admin" className="ml-4" />

                        <NavBar />
                        <div className="absolute bottom-4 w-full">
                            <LogoutBtn />
                        </div>
                    </div>
                </aside>
                <main id="content" className="flex-1 p-6 lg:px-8 overflow-x-hidden">
                    <div className="sm:py-6">
                        <div className="">
                            {user && isAdmin ? children : <LoginForm />}
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                limit={1}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </>
    );
};

export default AdminPanelLayout;
