import Loader from './Loader';

const LoadingButton = ({ text = "Save", className = '', isLoading = false, onClick, icon = null, isDisable = false }) => {
    return (
        <>
            <button
                className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                type="submit"
                onClick={onClick}
                disabled={isLoading || isDisable}
            >
                <span className="w-[15px] h-[15px] absolute top-1/2 -translate-y-1/2 left-3">{isLoading ? <Loader className="w-full h-full" /> : icon}</span>
                {text}
            </button>
        </>
    )
}

export default LoadingButton;