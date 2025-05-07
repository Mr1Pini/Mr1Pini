const EventFilter = ({ onSortChange, onTypeChange, types }) => {
    return (
        <div className="event-filters">
            <div className="filter-group">
                <label htmlFor="sort">Сортувати за:</label>
                <select id="sort" onChange={e => onSortChange(e.target.value)}>
                    <option value="date-asc">Дата (від ранніх до пізніх)</option>
                    <option value="date-desc">Дата (від пізніх до ранніх)</option>
                    <option value="price-asc">Ціна (від дешевих до дорогих)</option>
                    <option value="price-desc">Ціна (від дорогих до дешевих)</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="type">Тип заходу:</label>
                <select id="type" onChange={e => onTypeChange(e.target.value)}>
                    <option value="all">Всі типи</option>
                    {types.map(type => (
                        <option key={type} value={type}>
                            {type === 'concert' ? 'Концерти' :
                                type === 'theater' ? 'Театри' :
                                    type === 'festival' ? 'Фестивалі' :
                                        type === 'comedy' ? 'Комедія' : type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default EventFilter