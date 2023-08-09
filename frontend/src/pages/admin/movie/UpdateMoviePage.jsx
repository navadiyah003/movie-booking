import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../../components/UI/Loader';
import AddMovieForm from '../../../components/admin/AddMovieForm';
import { getMovieById } from '../../../lib/utils';
import { useAuth } from '../../../lib/hooks/useAuth';

const UpdateMoviePage = () => {
    const { id } = useParams();
    const [movieResponse, setMovieResponse] = useState({ movie: null, message: '', status: 0 });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const getMovie = async () => {
            const response = await getMovieById(id, token);
            setMovieResponse({ ...response });
            setLoading(false);
        }
        getMovie();
    }, [id]);

    if (loading) {
        return (
            <div className='w-full h-96 flex justify-center items-center'>
                <Loader />
            </div>
        )
    };
    return (
        <>
            <main className='movies-page'>
                {
                    movieResponse?.status !== 200 ? (
                        <>
                            <div className="h-96 flex justify-center items-center">
                                <div className='text-center space-y-4'>
                                    <h1 className='text-2xl'>{movieResponse?.message}</h1>
                                    <Link to="../movies/" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">Back to All Movie</Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl md:text-2xl lg:text:3xl">Update Movie</h1>
                                <Link to="/admin/movies/" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Movie</Link>
                            </div >
                            <div className="movies-table-wrapper">
                                <AddMovieForm movie={movieResponse.movie} />
                            </div>
                        </>
                    )
                }
            </main >
        </>
    )
}

export default UpdateMoviePage;