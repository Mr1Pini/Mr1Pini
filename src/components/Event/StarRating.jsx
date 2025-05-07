import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const StarRating = ({ eventId, onAverageRatingChange, onRatingsChange }) => {
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      if (user) {
        const ratingRef = doc(db, 'ratingOfEvents', `${eventId}_${user.uid}`);
        const ratingSnap = await getDoc(ratingRef);
        if (ratingSnap.exists()) {
          setRating(ratingSnap.data().rating);
        }
      }
    };
    fetchRating();
  }, [user, eventId]);

  const handleRate = async (value) => {
    if (!user) {
      alert('Увійдіть, щоб оцінити подію');
      return;
    }
  
    setRating(value);
  
    try {
      const response = await fetch(`/api/events/${eventId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          rating: value
        })
      });
  
      const data = await response.json();
      if (data.success) {
        if (onAverageRatingChange) {
          onAverageRatingChange(data.averageRating);
        }
        if (onRatingsChange) {
          onRatingsChange(data.ratings);
        }
      }else{
          console.log('Оцінка збережена. Нова середня оцінка:', data.averageRating);
      } 
    } catch (error) {
      console.error('Server error:', error);
    }
  };

  return (
    <div style={{ fontSize: '22px', marginTop: '10px' }}>
      {[1, 2, 3, 4, 5].map((num) => (
        <span
          key={num}
          style={{ color: num <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
          onClick={() => handleRate(num)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
