import { useEffect, useState } from 'react';
import DataTableShow from "../../../components/DataTableShow";
import { STATUS_INACTIVE } from "../../../lib/consts";
import { getMovieById, getShowsByMovieId } from "../../../lib/utils";
import { Link } from 'react-router-dom';
import Loader from '../../../components/UI/Loader';
import { useAuth } from '../../../lib/hooks/useAuth';

const generateShowsArray = (movieId, shows = []) => {
    return [
        {
            _id: shows && shows[0] ? shows[0]._id : 1,
            title: "Show 1",
            showStartTime: shows && shows[0] ? shows[0].showStartTime : "--:--",
            showEndTime: shows && shows[0] ? shows[0].showEndTime : "--:--",
            movieId: movieId,
            status: shows && shows[0] ? shows[0].status : STATUS_INACTIVE,
        },
        {
            _id: shows && shows[1] ? shows[1]._id : 2,
            title: "Show 2",
            showStartTime: shows && shows[1] ? shows[1].showStartTime : "--:--",
            showEndTime: shows && shows[1] ? shows[1].showEndTime : "--:--",
            movieId: movieId,
            status: shows && shows[1] ? shows[1].status : STATUS_INACTIVE,
        },
        {
            _id: shows && shows[2] ? shows[2]._id : 3,
            title: "Show 3",
            showStartTime: shows && shows[2] ? shows[2].showStartTime : "--:--",
            showEndTime: shows && shows[2] ? shows[2].showEndTime : "--:--",
            movieId: movieId,
            status: shows && shows[2] ? shows[2].status : STATUS_INACTIVE,
        },
    ];
}
const ShowsPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const movieId = queryParameters.get('movie') || null;
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchShowsAndMovie = async () => {
            if (!movieId) return;

            const { status, movie } = await getMovieById(movieId, token);
            const { showStatus, shows } = await getShowsByMovieId(movieId, token);
            if (status === 200) setMovie(movie);
            if (showStatus === 200) setShows(shows);

            setLoading(false);
        }
        fetchShowsAndMovie();
    }, [movieId]);

    useEffect(() => {
        setData(generateShowsArray(movieId, shows));
    }, [shows, movieId]);

    return (
        <>
            <main className="shows-page">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <div>
                        <h1 className="text-xl md:text-2xl lg:text:3xl">Shows</h1>
                    </div>
                    <Link
                        to="/admin/movies/"
                        className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        See All Movie
                    </Link>
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
                            <div className="shows-table-wrapper p-4 shadow-md mt-5">
                                <DataTableShow data={data} movieId={movieId} />
                            </div>
                        </>
                    )
                }
            </main>
        </>
    );
};

export default ShowsPage;
