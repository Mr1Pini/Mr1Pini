import { Link } from 'react-router-dom'
import PastEvents from '../components/Home/PastEvents'
import '../styles/home.css'

const HomePage = () => {
    return (
        <>
            <section>
                <div className="img-home">
                    <img src="/images/homeimage.jpg" alt="Початкове зображенняі" />
                </div>
                <div className="home-text">
                    <h3>Ласкаво просимо на платформу онлайн-бронювання квитків!</h3>
                    <p>Оберіть подію, забронюйте квиток і насолоджуйтесь незабутніми враженнями.</p>
                    <Link to="/events" className="btn">Переглянути події</Link>
                </div>
            </section>

            <PastEvents />

            <div className="conclusion">
                <h4>Якщо не хочеш пропустити наяскравіші події, бронюй білети з нами!</h4>
            </div>
        </>
    )
}

export default HomePage