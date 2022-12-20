import React from "react";

import "../../styling/components/_moodCards.scss";

const MoodCards = ({mood, onMoodUpdate}) => {

    const handleMoodClick = (event) => {
        console.log(event.target);
        onMoodUpdate(event.target.id)
    }

    return (
        <div class="about-cards-container" id={mood} onClick={handleMoodClick}>
            <section className="about-card" id={mood}>
                <h3 className="about-card-header">{mood}</h3>
            </section>
        </div>
    )
}

export default MoodCards