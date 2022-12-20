import React, {useEffect, useState} from "react";
import axios from "axios";

import "../../styling/components/_playlistCards.scss";

const PlaylistCards = ({playlistName, mood, imageUrl, tracksEndpoint, playlistUrl, onPlaylistUpdate}) => {
    const [playlistObj, setPlaylistToAddObj] = useState({});
    const [style, setStyle] = useState({display: "none"});

    const handlePlaylistUpdate = (event) => {
        // Create an object and lift the object state to HomePage.
        
        /*
        private Long id;
        private String playlistName;
        private String mood;
        private String imageUrl;
        private String playlistUrl;
        private UserDto userDto;
        */
       
       // Needs name, playlistUrl, and mood for now.
       const playlistObj = {
           playlistName,
           playlistUrl,
           imageUrl,
           mood
        }
        onPlaylistUpdate(playlistObj);
    }

    return (
        <div class="playlist-cards-container" onClick={handlePlaylistUpdate}>
        <section className="playlist-card" 
            onMouseEnter={() => setStyle({display: "block"})}
            onMouseLeave={() => setStyle({display: "none"})}>
            <img src={imageUrl} class="playlist-images"/>
            <h3 className="playlist-card-header">{playlistName}</h3>
            <button className="add-button" style={style}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </section>
    </div>
    )
}

export default PlaylistCards