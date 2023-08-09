import { useState, useEffect } from 'react';
import { getMovieById, getShowsDetails } from '../../../lib/utils';
import ShowSeats from '../../../components/admin/ShowSeats';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Link } from 'react-router-dom';
import Loader from '../../../components/UI/Loader';

const SeatPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const movieId = queryParameters.get('movieId') || null;
    const showId = queryParameters.get('showId') || null;
    const authUser = useAuth();
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);
    const [show, setShow] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { movie } = await getMovieById(movieId, authUser?.token);
            const { show } = await getShowsDetails(movieId, showId, authUser?.token);

            if (movie) setMovie(movie);
            if (show) setShow(show);
            setLoading(false);
        }
        fetchData();
    }, [movieId, showId]);
    return (
        <main className='shows-seats-page'>
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                <div>
                    <h1 className="text-xl md:text-2xl lg:text:3xl">Seats for: {show?.title}</h1>
                </div>
                <Link to={`/admin/shows?movie=${movieId}`} className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Shows</Link>
            </div>
            {
                loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div>
                            <span className="font-semibold flex justify-center items-center py-5">
                                Movie : <span className="text-skin-base ml-2">{movie?.title || <Loader className={'w-[15px] h-[15px]'} />}</span>
                            </span>
                        </div>
                        <div className="shows-detail-wrapper pt-5">
                            <ShowSeats movieId={movie?._id} showId={showId} show={show} authUser={authUser} priceList={show?.price} />
                        </div>
                    </>
                )
            }
        </main>
    )
}

export default SeatPage;