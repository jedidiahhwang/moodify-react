import React, {useEffect, useState} from "react";
import axios from "axios";

import MoodCards from "./Subcomponents/MoodCards";
import GenreCards from "./Subcomponents/GenreCards";
import PlaylistCards from "./Subcomponents/PlaylistCards";

import "../styling/_homePage.scss";

const HomePage = () => {
    const [currentUser, setCurrentUser] = useState(); // Object containing all user info.
    const [currentUserId, setCurrentUserId] = useState(); // Number for curent logged in user.
    const [currentSelection, setCurrentSelection] = useState("Select Mood");
    const [mood, setMood] = useState();
    const [genre, setGenre] = useState();
    const [playlist, setPlaylistToAdd] = useState([]); // Used for adding one playlist to the user.
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([]); // Used for Spotify playlists.
    const [userPlaylists, setUserPlaylists] = useState([]); // Used for user's playlist.
    const [tracksPlaylists, setTracksPlaylist] = useState(); // Used for playlist whose tracks you are accessing.

    useEffect(() => {
        console.log("Activating useEffect");
        // If user hasn't selected a mood or genre, grab the user's profile.
        if(!mood && !genre) {
            axios.get("http://localhost:8080/api/spotify/current-user-profile")
                .then((res) => {
                    console.log(res.data);
                    console.log(res.data[5]);
                    // Set the state for current user.
                    setCurrentUser(res.data);
                    setCurrentUserId(res.data[5]);
                    // Send another request to set the playlists associated with that user.
                    axios.get(`http://localhost:8080/playlist/getPlaylists/${res.data[5]}`)
                        .then((res) => {
                            console.log(res.data);

                            setUserPlaylists(res.data);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        // Once the mood and genre are selected, send a request to grab a playlist with the mood and genres.
        } else if(mood && genre) {
            console.log("Mood and genre selected");
            axios.get(`http://localhost:8080/api/spotify/get-spotify-playlists/?mood=${mood}&genre=${genre}`)
                .then((res) => {
                    console.log(res.data.playlists);
                    // Set the state for all 20 playlists coming back from Spotify API.
                    setSpotifyPlaylists(res.data.playlists.items);
                })
        }
    }, [mood, genre])

    // Set state for which button is selected.
    const handleClick = (event) => {
        event.preventDefault();

        switch (event.target.id) {
            case "mood-button":
                setCurrentSelection("Select Mood");
                break;
            case "genre-button":
                setCurrentSelection("Select Genre");
                break;
            case "playlists-button":
                setCurrentSelection("Select Playlist");
                break;
        };
    }

    // Set state for mood selected.
    const handleMoodUpdate = (selectedMood) => {
        console.log(selectedMood);
        setMood(selectedMood);
        setCurrentSelection("Select Genre");
    }

    // Set state for genre selected.
    const handleGenreUpdate = (selectedGenre) => {
        console.log(selectedGenre);
        setGenre(selectedGenre);
        setCurrentSelection("Select Playlist");
    }

    // Set state for playlist selected to add to user.
    const handlePlaylistUpdate = (selectedPlaylist) => {
        setPlaylistToAdd(selectedPlaylist);
        console.log(selectedPlaylist);
        
        axios.post(`http://localhost:8080/playlist/addPlaylist/?userId=${currentUserId}&moodId=${selectedPlaylist.moodId}`, selectedPlaylist)
            .then((res) => {
                console.log(res.data);
                setUserPlaylists(res.data);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    // Set state for playlist selected to access tracks for.
    const handlePlaylistSelected = (selectedPlaylistId) => {
        console.log(selectedPlaylistId);
        
        axios.get(`http://localhost:8080/api/spotify/getPlaylistTracks/${selectedPlaylistId}`)
        .then((res) => {
                console.log(res.data.items);
                setTracksPlaylist(res.data.items);
                setCurrentSelection("Playlist Tracks");
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div id="homepage-main-div">
            <header id="homepage-header">
                {
                    currentUser !== undefined ? 
                    <>
                        <img src={currentUser[4]} />
                        <h1>Welcome, {currentUser[0]}</h1>
                        <button id="mood-button" onClick={handleClick}>Mood</button>
                        <button id="genre-button" onClick={handleClick}>Genre</button>
                        <button id="playlists-button"onClick={handleClick}>Playlists</button>
                    </>
                    : null
                }
                {
                    currentSelection === "Mood and Genre" ?
                    <>
                        <h2>{mood}</h2>
                        <h2>{genre}</h2>
                    </>
                    : null
                }
            </header>
            <nav id="homepage-sidebar">
                <h1>Playlists</h1>
                <select id="mood-select">
                    <option value="all">All Moods</option>
                    <option value="sad">Sad</option>
                    <option value="anxious">Anxious</option>
                    <option value="cheerful">Cheerful</option>
                    <option value="empty">Empty</option>
                    <option value="frustrated">Frustrated</option>
                    <option value="hyped">Hyped</option>
                    <option value="idyllic">Idyllic</option>
                    <option value="infatuated">Infatuated</option>
                    <option value="lonely">Lonely</option>
                    <option value="melancholy">Melancholy</option>
                    <option value="optimistic">Optimistic</option>
                    <option value="tense">Tense</option>
                </select>
                {
                    userPlaylists.length > 0 ?
                        userPlaylists.map((playlist, index) => {
                            const playlistId = playlist.playlistUrl.split("/")[4];
                            return <p key={index} id={playlistId} onClick={() => handlePlaylistSelected(playlistId)}>{playlist.playlistName}</p>
                        })
                    : null
                }
            </nav>
            <main id="homepage-content-holder">
            {
                currentSelection === "Select Mood" ?
                    <>
                        <MoodCards id="sad-mood-card" mood="Sad" onMoodUpdate={handleMoodUpdate}/>
                        <MoodCards id="anxious-mood-card" mood="Anxious"/>
                        <MoodCards id="cheerful-mood-card "mood="Cheerful"/>
                        <MoodCards id="empty-mood-card" onMoodUpdate={handleMoodUpdate} mood="Empty"/>
                        <MoodCards id="frustrated-mood-card" onMoodUpdate={handleMoodUpdate} mood="Frustrated"/>
                        <MoodCards id="hyped-mood-card" onMoodUpdate={handleMoodUpdate} mood="Hyped"/>
                        <MoodCards id="idyllic-mood-card" onMoodUpdate={handleMoodUpdate} mood="Idyllic"/>
                        <MoodCards id="infatuated-mood-card" onMoodUpdate={handleMoodUpdate} mood="Infatuated"/>
                        <MoodCards id="lonely-mood-card" onMoodUpdate={handleMoodUpdate} mood="Lonely"/>
                        <MoodCards id="melancholy-mood-card" onMoodUpdate={handleMoodUpdate} mood="Melancholy"/>
                        <MoodCards id="optimistic-mood-card" onMoodUpdate={handleMoodUpdate} mood="Optimistic"/>
                        <MoodCards id="tense-mood-card" onMoodUpdate={handleMoodUpdate} mood="Tense"/>
                    </>
                : currentSelection === "Select Genre" ?
                    <>
                        <GenreCards genre="Indie" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Afro"/>
                        <GenreCards genre="Classical"/>
                        <GenreCards genre="Country"/>
                        <GenreCards genre="Dance/Electronic"/>
                        <GenreCards genre="Hip-Hop"/>
                        <GenreCards genre="Indie"/>
                        <GenreCards genre="Jazz"/>
                        <GenreCards genre="Pop"/>
                        <GenreCards genre="R&B"/>
                        <GenreCards genre="Reggae"/>
                        <GenreCards genre="Rock"/>
                        <GenreCards genre="Soul"/>
                    </>
                : currentSelection === "Select Playlist" && spotifyPlaylists.length > 0 ?
                    <>
                        {spotifyPlaylists.map((playlist, index) => {
                                return <PlaylistCards 
                                            key={index} 
                                            playlistName={playlist.name} 
                                            mood={mood}
                                            imageUrl={playlist.images[0].url}
                                            tracksEndpoint={playlist.tracks.href} 
                                            playlistUrl={playlist.externalUrls.externalUrls.spotify} 
                                            onPlaylistUpdate={handlePlaylistUpdate}
                                        />
                            })}
                    </>
                : currentSelection === "Playlist Tracks" ?
                    <>
                       {
                            tracksPlaylists.map((trackObj, index) => {
                                return <p key={index}>{trackObj.track.name}</p>
                            })
                       }     
                    </>
                : null
            }

            </main>
            
                {/* <MoodCards mood="Angry"/>
                <MoodCards mood="Anxious"/>
                <MoodCards mood="Cheerful"/>
                <MoodCards mood="Empty"/>
                <MoodCards mood="Frustrated"/>
                <MoodCards mood="Hyped"/>
                <MoodCards mood="Idyllic"/>
                <MoodCards mood="Infatuated"/>
                <MoodCards mood="Lonely"/>
                <MoodCards mood="Melancholy"/>
                <MoodCards mood="Optimistic"/>
                <MoodCards mood="Tense"/> */}

                {/* <h1>{currentUser.birthdate}</h1>
                <h1>{currentUser.country}</h1>
                <h1>{currentUser.displayName}</h1>
                <h1>{currentUser.email}</h1>
                <h1>{currentUser.externalUrls.spotify}</h1>
                <h1>{currentUser.id}</h1>
                <img src={currentUser.images[0].url} /> */}
        </div>
    )
}

export default HomePage