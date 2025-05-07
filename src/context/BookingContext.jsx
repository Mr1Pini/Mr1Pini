import { createContext, useState, useEffect, useContext } from 'react'

const BookingContext = createContext()

export const useBooking = () => useContext(BookingContext)

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([])
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        try {
            const savedBookings = localStorage.getItem('bookings')
            if (savedBookings) {
                setBookings(JSON.parse(savedBookings))
            }
        } catch (error) {
            console.error('Error loading bookings from localStorage:', error)
            setBookings([])
        } finally {
            setInitialized(true)
        }
    }, [])

    useEffect(() => {
        if (initialized) {
            try {
                localStorage.setItem('bookings', JSON.stringify(bookings))
            } catch (error) {
                console.error('Error saving bookings to localStorage:', error)
            }
        }
    }, [bookings, initialized])

    const addBooking = (booking) => {
        try {
            const bookingWithId = {
                ...booking,
                id: Date.now().toString()
            }
            setBookings(prevBookings => [...prevBookings, bookingWithId])
            return true
        } catch (error) {
            console.error('Error adding booking:', error)
            return false
        }
    }

    const cancelBooking = (id) => {
        try {
            setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id))
            return true
        } catch (error) {
            console.error('Error canceling booking:', error)
            return false
        }
    }

    const isEventBooked = (eventTitle) => {
        return bookings.some(booking => booking.event?.title === eventTitle)
    }

    return (
        <BookingContext.Provider value={{
            bookings,
            addBooking,
            cancelBooking,
            isEventBooked,
            initialized
        }}>
            {children}
        </BookingContext.Provider>
    )
}