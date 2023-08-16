import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

import AuthentiCate from "./Authenticate";

import MoviesPage from "../pages/admin/movie/MoviesPage";
import AddMoviePage from "../pages/admin/movie/AddMoviePage";
import UpdateMoviePage from "../pages/admin/movie/UpdateMoviePage";
import ShowsPage from "../pages/admin/movie/ShowsPage";
import EditShowPage from "../pages/admin/movie/EditShowPage";
import BookingPage from "../pages/admin/user/BookingPage";
import SeatPage from "../pages/admin/movie/SeatPage";
import Bookings from "../pages/booking/Bookings";
import UsersPage from "../pages/admin/user/UsersPage";
import ReportsPageMovieWise from "../pages/admin/reports/ReportsPageMovieWise";

import ProfilePage from "../pages/users/ProfilePage";
import BookingsPage from "../pages/users/BookingsPage";
import BookingDetails from "../pages/users/BookingDetails";
import CheckIn from "../pages/check-in/CheckIn";
import AdminPanelLayout from "../components/admin/AdminPanelLayout";
import UserPanelLayout from "../components/user/UserPanelLayout";
import AdminBookingsPage from "../pages/admin/AdminBookingsPage";
import ReportsPageShowWise from "../pages/admin/reports/ReportsPageShowWise";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserPanelLayout><HomePage /></UserPanelLayout>,
        errorElement: <ErrorPage />,
    },
    {
        path: "login",
        element: <UserPanelLayout><LoginPage /></UserPanelLayout>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin",
        element: <AuthentiCate><AdminPanelLayout><div>admin</div></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies",
        element: <AuthentiCate><AdminPanelLayout><MoviesPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies/:id",
        element: <AuthentiCate><AdminPanelLayout><UpdateMoviePage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies/add",
        element: <AuthentiCate><AdminPanelLayout><AddMoviePage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows",
        element: <AuthentiCate><AdminPanelLayout><ShowsPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows/edit-show",
        element: <AuthentiCate><AdminPanelLayout><EditShowPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows/edit-show/seats",
        element: <AuthentiCate><AdminPanelLayout><SeatPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users",

        element: <AuthentiCate><AdminPanelLayout><UsersPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users/:userId",
        element: <AuthentiCate><AdminPanelLayout>sets</AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users/booking/:userId",
        element: <AuthentiCate><AdminPanelLayout><BookingPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/users/bookings/movie/:bookingId",
        element: <AuthentiCate><AdminPanelLayout><Bookings /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/bookings",
        element: <AuthentiCate><AdminPanelLayout><AdminBookingsPage /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/bookings/:bookingId",
        element: <AuthentiCate><AdminPanelLayout><BookingDetails /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/check-in",
        element: <AuthentiCate><AdminPanelLayout><CheckIn /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/reports/movie-wise-report",
        element: <AuthentiCate><AdminPanelLayout><ReportsPageMovieWise /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/reports/show-wise-report",
        element: <AuthentiCate><AdminPanelLayout><ReportsPageShowWise /></AdminPanelLayout></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/bookings",
        element: <AuthentiCate>
            <UserPanelLayout>
                <BookingsPage />
            </UserPanelLayout>
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/bookings/:bookingId",
        element: <AuthentiCate>
            <UserPanelLayout>
                <BookingDetails />
            </UserPanelLayout>
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/profile",
        element: <AuthentiCate>
            <UserPanelLayout>
                <ProfilePage />
            </UserPanelLayout>
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },



]);
export default router