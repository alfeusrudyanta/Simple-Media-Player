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
import { useRef, useState, useEffect } from 'react';
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
  const [repeatOn, setRepeatOn] = useState<boolean>(false);
  const [shuffleOn, setShuffleOn] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(false);

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const HandleState = async () => {
    if (state === 'loading') return;

    const savedState = state;
    setState('loading');
    await new Promise((res) => setTimeout(res, 500));
    setState(savedState === 'playing' ? 'paused' : 'playing');
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className='flex flex-col w-500 max-w-500 bg-[#0F0F0F] rounded-[16px] p-16 gap-20'
      variants={boxVariant}
      initial='paused'
      animate={state}
    >
      <audio ref={audioRef} src='/musics/Lights.mp3' />
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
            <p className='text-lg-semibold text-[#F5F5F5]'>
              Awesome Song Title
            </p>
            <p className='text-sm-regular text-[#A4A7AE]'>Amazing Artist</p>
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
      <div className='h-8 rounded-full bg-[#252B37]'>
        <motion.div
          className='h-8 rounded-full bg-[#717680]'
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          style={{ willChange: 'width' }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>

      {/* Time List */}
      <div className='flex justify-between'>
        <p className='text-xs-regular text-[#717680]'>
          {formatTime(currentTime)}
        </p>
        <p className='text-xs-regular text-[#717680]'>
          {formatTime(duration - currentTime)}
        </p>
      </div>

      {/* Icon List */}
      <div className='flex justify-center items-center gap-16'>
        <motion.div
          className={cn(
            'flex rounded-[8px] p-8 gap-8 cursor-pointer',
            shuffleOn ? 'text-[#8B5CF6]' : 'text-[#D5D7DA]'
          )}
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShuffleOn(!shuffleOn)}
        >
          <Shuffle height={20} width={20} />
        </motion.div>

        <motion.div
          className='flex rounded-[8px] p-8 gap-8 cursor-pointer text-[#D5D7DA]'
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipBack height={20} width={20} />
        </motion.div>

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

        <motion.div
          className='flex rounded-[8px] p-8 gap-8 cursor-pointer text-[#D5D7DA]'
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward height={20} width={20} />
        </motion.div>

        <motion.div
          className={cn(
            'flex rounded-[8px] p-8 gap-8 cursor-pointer',
            repeatOn ? 'text-[#8B5CF6]' : 'text-[#D5D7DA]'
          )}
          whileHover={{
            backgroundColor: '#374151',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRepeatOn(!repeatOn)}
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
              onClick={() => setIsMute(false)}
            />
          ) : (
            <Volume2
              key='unmute'
              height={16}
              width={16}
              color='#A4A7AE'
              className='cursor-pointer'
              onClick={() => setIsMute(true)}
            />
          )}
        </AnimatePresence>
        <div className='h-4 w-full rounded-full bg-[#252B37] cursor-pointer'>
          <motion.div
            className='h-4 w-307 rounded-full bg-[#717680]'
            whileHover={{ backgroundColor: '#a855f7' }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
