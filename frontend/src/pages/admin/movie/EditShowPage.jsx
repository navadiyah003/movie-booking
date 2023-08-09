import { useEffect, useState } from "react";
import ShowDetailForm from "../../../components/admin/ShowDetailForm";
import { STATUS_ACTIVE } from "../../../lib/consts";
import { getMovieById, getShowsDetails } from "../../../lib/utils";
import { Link } from 'react-router-dom';
import Loader from "../../../components/UI/Loader";
import { useAuth } from "../../../lib/hooks/useAuth";

const EditShowPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const movieId = queryParameters.get('movieId') || null;
    const showTitle = queryParameters.get('showTitle') || null;
    const showId = queryParameters.get('showId') || null;
    const [movie, setMovie] = useState(null);
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchShowsAndMovie = async () => {
            const { movie } = await getMovieById(movieId, token);
            const { show } = await getShowsDetails(movieId, showId, token);

            if (movie) setMovie(movie);
            if (show) setShow(show);

            setLoading(false);
        }
        fetchShowsAndMovie();
    }, [movieId, showId]);

    return (
        <>
            <main className='shows-detail-page'>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl lg:text:3xl">Edit {showTitle}</h1>
                        <span className="font-medium">Movie: {movie?.title}</span>
                    </div>
                    <div className="space-x-4">
                        {show?.status === STATUS_ACTIVE && <Link to={`/admin/shows/edit-show/seats?movieId=${movieId}&showId=${showId}&showTitle=${showTitle}`} className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">Seats</Link>}
                        <Link to={`/admin/shows?movie=${movieId}`} className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Shows</Link>
                    </div>
                </div>

                {
                    loading ? (
                        <div className="flex justify-center items-center h-96">
                            <Loader />
                        </div>
                    ) : (
                        <div className="shows-detail-wrapper">
                            <ShowDetailForm movie={movie} showId={showId} show={show} showTitle={showTitle} />
                        </div>
                    )
                }
            </main>
        </>
    )
}

export default EditShowPage;