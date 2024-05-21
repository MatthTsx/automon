import React from 'react'

function TierIndicator({...p} : {
    Tier: number, size: number, b_size: number
}) {

  return (
    <div className='w-full aspect-square bg-white rounded-xl p-[.2em] flex-shrink-0' style={{padding: p.size/2.5 + "em", borderRadius: p.size*1.5 + "em"}}>
        <div className='w-full aspect-square rounded-lg flex items-center justify-center flex-shrink-0 relative border-Main_purple' style={{borderWidth: p.b_size + "em", borderRadius: p.size + "em"}}>
            {p.Tier == 1 ? <div className='bg-Main_purple w-2 aspect-square rounded-full' style={{width: p.size + "em"}}/>
            :p.Tier == 2 ? <Two {...p}/>
            :p.Tier == 3 ? <Three {...p}/>
            :p.Tier == 4 ? <Four {...p}/>
            :p.Tier == 5 ? <Five {...p}/>
            :<Six {...p}/>
        }
        </div>
    </div>
  )
}

interface SizeProps{
    size: number
}

function Two({...p} : SizeProps){
    return <>
        <div className='w-2 h-[50%] flex-shrink-0' style={{width: p.size + "em"}}>
            <div className='w-full aspect-square rounded-full bg-Main_purple flex-shrink-0'/>
        </div>
        <div className='w-2 h-[50%] flex items-end flex-shrink-0' style={{width: p.size + "em"}}>
            <div className='w-full aspect-square rounded-full bg-Main_purple flex-shrink-0'/>
        </div>
    </>
}

function Three({...p} : SizeProps){
    return <>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 left-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 right-1'/>
    </>
}

function Four({...p} : SizeProps){
    return <></>
}

function Five({...p} : SizeProps){
    return <>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 left-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 right-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full top-1 right-1'/>
        <div className='absolute w-2 aspect-square bg-Main_purple rounded-full bottom-1 left-1'/>
    </>
}

function Six({...p} : SizeProps){
    return <>
    </>
}

export default TierIndicator