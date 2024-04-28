import React from 'react'

function TierIndicator({...p} : {
    Tier: number
}) {

  return (
    <div className='w-full aspect-square bg-white rounded-xl p-[.2em] flex-shrink-0'>
        <div className='w-full aspect-square rounded-lg border-Main_purple border-[.2em] flex items-center justify-center flex-shrink-0 relative'>
            {p.Tier == 1 ? <div className='bg-Main_purple w-2 aspect-square rounded-full'/>
            :p.Tier == 2 ? <Two/>
            :p.Tier == 3 ? <Three/>
            :p.Tier == 4 ? <Four/>
            :p.Tier == 5 ? <Five/>
            :<Six/>
        }
        </div>
    </div>
  )
}

function Two(){
    return <>
        <div className='w-2 h-[50%] flex-shrink-0'>
            <div className='w-full aspect-square rounded-full bg-Main_purple flex-shrink-0'/>
        </div>
        <div className='w-2 h-[50%] flex items-end flex-shrink-0'>
            <div className='w-full aspect-square rounded-full bg-Main_purple flex-shrink-0'/>
        </div>
    </>
}

function Three(){
    return <>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 left-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 right-1'/>
    </>
}

function Four(){
    return <></>
}

function Five(){
    return <>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 left-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 right-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 right-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 left-1'/>
    </>
}

function Six(){
    return <>
    </>
}

export default TierIndicator