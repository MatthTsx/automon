import Image from 'next/image'
import Link from 'next/link'

import React from 'react'

function Hero() {

  return (
    <div className='bg-Main_purple w-full h-screen flex items-center justify-center overflow-hidden relative'>
        <div className='absolute bg-Main_white w-[40%] h-[100%] clip-path-1 left-0 2xl:w-[45%]'/>
        <div className='flex items-center justify-center flex-col absolute top-[25%]'>
            <div className='flex items-center 2xl:h-[9em] justify-center 2xl:w-[95em] relative
            xl:w-[70em] xl:h-[7em]'>
                <h1 className='absolute drop-shadow-xl text-t_gray'>Mega Automons</h1>
                <Image src={"/textures/oak.jpg"} width={1000} height={1000} alt='Texture' className='object-cover h-full w-full rounded-sm' priority/>
            </div>
            <p className='font-Rubik_WP mt-[1em] text-white 2xl:text-[24px] xl:text-[20px]'>A Super <span className='text-t_brown'>Autopets</span> and <span className='text-t_yellow'>Pokemon</span> inspired Game!</p>
            <Link className='w-[17em] 2xl:w-[22em] h-[5em] 2xl:h-[7em] bg-Main_white mt-[5em] 2xl:mt-[6.5em] rounded-[10px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all' href={`/Home/`}>
                <p className='font-Rubik_WP 2xl:text-[24px] xl:text-[20px]'>SIGN IN AND PLAY</p>
            </Link>
        </div>
        <Image src={"/components/grass.png"} width={1500} height={200} className='w-[200em] object-cover h-[37.5%] left-[0] absolute bottom-[-3em] pointer-events-none' alt='grass'/>
    </div>
  )
}

export default Hero