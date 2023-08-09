import { useEffect, useState } from "react";
import { displayDate } from "../../lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "../../lib/axiosInstance";
import { useAuth } from "../../lib/hooks/useAuth";
import LoadingButton from "../UI/LoadingButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ShowDetailForm = ({ movie, showId, show, showTitle }) => {
    const [loading, setLoading] = useState(false);
    const [showData, setShowData] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();
    const formik = useFormik({
        initialValues: {
            sTime: showData?.showStartTime || '--:--',
            eTime: showData?.showEndTime || '--:--',
            priceRow_a_to_c: showData?.price?.priceRow_a_to_c || '10',
            priceRow_d_to_h: showData?.price?.priceRow_d_to_h || '20',
            priceRow_i_to_n: showData?.price?.priceRow_i_to_n || '30',
        },
        validationSchema: Yup.object({
            sTime: Yup.string().required('Please Enter Movie Title'),
            eTime: Yup.string().required('Please Enter Movie Description'),
            priceRow_a_to_c: Yup.string().required('Please Enter Price'),
            priceRow_d_to_h: Yup.string().required('Please Enter Price'),
            priceRow_i_to_n: Yup.string().required('Please Enter Price'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const show = {
                ...values,
                title: showTitle,
                sTime: values.sTime,
                eTime: values.eTime,
                price: {
                    priceRow_a_to_c: values.priceRow_a_to_c,
                    priceRow_d_to_h: values.priceRow_d_to_h,
                    priceRow_i_to_n: values.priceRow_i_to_n,
                },
            };
            // const seatsObjArr = seatStore?.seat?.selected[`${movie?._id}`]?.map((seat) => {
            //     return {
            //         seatNo: seat,
            //         price: getPriceBySeatNumber(seat, values)
            //     }
            // });
            // show.seats = seatsObjArr;
            if (showId?.length > 2) {
                // Update Show
                Axios('PUT', `/show/${movie._id}/${showId}`, show, { authRequest: true, token: token })
                    .then((request) => {
                        console.log('request', request);
                        toast.success('Show Updated Successfully');
                    })
                    .finally(() => {
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log('erroe', err.message);
                        toast.error(`${err.message}`);
                    });
            } else {
                // Create Show
                Axios('POST', `/show/${movie._id}`, [show], { authRequest: true, token: token })
                    .then((request) => {
                        console.log('request', request);
                        toast.success('Show Created Successfully');
                        navigate(-1);
                    })
                    .finally(() => {
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log('erroe', err.message);
                        toast.error(`${err.message}`);
                    });
            }
        }
    });

    useEffect(() => {
        if (show) {
            formik.setValues({
                sTime: show.showStartTime || '10:00',
                eTime: show.showEndTime || '12:00',
                priceRow_a_to_c: show.price.priceRow_a_to_c || '10',
                priceRow_d_to_h: show.price.priceRow_d_to_h || '20',
                priceRow_i_to_n: show.price.priceRow_i_to_n || '30',
            });
            setShowData(show);
        }
    }, [show]);

    return (
        <>
            <form className="w-full" onSubmit={formik.handleSubmit}>
                <div className="text-sm">
                    <span>Date: {movie?.releaseDate !== '' && displayDate(movie?.releaseDate)}</span>
                </div>
                <div className="flex flex-wrap my-6">
                    <div className="w-full">
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-0">
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="show-start-time">
                                        Show Start Time
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.sTime && formik.errors.sTime) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="time"
                                        name="sTime"
                                        value={formik.values.sTime}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.sTime && formik.errors.sTime) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.sTime}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="show-end-time">
                                        Show End Time
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.eTime && formik.errors.eTime) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-end-time"
                                        type="time"
                                        name="eTime"
                                        value={formik.values.eTime}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.eTime && formik.errors.eTime) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.eTime}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <p className="text-gray-700 text-lg font-bold mb-2">Price</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-0">
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="row-a-c">
                                        Row <span className="text-skin-base">A - C</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_a_to_c && formik.errors.priceRow_a_to_c) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="row-a-c"
                                        type="number"
                                        name="priceRow_a_to_c"
                                        value={formik.values.priceRow_a_to_c}
                                        onChange={formik.handleChange}
                                        min={10}
                                        max={30}
                                    />
                                    {
                                        (formik.touched.priceRow_a_to_c && formik.errors.priceRow_a_to_c) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_a_to_c}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="row-d-h">
                                        Row <span className="text-skin-base">D - H</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_d_to_h && formik.errors.priceRow_d_to_h) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="row-d-h"
                                        type="number"
                                        name="priceRow_d_to_h"
                                        value={formik.values.priceRow_d_to_h}
                                        onChange={formik.handleChange}
                                        min={10}
                                        max={30}
                                    />
                                    {
                                        (formik.touched.priceRow_d_to_h && formik.errors.priceRow_d_to_h) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_d_to_h}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="row-i-n">
                                        Row <span className="text-skin-base">I - N</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_i_to_n && formik.errors.priceRow_i_to_n) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="row-i-n"
                                        type="number"
                                        name="priceRow_i_to_n"
                                        value={formik.values.priceRow_i_to_n}
                                        onChange={formik.handleChange}
                                        min={10}
                                        max={30}
                                    />
                                    {
                                        (formik.touched.priceRow_i_to_n && formik.errors.priceRow_i_to_n) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_i_to_n}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full px-0 py-4 md:py-3">
                        <LoadingButton isLoading={loading} text="Save Show" />
                    </div>

                </div>
            </form>
        </>
    )
}

export default ShowDetailForm;