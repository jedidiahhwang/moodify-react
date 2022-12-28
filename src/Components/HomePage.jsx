import React, {useEffect, useState} from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import {Audio} from "react-loading-icons";

import MoodCards from "./Subcomponents/MoodCards";
import GenreCards from "./Subcomponents/GenreCards";
import PlaylistCards from "./Subcomponents/PlaylistCards";

import "../styling/_homePage.scss";

const HomePage = () => {
    const [currentUser, setCurrentUser] = useState(); // Object containing all user info.
    const [currentUserId, setCurrentUserId] = useState(); // Number for curent logged in user.
    const [currentSelection, setCurrentSelection] = useState("Select Mood");
    const [mood, setMood] = useState();
    const [moodId, setMoodId] = useState(0);
    const [genre, setGenre] = useState();
    const [genreId, setGenreId] = useState(0);
    const [playlist, setPlaylistToAdd] = useState([]); // Used for adding one playlist to the user.
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([]); // Used for Spotify playlists.
    const [userPlaylists, setUserPlaylists] = useState([]); // Used for user's playlist.
    const [tracksPlaylists, setTracksPlaylist] = useState(); // Used for playlist whose tracks you are accessing.
    const [play, setPlay] = useState(false);
    const [trackUri, setTrackUri] = useState();

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

    useEffect(() => {
        setPlay(true);
    }, [trackUri])

    // Set state for which button is selected.
    const handleClick = (event) => {
        event.preventDefault();

        
        switch (event.target.id) {
            case "reset-button":
                console.log(event.target.id);
                setCurrentSelection("Select Mood");
                setMood();
                setMoodId(0);
                setGenre();
                setGenreId(0);
                setSpotifyPlaylists([]);
                console.log(spotifyPlaylists);
                break;
        };
    }

    // Set state for mood selected.
    const handleMoodUpdate = (selectedMood) => {
        console.log(selectedMood);
        setMood(selectedMood);
        switch(selectedMood) {
            case "Anxious":
                setMoodId(1);
                break;
            case "Cheerful":
                setMoodId(2);
                break;
            case "Empty":
                setMoodId(3);
                break;
            case "Frustrated":
                setMoodId(4);
                break;
            case "Hyped":
                setMoodId(5);
                break;
            case "Idyllic":
                setMoodId(6);
                break;
            case "Infatuated":
                setMoodId(7);
                break;
            case "Lonely":
                setMoodId(8);
                break;
            case "Melancholy":
                setMoodId(9);
                break;
            case "Optimistic":
                setMoodId(10);
                break;
            case "Sad":
                setMoodId(11);
                break;
            case "Tense":
                setMoodId(12);
                break;
            case "Tragic":
                setMoodId(13);
                break;
            case "Unhappy":
                setMoodId(14);
                break;
            case "Victorious":
                setMoodId(15);
                break;
        }
        setCurrentSelection("Select Genre");
    }

    // Set state for genre selected.
    const handleGenreUpdate = (selectedGenre) => {
        console.log(selectedGenre);
        setGenre(selectedGenre);
        switch(selectedGenre) {
            case "Afro":
                setGenreId(1);
                break;
            case "Blues":
                setGenreId(13);
                break;
            case "Classical":
                setGenreId(2);
                break;
            case "Country":
                setGenreId(3);
                break;
            case "Electronic":
                setGenreId(4);
                break;
            case "Hip-Hop":
                setGenreId(5);
                break;
            case "Indie":
                setGenreId(6);
                break;
            case "Jazz":
                setGenreId(7);
                break;
            case "Pop":
                setGenreId(8);
                break;
            case "R&B":
                setGenreId(9);
                break;
            case "Reggae":
                setGenreId(10);
                break;
            case "Rock":
                setGenreId(11);
                break;
            case "Soul":
                setGenreId(12);
                break;
            case "Synth":
                setGenreId(14);
                break;
            case "Trap":
                setGenreId(15);
                break;
        }
        setCurrentSelection("Select Playlist");
    }

    // Set state for playlist selected to add to user.
    const handlePlaylistUpdate = (selectedPlaylist) => {
        setPlaylistToAdd(selectedPlaylist);
        console.log(selectedPlaylist);
        
        axios.post(`http://localhost:8080/playlist/addPlaylist/?userId=${currentUserId}&moodId=${moodId}&genreId=${genreId}`, selectedPlaylist)
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

    const handlePlayTrack = (selectedTrack) => {
        console.log(selectedTrack);
        setTrackUri(selectedTrack);
    }

    return (
        <div id="homepage-main-div">
            <header id="homepage-header">
                {
                    currentUser !== undefined ? 
                    <>
                        <div id="header-content-left">
                            <img id="profile-picture" src={currentUser[4]} />
                            <h2 id="welcome-user-header">{currentUser[0]}</h2>
                        </div>
                        <div id="header-content-right">
                            <button className="header-buttons" id="reset-button" onClick={handleClick}>Reset</button>
                        </div>
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
                <h1 id="playlists-header">Playlists</h1>
                <div id="line"></div>
                {
                    userPlaylists.length > 0 ?
                        userPlaylists.map((playlist, index) => {
                            const playlistId = playlist.playlistUrl.split("/")[4];
                            return <p key={index} className="playlist-names" id={playlistId} onClick={() => handlePlaylistSelected(playlistId)}>{playlist.playlistName}</p>
                        })
                    : null
                }
            </nav>
            <main id="homepage-content-holder">
            {
                currentSelection === "Select Mood" ?
                    <>
                        <MoodCards id="anxious-mood-card" mood="Anxious" onMoodUpdate={handleMoodUpdate}/>
                        <MoodCards id="cheerful-mood-card "mood="Cheerful" onMoodUpdate={handleMoodUpdate}/>
                        <MoodCards id="empty-mood-card" onMoodUpdate={handleMoodUpdate} mood="Empty"/>
                        <MoodCards id="frustrated-mood-card" onMoodUpdate={handleMoodUpdate} mood="Frustrated"/>
                        <MoodCards id="hyped-mood-card" onMoodUpdate={handleMoodUpdate} mood="Hyped"/>
                        <MoodCards id="idyllic-mood-card" onMoodUpdate={handleMoodUpdate} mood="Idyllic"/>
                        <MoodCards id="infatuated-mood-card" onMoodUpdate={handleMoodUpdate} mood="Infatuated"/>
                        <MoodCards id="lonely-mood-card" onMoodUpdate={handleMoodUpdate} mood="Lonely"/>
                        <MoodCards id="melancholy-mood-card" onMoodUpdate={handleMoodUpdate} mood="Melancholy"/>
                        <MoodCards id="optimistic-mood-card" onMoodUpdate={handleMoodUpdate} mood="Optimistic"/>
                        <MoodCards id="sad-mood-card" mood="Sad" onMoodUpdate={handleMoodUpdate}/>
                        <MoodCards id="tense-mood-card" onMoodUpdate={handleMoodUpdate} mood="Tense"/>
                        <MoodCards id="tragic-mood-card" onMoodUpdate={handleMoodUpdate} mood="Tragic"/>
                        <MoodCards id="unhappy-mood-card" onMoodUpdate={handleMoodUpdate} mood="Unhappy"/>
                        <MoodCards id="victorious-mood-card" onMoodUpdate={handleMoodUpdate} mood="Victorious"/>
                    </>
                : currentSelection === "Select Genre" ?
                    <>
                        <GenreCards genre="Afro" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Blues" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Classical" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Country" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Dance/Electronic" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Hip-Hop" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Indie" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Jazz" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Pop" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="R&B" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Reggae" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Rock" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Soul" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Synth" onGenreUpdate={handleGenreUpdate}/>
                        <GenreCards genre="Trap" onGenreUpdate={handleGenreUpdate}/>
                    </>
                    : currentSelection === "Select Playlist" && spotifyPlaylists.length === 0 ?
                    <>
                        <div id="audio-loading-holder">
                            <Audio />   
                        </div>
                    </>
                : currentSelection === "Select Playlist" && spotifyPlaylists.length > 0 ?
                    <>
                        {spotifyPlaylists.map((playlist, index) => {
                                return <PlaylistCards 
                                            key={index} 
                                            playlistName={playlist.name} 
                                            mood={mood}
                                            genre={genre}
                                            imageUrl={playlist.images[0].url}
                                            tracksEndpoint={playlist.tracks.href} 
                                            playlistUrl={playlist.externalUrls.externalUrls.spotify} 
                                            onPlaylistUpdate={handlePlaylistUpdate}
                                        />
                            })}
                    </>
                : currentSelection === "Playlist Tracks" ?
                <>
                    <div id="playlist-track-container">
                        <div id="track-album-artist-header">
                            <div id="track-header-container">
                                <h2 className="track-page-headers">Track</h2>
                                <h2 className="track-page-headers">Album</h2>
                                <h2 className="track-page-headers">Artist</h2>
                            </div>
                        </div>
                            {
                                tracksPlaylists.map((trackObj, index) => {
                                    index++;
                                    return (
                                        <div className="track-holders">
                                            <p className="track-number">{index}</p>
                                            <img className="album-cover" src={trackObj.track.album.images[0].url} />
                                            <p className="track-name" key={index} onClick={() => handlePlayTrack(trackObj.track.uri)}>{trackObj.track.name}</p>
                                            <p className="track-album-name" key={index}>{trackObj.track.album.name}</p>
                                            <p className="track-artist-name" key={index}>{trackObj.track.artists[0].name}</p>

                                        </div>
                                    )
                                })
                            }     
                    </div>
                </>
                : null
            }
            </main>
            <div id="spotify-player-container">
                {
                    currentUser ? 
                        <SpotifyPlayer 
                            id="spotify-player"
                            token={currentUser[7]}
                            showSaveIcon
                            callback={(state) => {
                                if(!state.isPlaying) setPlay(false);
                            }}
                            play={play}
                            uris={trackUri ? [trackUri] : []}
                            styles={{
                                activeColor: '#fff',
                                bgColor: '#333',
                                color: '#fff',
                                loaderColor: '#fff',
                                sliderColor: '#1cb954',
                                trackArtistColor: '#ccc',
                                trackNameColor: '#fff'
                            }}
                        />
                    : null
                }
            </div>
        </div>
    )
}

export default HomePage