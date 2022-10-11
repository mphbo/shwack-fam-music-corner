import React, { useState, useEffect, createRef, useRef } from "react";

import loadscript from "load-script";
import { Button } from "grommet";
import { useAuthContext } from "../context/auth";
import axios from "axios";

// SoundCloud widget API
//  https://developers.soundcloud.com/docs/api/html5-widget

declare global {
  interface Window {
    SC: any;
  }
}

interface ISoundCloudWidget {
  username: string;
  email: string;
  url: string;
}

export function SoundCloudWidget({ url, email, username }: ISoundCloudWidget) {
  // state
  const { user } = useAuthContext();

  // used to communicate between SC widget and React
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);

  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState<any>(false);

  // ref for iframe element - https://reactjs.org/docs/refs-and-the-dom.html
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // initialization - load soundcloud widget API and set SC event listeners

  useEffect(() => {
    // use load-script module to load SC Widget API
    loadscript("https://w.soundcloud.com/player/api.js", () => {
      // initialize player and store reference in state

      const player = window.SC.Widget(iframeRef.current);
      setPlayer(player);

      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } =
        window.SC.Widget.Events;

      // NOTE: closures created - cannot access react state or props from within and SC callback functions!!

      player.bind(PLAY, () => {
        // update state to playing
        setIsPlaying(true);

        // check to see if song has changed - if so update state with next index
        player.getCurrentSoundIndex((playerPlaylistIndex: number) => {
          setPlaylistIndex(playerPlaylistIndex);
        });
      });

      player.bind(PAUSE, () => {
        // update state if player has paused - must double check isPaused since false positives
        player.isPaused((playerIsPaused: boolean) => {
          if (playerIsPaused) setIsPlaying(false);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (player) player.setVolume(10);
  }, [player]);

  // integration - update SC player based on new state (e.g. play button in React section was click)

  // adjust playback in SC player to match isPlaying state
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.isPaused((playerIsPaused: boolean) => {
      if (isPlaying && playerIsPaused) {
        player.play();
      } else if (!isPlaying && !playerIsPaused) {
        player.pause();
      }
    });
  }, [isPlaying]);

  // adjust seleted song in SC player playlist if playlistIndex state has changed
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.getCurrentSoundIndex((playerPlaylistIndex: number) => {
      if (playerPlaylistIndex !== playlistIndex) player.skip(playlistIndex);
    });
  }, [playlistIndex]);

  // React section button click event handlers (play/next/previous)
  //  - adjust React component state based on click events

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaylistIndex = (skipForward = true) => {
    // get list of songs from SC widget
    player.getSounds((playerSongList: any[]) => {
      let nextIndex = skipForward ? playlistIndex + 1 : playlistIndex - 1;

      // ensure index is not set to less than 0 or greater than playlist
      if (nextIndex < 0) nextIndex = 0;
      else if (nextIndex >= playerSongList.length)
        nextIndex = playerSongList.length - 1;

      setPlaylistIndex(nextIndex);
    });
  };

  const handleDelete = () => {
    axios.delete(`/users/:${email}`).then((response) => {
      console.log("responseFromDelete:", response);
    });
  };

  return (
    <div>
      <h4>{username}</h4>
      {user?.email === "logannormanthomas@protonmail.com" && (
        <Button label="Delete" onClick={handleDelete} />
      )}
      <iframe
        ref={iframeRef}
        id="sound-cloud-player"
        style={{
          border: "none",
          height: 180,
          width: "100%",
        }}
        scrolling="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${url}&amp;;color=#0066CC;`}
      ></iframe>

      {/* <Button onClick={() => changePlaylistIndex(false)}>{"<"}</Button>
      <Button onClick={togglePlayback}>{isPlaying ? "Pause" : "Play"}</Button>
      <Button onClick={() => changePlaylistIndex(true)}>{">"}</Button> */}
    </div>
  );
}
