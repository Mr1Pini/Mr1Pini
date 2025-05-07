import { useBooking } from '../../context/BookingContext'
import { useTheme } from '../../context/ThemeContext'

const BookingList = () => {
    const { bookings, cancelBooking } = useBooking()
    const { darkMode } = useTheme()

    if (bookings.length === 0) {
        return <p>Немає бронювань.</p>
    }

    return (
        <div>
            {bookings.map((booking) => (
                <div className={`booking ${darkMode ? 'dark-booking' : ''}`} key={booking.id}>
                    <h3>Event: {booking.event.title}</h3>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Date:</strong> {booking.event.date}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Location:</strong> {booking.event.location}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Price:</strong> {booking.event.price}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Email:</strong> {booking.email}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Phone:</strong> {booking.phone}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Tickets:</strong> {booking.ticketQuantity}</p>
                    <p className={darkMode ? 'dark-text' : ''}><strong>Total Price:</strong> {booking.totalPrice}</p>
                    <button
                        className="cancel-btn"
                        onClick={() => cancelBooking(booking.id)}
                    >
                        Скасувати
                    </button>
                </div>
            ))}
        </div>
    )
}

export default BookingList