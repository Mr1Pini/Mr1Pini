const PastEvents = () => {
    return (
        <section className="popular-events">
            <h2>Події з якими ми співпрацювали</h2>
            <div className="event-held">
                <div className="held-event">
                    <h3>Концерт Imagine Dragons</h3>
                    <img src="/images/imagine dragons.jpg" alt="Фестиваль електронної музики" />
                    <p><strong>Дата:</strong> 15 квітня 2021</p>
                    <p><strong>Місце:</strong> Палац Спорту, Київ</p>
                    <p>Один із найочікуваніших концертів року! Гурт Imagine Dragons у турі.</p>
                </div>
                <div className="held-event">
                    <h3>Фестиваль електронної музики</h3>
                    <img src="/images/el music.jpeg" alt="Фестиваль електронної музики" />
                    <p><strong>Дата:</strong> 5 червня 2021</p>
                    <p><strong>Місце:</strong> Пляж Аркадія, Одеса</p>
                    <p>Найяскравіший фестиваль літа! Виступи топових діджеїв та незабутня атмосфера.</p>
                </div>
            </div>
        </section>
    )
}

export default PastEvents