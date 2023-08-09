
const EpmtyResource = () => {
    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div>
                    <img src="/no_data.svg" className="w-40 h-40 m-auto" alt="No Movie Found" />
                    <p className="text-center text-lg mt-2">No Movie Found</p>
                </div>
            </div>
        </>
    )
}

export default EpmtyResource;