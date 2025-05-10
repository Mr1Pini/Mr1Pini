import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import BookingForm from '../Booking/BookingForm';
import StarRating from './StarRating';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const EventCard = ({ event }) => {
    const [showModal, setShowModal] = useState(false);
    const [averageRating, setAverageRating] = useState(null); 
    const { isEventBooked } = useBooking();
    const { darkMode } = useTheme();
    const booked = isEventBooked(event.title);
    const [ratings, setRatings] = useState([]);
    const [showRatings, setShowRatings] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const isPastEvent = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    };

    const pastEvent = isPastEvent();

    // тут рахується середня оцінка яке береться з базидиних
    
        const fetchRatings = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${apiUrl}/api/events/${event.id}/ratings?page=${currentPage}`);
                const data = await response.json();
                
                if (data.success) {
                    setAverageRating(data.averageRating);
                    setRatings(data.ratings);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
                setAverageRating('—');
            }
        };

        

    useEffect(() => {
        fetchRatings();        
    }, [event.id, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className={`event ${darkMode ? 'dark-event' : ''}`}>
            <h3>{event.title}</h3>
            <p><strong>Дата:</strong> {event.date}</p>
            <p><strong>Місце:</strong> {event.location}</p>
            <p><strong>Ціна:</strong> {event.price}</p>

            {/* <p><strong>Середня оцінка:</strong> {averageRating} ⭐</p> */}

            <button
                className={`book-btn ${booked ? 'booked' : ''} ${pastEvent ? 'past-event' : ''}`}
                disabled={booked || pastEvent}
                onClick={() => setShowModal(true)}
            >
                {booked ? "Заброньовано" : pastEvent ? "Подія минула" : "Забронювати"}
            </button>

            {/* середня цінкадля карток */}
            <div className="rating-wrapper">
                <StarRating 
                    eventId={event.id}
                    onAverageRatingChange={(newAvg) => setAverageRating(newAvg)}
                    onRatingsChange={(newRatings) => setRatings(newRatings)}
                />
                <span>({averageRating || '—'})</span>
                <button 
                    className="toggle-ratings"
                    onClick={() => setShowRatings(!showRatings)}
                >
                    {showRatings ? 'Сховати відгуки' : 'Показати відгуки'}
                </button>
            </div>

            {showRatings && (
                <div className="ratings-container">
                    <h4>Відгуки:</h4>
                    <ul className="ratings-list">
                        {ratings.map((rating, index) => (
                            <li key={index}>
                                <span className="rating-user">Користувач: {rating.email}</span>
                                <span className="rating-value">Оцінка: {rating.rating} ⭐</span>
                            </li>
                        ))}
                    </ul>
                    
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                Попередня
                            </button>
                            <span>Сторінка {currentPage} з {totalPages}</span>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Наступна
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showModal && !pastEvent && (
                <BookingForm
                    event={event}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default EventCard;
