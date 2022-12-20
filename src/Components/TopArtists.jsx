import React, {useEffect, useState} from "react";
import axios from "axios";

const TopArtists = () => {
    const [userTopArtists, setUserTopArtists] = useState();

    useEffect(() => {
        axios.get("http://localhost:8080/api/spotify/user-top-artists")
            .then((res) => {
                console.log(res.data);
                setUserTopArtists(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            {userTopArtists ? (
                userTopArtists.map((artistResult) => {
                    return <h1 key={artistResult.name}>{artistResult.name}</h1>
                })
            ):
            (
                <h1>LOADING...</h1>
            )}
        </div>
    )
}

export default TopArtists