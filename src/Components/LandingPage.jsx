import React from "react";
import axios from "axios";

import "../styling/_landingPage.scss";
import "../styling/components/_loginButton.scss";

const LandingPage = () => {   

    const getSpotifyUserLogin = () => {
        axios.get("http://localhost:8080/api/spotify/login")
            .then((response) => {
                console.log(response);
                window.location.replace(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div id="landing-main-div">
            <section id="main-section">
                <h1 id="title-header">Moodify</h1>
                <h2 id="subtitle-header">How are you feeling today?</h2>
                <div>
                    <button class="primary-buttons" id="login-button" onClick={getSpotifyUserLogin}>Get Started</button>
                    <button class="primary-buttons" id="about-button">Learn More</button>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;