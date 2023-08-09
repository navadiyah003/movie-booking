import Logo from "../components/UI/Logo";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <>
            <section className="flex items-center min-h-screen mx-auto lg:justify-center px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col overflow-hidden rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
                    <div className="p-4 py-6 text-skin-muted bg-gray-800 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
                        <div className="my-3 text-4xl font-bold tracking-wider text-center text-skin-inverted">
                            <Logo />
                        </div>
                        <p className="mt-6 font-normal text-center md:mt-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. In commodi odit modi repudiandae autem, aliquam?
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </section>
        </>
    )
}

export default LoginPage;