import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { adminDb } from './src/firebase-admin.js';

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/events/:eventId/ratings', async (req, res) => {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const offset = (page - 1) * limit;

    const ratingsRef = adminDb.collection('ratingOfEvents');
    const snapshot = await ratingsRef.where('eventId', '==', eventId).get();

    const allRatings = [];
    const userIds = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      allRatings.push(data);
      userIds.add(data.userId);
    });

    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, item) => sum + item.rating, 0) / allRatings.length
      : 0;

    // Отримати emails по userIds
    const userEmails = {};
    const userPromises = Array.from(userIds).map(async userId => {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      if (userDoc.exists) {
        userEmails[userId] = userDoc.data().email;
      } else {
        userEmails[userId] = 'Невідомий';
      }
    });
    await Promise.all(userPromises);

    // Додати email до кожного рейтингу
    const enrichedRatings = allRatings.map(rating => ({
      ...rating,
      email: userEmails[rating.userId] || 'Невідомий'
    }));

    const paginatedRatings = enrichedRatings.slice(offset, offset + limit);

    res.json({
      success: true,
      averageRating: averageRating.toFixed(1),
      ratings: paginatedRatings,
      totalRatings: allRatings.length,
      currentPage: page,
      totalPages: Math.ceil(allRatings.length / limit)
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings'
    });
  }
});

app.post('/api/events/:eventId/rate', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, rating } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const now = new Date().toISOString();
    const ratingRef = adminDb.collection('ratingOfEvents').doc(`${eventId}_${userId}`);
    const docSnap = await ratingRef.get();

    if (docSnap.exists) {
      await ratingRef.set({
        ...docSnap.data(),
        rating,
        updatedAt: now
      });
    } else {
      await ratingRef.set({
        eventId,
        userId,
        rating,
        createdAt: now,
        updatedAt: now
      });
    }

    // Після запису повертаємо оновлену середню оцінку та рейтинг
    const snapshot = await adminDb
      .collection('ratingOfEvents')
      .where('eventId', '==', eventId)
      .get();

    const ratings = [];
    snapshot.forEach(doc => ratings.push(doc.data()));
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    // Пагінація для відгуків (опційно)
    const limit = 2; // Наприклад, обмеження для відгуків
    const paginatedRatings = ratings.slice(0, limit); // Якщо потрібно обмежити кількість

    res.json({ success: true, averageRating: avgRating.toFixed(1), ratings: paginatedRatings });

  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ success: false, message: 'Failed to save rating' });
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});