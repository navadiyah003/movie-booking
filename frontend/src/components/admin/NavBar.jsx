import { BiMoviePlay } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { TbReportSearch } from 'react-icons/tb'
import { RxDashboard } from 'react-icons/rx'
import { BsCheckCircle } from 'react-icons/bs'
const NavBar = () => {
  const { pathname } = useLocation();
  const startsWith = (str) => pathname.startsWith(str);
  return (
    <nav
      data-dev-hint="main navigation"
      className="flexjustify-between flex-col"
    >
      <div className="flex flex-col gap-3">
        <Link to="/admin" className={`${(pathname === "/admin") && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <RxDashboard size={20} />
            <div>Dashboard</div>
          </div>
        </Link>
        <Link to="/admin/movies" className={`${(startsWith("/admin/movies") || startsWith("/admin/shows")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <BiMoviePlay size={20} />
            <div>Movies</div>
          </div>
        </Link>
        <Link to="/admin/users" className={`${(startsWith("/admin/users")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <FiUsers size={20} />
            <div>Users</div>
          </div>
        </Link>
        <Link
          to={`/admin/bookings`}
          className={`${(startsWith("/admin/bookings")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className='flex justify-center items-center gap-4'>
            <BiMoviePlay size={20} />
            <div>Bookings </div>
          </div>
        </Link>
        <Link to="/admin/check-in" className={`${(startsWith("/admin/check-in")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <BsCheckCircle size={19} />
            <div>Check-In</div>
          </div>
        </Link>

        <hr className="border-gray-700 my-4" />

        <Link to="/admin/reports/movie-wise-report" className={`${(startsWith("/admin/reports/movie-wise-report")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <TbReportSearch size={20} />
            <div>Movies-wise Reports</div>
          </div>
        </Link>
        <Link to="/admin/reports/show-wise-report" className={`${(startsWith("/admin/reports/show-wise-report")) && "bg-skin-base"} flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}>
          <div className="flex justify-center items-center gap-4">
            <TbReportSearch size={20} />
            <div>Show-wise Reports</div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
