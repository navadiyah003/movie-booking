import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Axios from '../../../lib/axiosInstance';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useFormik } from 'formik';
import LoadingButton from '../../../components/UI/LoadingButton';
import DataTableAdminReports from '../../../components/DataTableAdminReports';
import { getCurrencyFormat } from '../../../lib/utils';


const ReportsPageMovieWise = () => {
    const [movieTitleList, setmovieList] = useState([]);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const getAllMoviesTitle = () => {
        Axios('GET', '/movie/get-all-movie-title', null, { authRequest: true, token: token })
            .then((res) => {

                if (res.status === 200) {
                    const allMovies = res.data?.movies
                    const allOptions = allMovies?.map((movie) => {
                        return {
                            value: movie._id,
                            label: movie.title
                        }
                    })
                    console.log(allOptions);
                    setmovieList(allOptions);
                }
            })
            .finally(() => {
                // setLoading({ ...loading, movie: false });
            })
            .catch((err) => {
                console.log(err)
            });
    }
    const calculateTotalAmount = (data = [], field = "totalAmount") => {
        let total = 0;
        for (const entry of data) {
            // total += entry.total;
            total += entry[`${field}`];
        }

        return total;
    }

    useEffect(() => {
        getAllMoviesTitle()
    }, []);

    // Handle Form
    const formik = useFormik({
        initialValues: {
            movie: '',
            date: '',
        },
        onSubmit: (values) => {
            setLoading(true);
            Axios('GET', `/movie/daily-booking-reports/?movieId=${values?.movie}&date=${values?.date}`, null, { authRequest: true, token: token })
                .then((res) => {
                    if (res.status === 200) {
                        const allMovies = res?.data;
                        console.log('allMovies', allMovies);
                        setReport(allMovies);
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('err', err)
                });
        }
    });

    const handleMovieChange = (e) => {
        formik.setFieldValue('movie', e?.value || '');
        if (!e) setReport([]);
    }

    return (
        <div>
            <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
                <h1 className="text-xl md:text-2xl lg:text:3xl">Movies-wise Reports</h1>
            </div>
            <form className='w-full flex flex-col md:flex-row justify-start items-center gap-4 py-4 mb-2' onSubmit={formik.handleSubmit}>
                <Select onChange={handleMovieChange} placeholder="Select Movie" className='min-w-[300px]' options={movieTitleList} isClearable />
                {/* <Select onChange={handleShowChange} placeholder="Select Show" className='min-w-[300px]' options={showsList} isClearable /> */}
                <input
                    type="date"
                    name='date'
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    className={`min-w-[300px] block text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white`}
                />
                <LoadingButton isLoading={loading} text={"Generate Report"} isDisable={formik.values.movie === ""} />
            </form>

            <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
                <DataTableAdminReports data={report?.dailyReports || []} />
                {report?.dailyReports && report?.dailyReports?.length !== 0 && (
                    <>
                        <div className='text-lg'>Total Revenue: {getCurrencyFormat(calculateTotalAmount(report?.dailyReports, "totalAmount"))}</div>
                        <div className='text-lg'>Total Bookings: {calculateTotalAmount(report?.dailyReports, "totalBookings")}</div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ReportsPageMovieWise;