import { Link } from "react-router-dom";
import EpmtyResource from "./UI/EpmtyResource";
import { displayDate } from "../lib/utils";

const MovieCard = ({ movie }) => {
    return (
        <>
            {
                movie ? (
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div key={movie._id} className="card shadow p-2 rounded-md">
                            <img src={`${movie.poster}`} alt={movie.title} />
                            <div className="card-body">
                                <h2 className="card-title text-lg font-semibold mb-2">{movie.title}</h2>
                                <p className="truncate-2-lines text-sm text-gray-600 mb-2">{movie.description}</p>
                                <p className="text-sm text-gray-600 mb-2">Release Date: {displayDate(movie.releaseDate)}</p>
                                <Link to={`/book/${movie._id}`} className="block text-center shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative">Book</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EpmtyResource />
                )
            }
        </>
    )
}

export default MovieCard