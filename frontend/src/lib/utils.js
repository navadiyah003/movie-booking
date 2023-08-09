import moment from "moment";
import { API_ROOT } from "./consts";

export const getDataUriOfImage = (file = null) => {
    if (!file) return '';

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const displayDate = (dateString, format = "Do MMM, YYYY") => {
    return moment(dateString).format(format);
}

export const displayTime = (timeIn12hrs, format = "hh:mm A") => {
    if (timeIn12hrs === "--:--") return timeIn12hrs;
    return moment(timeIn12hrs, "hh:mm A").format(format);
}

export const isPastDate = (dateString) => {
    if (!dateString) return true;
    return moment(dateString).isBefore(moment());
}

export const getCurrencyFormat = (amount, countryCode = "INR") => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: countryCode,
    }).format(amount);
}

export const getPriceBySeatNumber = (seatNumber, priceList) => {
    const firstChar = seatNumber?.charAt(0)?.toUpperCase();

    if (['A', 'B', 'C'].includes(firstChar)) {
        return priceList.priceRow_a_to_c;
    } else if (['D', 'E', 'F', 'G', 'H'].includes(firstChar)) {
        return priceList.priceRow_d_to_h;
    } else if (['I', 'J', 'K', 'L', 'M', 'N'].includes(firstChar)) {
        return priceList.priceRow_i_to_n;
    }
    return 0;
}

export const getSeatPriceObj = (selectedSeats, priceList) => {
    if (!selectedSeats || !priceList) return {};
    const seatPriceObj = selectedSeats.map((seat) => {
        return {
            seatNo: seat,
            price: getPriceBySeatNumber(seat, priceList),
        }
    });
    return seatPriceObj;
}

export const organizeSeatsByStatus = (seats = []) => {
    const result = {};

    seats.forEach((seat) => {
        const { status, seatNo, price } = seat;

        if (!result[status]) {
            result[status] = {
                seatNo: [],
                totalPrice: 0,
            };
        }

        result[status].seatNo.push(seatNo);
        result[status].totalPrice += price;
    });

    return result;
}

export const userProfileImage = (user) => {
    if (!user) return '';
    if (user.profileImage) {
        return (
            <img
                className="h-8 w-8 rounded-full"
                src={user.profileImage}
                alt={user.name}
            />
        )
    }
    const initials = user.name ? user.name.charAt(0) : "U";
    return (
        <div title={user.name} className="h-8 w-8 rounded-full capitalize bg-skin-base flex items-center justify-center text-white">
            {initials}
        </div>
    );
}

export const lowResImageUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('cloudinary')) return imageUrl;
    return imageUrl.replace('image/upload', 'image/upload/c_fill,h_150,w_150');
}


/** API methods */
export const getAllMovies = async (token) => {
    const res = await fetch(`${API_ROOT}/movie/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        movies: data.movies,
    }
}

export const getMovieById = async (movieId, token) => {
    if (!movieId) return {};
    const res = await fetch(`${API_ROOT}/movie/${movieId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        statusText: res.statusText,
        message: data.message,
        error: data.error,
        movie: data.movie || null,
    }
}

export const getShowsByMovieId = async (movieId, token) => {
    if (!movieId) return {};
    const res = await fetch(`${API_ROOT}/user/getAllShowsForMovie/${movieId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        showStatus: res.status,
        showMessage: res.statusText,
        message: data.message,
        error: data.error,
        shows: data.shows || null,
    }
}

export const getShowsDetails = async (movieId, showId, token) => {
    if (!movieId || !showId) return {};
    const res = await fetch(`${API_ROOT}/user/getShow/${movieId}/${showId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        statusText: res.statusText,
        message: data.message,
        error: data.error,
        show: data.show || null,
    }
}

export const getSeatsForShow = async (movieId, showId, token) => {
    if (!movieId || !showId) return [];
    const res = await fetch(`${API_ROOT}/user/get-all-seats-details/${movieId}/${showId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        ...data,
    }
}

export const getAllUsers = async (token) => {
    const res = await fetch(`${API_ROOT}/user/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        users: data.users,
    }
}

export const getAllUserBookings = async (userId, token) => {
    const res = await fetch(`${API_ROOT}/user/get-all-booked-movie/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        bookings: data.bookings,
    }
}

export const getAdminBookings = async (userId, token) => {
    const res = await fetch(`${API_ROOT}/booking/get-all-bookings/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        bookings: data.bookings,
        reserved: data.reservedSeats,
    }
}