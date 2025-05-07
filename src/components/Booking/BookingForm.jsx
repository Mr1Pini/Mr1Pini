import { useState, useEffect, useRef } from 'react'
import { useBooking } from '../../context/BookingContext'
import { useTheme } from '../../context/ThemeContext'

const BookingForm = ({ event, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(600)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ticketQuantity: 1
    })
    const { addBooking } = useBooking()
    const { darkMode } = useTheme()
    const timerRef = useRef(null)

    const priceNumber = parseInt(event.price.replace(/\D/g, ''))
    const totalPrice = priceNumber * formData.ticketQuantity

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    onClose()
                    alert('Час на бронювання вийшов!')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [onClose])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearInterval(timerRef.current)

        const bookingData = {
            event,
            ...formData,
            totalPrice: `${totalPrice} грн`
        }

        addBooking(bookingData)
        onClose()
        alert('Бронювання підтверджено!')
        window.location.href = '/booking'
    }

    return (
        <div className={`modal ${darkMode ? 'dark-modal' : ''}`}>
            <div className={`modal-content ${darkMode ? 'dark-modal-content' : ''}`}>
                <span className="close" onClick={() => {
                    clearInterval(timerRef.current)
                    onClose()
                    alert('Бронювання скасовано!')
                }}>&times;</span>

                <h3>Book Tickets</h3>

                <form id="booking-form" onSubmit={handleSubmit}>
                    <p id="timer">Час на підтвердження: {timeLeft} секунд</p>

                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="ticketQuantity">Number of Tickets:</label>
                    <input
                        type="number"
                        id="ticketQuantity"
                        name="ticketQuantity"
                        min="1"
                        value={formData.ticketQuantity}
                        onChange={handleChange}
                        required
                    />

                    <p><strong>Total Price: </strong><span id="total-price">{totalPrice} грн</span></p>

                    <button type="submit">Confirm Booking</button>
                </form>
            </div>
        </div>
    )
}

export default BookingForm