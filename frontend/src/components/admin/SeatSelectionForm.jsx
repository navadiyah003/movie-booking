import ShowSeats from "./ShowSeats";

const SeatSelectionForm = ({ movieId, showId, show }) => {
    return (
        <>
            <ShowSeats movieId={movieId} showId={showId} show={show} />
        </>
    )
}

export default SeatSelectionForm;