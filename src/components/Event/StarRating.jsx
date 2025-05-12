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
  const [comment, setComment] = useState('');
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
          const data = ratingSnap.data();
          setRating(data.rating);
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
          rating: value,
          comment: comment.trim()
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

  const handleCommentSubmit = async () => {
    if (!user) {
      alert('Увійдіть, щоб залишити коментар');
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          rating,
          comment: comment.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setComment('');
        if (onAverageRatingChange) onAverageRatingChange(data.averageRating);
        if (onRatingsChange) onRatingsChange(data.ratings);
      }
    } catch (error) {
      console.error('Помилка відправлення коментаря:', error);
    }
  };


  return (
    <div className="stars-section">
      
  
      <div className="comment-container">
        <input
          type="text"
          className="comment-input"
          value={comment}
          placeholder="Залиште коментар..."
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Відправити</button>
      </div>

      <div className="stars-container">
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
    </div>
  );  
};

export default StarRating;
