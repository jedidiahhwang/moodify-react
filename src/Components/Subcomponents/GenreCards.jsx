import React from "react";

import "../../styling/components/_moodCards.scss";

const GenreCards = ({genre, onGenreUpdate}) => {

    const handleGenreClick = (event) => {
        console.log(event.target);
        onGenreUpdate(event.target.id);
    }

    return (
        <div class="about-cards-container" id={genre} onClick={handleGenreClick}>
            <section className="about-card" id={genre}>
                <h3 className="about-card-header">{genre}</h3>
            </section>
        </div>
    )
}

export default GenreCards