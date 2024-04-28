import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import TierIndicator from '~/layout/components/TierIndicator'
import { api } from '~/utils/api'

function Home() {
  const router = useRouter().asPath.replace("/Game/", "")
  const game = api.game.getGameData.useQuery({id: router})
  const roll = api.shop.RollShop.useMutation()

  if(game.isLoading) return <>A</>
  if(!game.data) return <>Error</>

  console.log(game.data)
  return (
    <div className='flex flex-col gap-20 bg-green-500'>
      <DataTopBar {...game.data}/>

      <div>
        A
      </div>

      <div className='flex gap-[0.25%] relative left-[20%]'>
        {game.data.Shop!.ShopPets.map((j,i) => 
          <ShopPet Tier={j.BaseData.ShopTier} ImagePath={j.BaseData.ImagePath} key={i} Health={j.Heath} Damage={j.Damage}/>
        )}
      </div>

      <button onClick={async (e) => {
        const btn = e.target as HTMLButtonElement
        btn.disabled = true
        await roll.mutateAsync({GameId: game.data!.id}).then(() => game.refetch())
        btn.disabled = false
      }}>Roll</button>
    </div>
  )
}

interface PetProps {
  ImagePath: string,
  Health: number, Damage: number
}

interface ShopPetProps extends PetProps {
  Tier: number
}

function ShopPet({...p} : ShopPetProps) {
  return <div className='w-[9%] relative'>
    <Pet {...p}/>
    <div className='w-[40%] absolute top-0 translate-y-[-100%] left-0'>
      <TierIndicator {...p}/>
    </div>
  </div>
}

function Pet({...p} : PetProps){
  return <div className='flex items-center justify-center relative'>
    <Image src={`/automons/${p.ImagePath}`} alt='automon' width={400} height={400} className='object-contain w-full aspect-square'/>
    <div className='absolute bottom-0 w-[85%] translate-y-[100%] flex items-center justify-between'>
      <div className='flex items-center justify-center p-[.2em] rounded-full bg-white'>
        <div className='w-10 aspect-square bg-neutral-500 rounded-full flex-shrink-0 relative flex items-center justify-center text-2xl font-Rubik_WP border-4 border-Main_purple'>
          <p className='drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)] text-white'>{p.Damage}</p></div>
      </div>
      <div className='flex items-center justify-center p-[.2em] rounded-full bg-white'>
        <div className='w-10 aspect-square bg-[#f02a2a] rounded-full flex-shrink-0 relative flex items-center justify-center text-2xl font-Rubik_WP border-4 border-Main_purple'>
          <p className='drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)] text-white'>{p.Health}</p></div>
      </div>
      <div className='w-[90%] bg-white rounded-xl absolute -z-[1] h-6'/>
    </div>
  </div>
}

function DataTopBar({...p} : {
  Gold: number, Lives: number, Trophies: number, Turn: number
}){
  return <div className='w-screen h-[6.5em] flex items-center px-8 gap-[4em]'>
    <div className='game-top-bar-content'>{p.Gold}</div>
    <div className='game-top-bar-content'>{p.Lives}</div>
    <div className='game-top-bar-content'>{p.Turn}</div>
    <div className='game-top-bar-content'>{p.Trophies}/10</div>
  </div>
}

export default Home