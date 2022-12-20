import React from "react";
import {Routes, Route} from "react-router-dom";

import LandingPage from "../Components/LandingPage";
import TopArtists from "../Components/TopArtists";
import HomePage from "../Components/HomePage";

/*
    Couple differences between React Router v5 and v6...

    - No longer need exact path.
    - Components are written as JSX.
*/

export default (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/current-user" element={<HomePage />} />
    </Routes>
)