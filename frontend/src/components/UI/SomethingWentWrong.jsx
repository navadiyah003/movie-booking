
const SomethingWentWrong = ({ className, text, textClassNames }) => {
    return (
        <>
            <div role="status" className={`flex flex-col justify-center items-center gap-4 text-skin-inverted ${className}`}>
                <img src="/images/movies.png" alt="Something Went Wrong" className={`max-w-[206px] max-h-[150px] w-full h-full text-gray-200 dark:text-gray-600 fill-skin-base`} />
                <span className="sr-only">{text || "Something Went Wrong, Please try again..."}</span>
                <span className={`text-center capitalize text-gray-500 ${textClassNames}`}>{text || "Something Went Wrong, Please try again..."}</span>
            </div>
        </>
    )
}

export default SomethingWentWrong;