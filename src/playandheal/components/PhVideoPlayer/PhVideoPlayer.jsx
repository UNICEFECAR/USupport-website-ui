import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import ReactHlsPlayer from "react-hls-player";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-video-player.scss";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * PhVideoPlayer
 *
 * 16:9 video with a poster state and play, progress, volume and fullscreen
 * controls. Supports HLS (.m3u8) and regular video files.
 *
 * @param {string} src - video url
 * @param {string} poster - poster image url
 * @param {string} title - shown on the poster before playback
 * @param {function} onStart - called once, when playback is first started
 * @returns {JSX.Element}
 */
export const PhVideoPlayer = ({ src, poster, title, onStart }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "video_player" });
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isHls = !!src && src.includes(".m3u8");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(video.currentTime);
    const onMeta = () => setDuration(video.duration);
    const onVolume = () => setIsMuted(video.muted);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("volumechange", onVolume);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("volumechange", onVolume);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (!hasStarted) onStart?.();
    setHasStarted(true);
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (videoRef.current?.webkitEnterFullscreen) {
      // iOS Safari only supports fullscreen on the video element itself
      videoRef.current.webkitEnterFullscreen();
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const videoProps = {
    className: "ph-video-player__video",
    playsInline: true,
    preload: "metadata",
    poster,
    onClick: togglePlay,
  };

  return (
    <div className="ph-video-player" ref={containerRef}>
      <div className="ph-video-player__surface">
        {src &&
          (isHls ? (
            <ReactHlsPlayer
              src={src}
              autoPlay={false}
              controls={false}
              playerRef={videoRef}
              {...videoProps}
            />
          ) : (
            <video src={src} ref={videoRef} {...videoProps} />
          ))}

        {!hasStarted && (
          <button
            type="button"
            className={classNames(
              "ph-video-player__poster",
              poster && "ph-video-player__poster--image"
            )}
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
            onClick={togglePlay}
            disabled={!src}
            aria-label={src ? `${t("play")}: ${title}` : t("coming_soon")}
          >
            <span className="ph-video-player__poster-button">
              <PhIcon name="play" size={32} />
            </span>
            <span className="ph-video-player__poster-title">
              {src ? title : t("coming_soon")}
            </span>
          </button>
        )}
      </div>

      <div className="ph-video-player__controls">
        <button
          type="button"
          className="ph-video-player__control"
          onClick={togglePlay}
          disabled={!src}
          aria-label={isPlaying ? t("pause") : t("play")}
        >
          <PhIcon name={isPlaying ? "pause" : "play"} size={20} />
        </button>
        <span className="ph-video-player__time" aria-hidden="true">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          className="ph-video-player__progress"
          min={0}
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          disabled={!src || !duration}
          aria-label={t("seek")}
          aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          style={{ "--ph-progress": `${progress}%` }}
        />
        <button
          type="button"
          className="ph-video-player__control"
          onClick={toggleMute}
          disabled={!src}
          aria-label={isMuted ? t("unmute") : t("mute")}
        >
          <PhIcon name={isMuted ? "mute" : "volume"} size={20} />
        </button>
        <button
          type="button"
          className="ph-video-player__control"
          onClick={toggleFullscreen}
          disabled={!src}
          aria-label={t("fullscreen")}
        >
          <PhIcon name="fullscreen" size={20} />
        </button>
      </div>
    </div>
  );
};
