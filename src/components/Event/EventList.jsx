import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventFilter from './EventFilter';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortOption, setSortOption] = useState('date-asc');
  const [selectedType, setSelectedType] = useState('all');
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Отримуємо події з Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Помилка при завантаженні подій:", error);
      }
    };

    fetchEvents();
  }, []);

  const eventTypes = [...new Set(events.map(event => event.type))];

  // Фільтрація та сортування
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [...events];

    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    if (!showPastEvents) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'price-asc':
          return parseInt(a.price) - parseInt(b.price);
        case 'price-desc':
          return parseInt(b.price) - parseInt(a.price);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, selectedType, sortOption, showPastEvents]);

  const togglePastEvents = () => {
    setShowPastEvents(prev => !prev);
  };

  return (
    <section>
      <h2>Події</h2>

      <div className="filter-controls">
        <EventFilter
          onSortChange={setSortOption}
          onTypeChange={setSelectedType}
          types={eventTypes}
          currentType={selectedType}
          currentSort={sortOption}
        />

        <div className="show-past-events">
          <label>
            <input
              type="checkbox"
              checked={showPastEvents}
              onChange={togglePastEvents}
            />
            Показувати минулі події
          </label>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))
        ) : (
          <p className="no-events">Немає запланованих подій вибраного типу</p>
        )}
      </div>
    </section>
  );
};

export default EventList;
