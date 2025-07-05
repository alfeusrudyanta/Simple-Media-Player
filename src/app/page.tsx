'use client';

import {
  Music,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  Volume2,
  SkipForward,
  Repeat,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import {
  boxVariant,
  albumVariant,
  equalizerBarsVariant,
  PlayState,
} from '@/components/Players/variants';

const Home = () => {
  const [state, setState] = useState<PlayState>('paused');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const musicTracks = useMemo(
    () => ['/musics/Lights.mp3', '/musics/A-Promise.mp3', '/musics/Nature.mp3'],
    []
  );
  const [currentMusic, setCurrentMusic] = useState<string>(musicTracks[0]);
  const [musicTitle, setMusicTitle] = useState<string>('Lights');
  const [musicArtist, setMusicArtist] = useState<string>('');

  useEffect(() => {
    const trackMetadata = [
      { title: 'Lights', artist: 'Sakura Girl' },
      { title: 'A Promise', artist: 'Keys of Moon' },
      { title: 'Nature', artist: 'MaxKoMusic' },
    ];

    const currentIndex = musicTracks.indexOf(currentMusic);
    setMusicTitle(trackMetadata[currentIndex].title);
    setMusicArtist(trackMetadata[currentIndex].artist);
  }, [currentMusic, musicTracks]);

  /* isAudioPlay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === 'playing') {
      audio.play().catch((error) => {
        console.error('Playback failed:', error);
        setState('paused');
      });
    } else {
      audio.pause();
    }
  }, [state]);

  /* Time Duration */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleUpdateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleUpdateTime);

    return () => {
      audio.removeEventListener('timeupdate', handleUpdateTime);
    };
  }, []);

  /* Volume */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const barWidth = rect.width;
    const newVolume = Math.min(1, Math.max(0, clickPosition / barWidth));

    setVolume(newVolume);

    if (isMute) setIsMute(false);
  };

  const toggleMute = () => {
    if (!isMute) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }

    setIsMute(!isMute);
  };

  /* Skip Forward */
  const toggleSkipForward = async () => {
    const nextTrackIndex =
      (musicTracks.indexOf(currentMusic) + 1) % musicTracks.length;
    setCurrentMusic(musicTracks[nextTrackIndex]);

    setState('loading');
    await new Promise((res) => setTimeout(res, 500));
    setState('playing');
  };

  /* Skip Backward */
  const toggleSkipBackward = async () => {
    const prevTrackIndex =
      (musicTracks.indexOf(currentMusic) - 1 + musicTracks.length) %
      musicTracks.length;
    setCurrentMusic(musicTracks[prevTrackIndex]);

    setState('loading');
    await new Promise((res) => setTimeout(res, 500));
    setState('playing');
  };

  /* Repeat & Shuffle */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  const handleRepeatToggle = () => {
    setIsRepeat((prev) => !prev);
  };

  const handleShuffleToggle = () => {
    setIsShuffle((prev) => !prev);
  };

  const handleTrackEnd = async () => {
    if (isRepeat) {
      setState('loading');
      await new Promise((res) => setTimeout(res, 500));
      setState('playing');
      return;
    }

    if (isShuffle) {
      const currentIndex = musicTracks.indexOf(currentMusic);
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * musicTracks.length);
      } while (nextIndex === currentIndex && musicTracks.length > 1);
      setCurrentMusic(musicTracks[nextIndex]);
    } else {
      const nextIndex =
        (musicTracks.indexOf(currentMusic) + 1) % musicTracks.length;
      setCurrentMusic(musicTracks[nextIndex]);
    }

    setState('loading');
    await new Promise((res) => setTimeout(res, 500));
    setState('playing');
  };

  /* Format Time */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  /* Loading */
  const HandleState = async () => {
    if (state === 'loading') return;

    const savedState = state;
    setState('loading');
    await new Promise((res) => setTimeout(res, 500));
    setState(savedState === 'playing' ? 'paused' : 'playing');
  };

  return (
    <motion.div
      className='flex flex-col w-500 max-w-500 bg-[#0F0F0F] rounded-[16px] p-16 gap-20'
      variants={boxVariant}
      initial='paused'
      animate={state}
    >
      <audio ref={audioRef} src={currentMusic} onEnded={handleTrackEnd} />
      <div className='flex flex-col justify-between'>
        <div className='flex gap-24 items-center'>
          {/* Album Title */}
          <motion.div
            className='h-120 w-120 rounded-[12px] bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex justify-center items-center'
            variants={albumVariant}
            initial='paused'
            animate={state}
            style={{ willChange: 'transform, opacity' }}
          >
            <Music height={60} width={48} />
          </motion.div>

          <div className='flex flex-col gap-5'>
            <p className='text-lg-semibold text-[#F5F5F5] line-clamp-1'>
              {musicTitle}
            </p>
            <p className='text-sm-regular text-[#A4A7AE] line-clamp-1'>
              {musicArtist}
            </p>
          </div>
        </div>

        {/* Equalizer Bar */}
        <div className='flex items-end h-32 pl-[144px] gap-4'>
          {[0, 1, 2, 3, 4].map((barIndex) => (
            <motion.div
              key={barIndex}
              className='w-8 bg-[#8B5CF6]'
              variants={equalizerBarsVariant}
              custom={barIndex}
              style={{ willChange: 'height, opacity' }}
              animate={state}
              initial='paused'
            />
          ))}
        </div>
      </div>

      {/* Music Progress Bar */}
      <div className='h-8 rounded-full bg-[#252B37] group cursor-pointer'>
        <motion.div
          className='h-8 rounded-full bg-[#717680] group-hover:bg-[#a855f7] flex items-center'
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          style={{ willChange: 'width' }}
          transition={{ duration: 0.3, ease: 'linear' }}
        >
          <div className='h-12 w-12 ml-auto rounded-full group-hover:bg-[#a855f7]' />
        </motion.div>
      </div>

      {/* Time List */}
      <div className='flex justify-between'>
        <p className='text-xs-regular text-[#717680]'>
          {formatTime(currentTime)}
        </p>
        <p className='text-xs-regular text-[#717680]'>
          {formatTime(duration - currentTime) === 'NaN:NaN'
            ? '0:00'
            : formatTime(duration - currentTime)}
        </p>
      </div>

      {/* Icon List */}
      <div className='flex justify-center items-center gap-16'>
        {/* Shuffle Icon */}
        <motion.div
          className={cn(
            'flex rounded-[8px] p-8 gap-8 cursor-pointer',
            isShuffle ? 'text-[#8B5CF6]' : 'text-[#D5D7DA]'
          )}
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShuffleToggle}
        >
          <Shuffle height={20} width={20} />
        </motion.div>

        {/* Skip Back Icon */}
        <motion.div
          className='flex rounded-[8px] p-8 gap-8 cursor-pointer text-[#D5D7DA]'
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSkipBackward}
        >
          <SkipBack height={20} width={20} />
        </motion.div>

        {/* Play/Pause Icon */}
        <motion.div
          className='h-56 w-56 p-8 gap-8 flex items-center justify-center rounded-full cursor-pointer'
          onClick={HandleState}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring' }}
          animate={{
            backgroundColor: state === 'loading' ? '#717680' : '#7C3AED',
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          <AnimatePresence mode='wait'>
            {state === 'playing' ? (
              <Pause key='pause' height={24} width={24} color='#D5D7DA' />
            ) : (
              <Play key='play' height={24} width={24} color='#D5D7DA' />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skip Forward Icon */}
        <motion.div
          className='flex rounded-[8px] p-8 gap-8 cursor-pointer text-[#D5D7DA]'
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSkipForward}
        >
          <SkipForward height={20} width={20} />
        </motion.div>

        {/* Repeat Icon */}
        <motion.div
          className={cn(
            'flex rounded-[8px] p-8 gap-8 cursor-pointer',
            isRepeat ? 'text-[#8B5CF6]' : 'text-[#D5D7DA]'
          )}
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRepeatToggle}
        >
          <Repeat height={20} width={20} />
        </motion.div>
      </div>

      {/* Volume Control */}
      <div className='flex gap-8 items-center'>
        <AnimatePresence mode='wait'>
          {isMute ? (
            <VolumeX
              key='mute'
              height={16}
              width={16}
              color='#A4A7AE'
              className='cursor-pointer'
              onClick={toggleMute}
            />
          ) : (
            <Volume2
              key='unmute'
              height={16}
              width={16}
              color='#A4A7AE'
              className='cursor-pointer'
              onClick={toggleMute}
            />
          )}
        </AnimatePresence>
        {/* Volume Bar */}
        <div
          ref={volumeBarRef}
          className='h-4 w-full rounded-full bg-[#252B37] cursor-pointer group'
          onClick={handleVolumeChange}
        >
          <motion.div
            className='h-4 w-307 rounded-full bg-[#717680] flex items-center group-hover:bg-[#a855f7]'
            style={{ width: `${volume * 100}%` }}
            transition={{ duration: 0.2 }}
          >
            <div className='ml-auto h-10 w-10 rounded-full group-hover:bg-[#a855f7]' />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
