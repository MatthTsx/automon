/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import TierIndicator from '~/layout/components/TierIndicator'
import { api } from '~/utils/api'

function Home() {
  const session = useSession()
  const RouterChanger = useRouter()
  const router = RouterChanger.asPath.replace("/Game/", "")
  const game = api.game.getGameData.useQuery({id: router})
  const startBattle = api.battle.StartBattle.useMutation()
  const roll = api.shop.RollShop.useMutation()
  const sell = api.shop.SellPet.useMutation()
  const freeze = api.shop.FreezePet.useMutation()
  const BuyPet = api.shop.BuyPet.useMutation()
  const changePos = api.game.GoToPlace.useMutation()
  const lvlUp = api.game.LevelUp.useMutation()

  const [Selected, setSelected] = React.useState({id: "", fromShop: false, TypeId: "", pos: -1})


  if(game.isLoading || session.status == "loading") return <>A</>
  if(!game.data || game.data.UserId != session.data?.user.id) return <>Error</>

  return (
    <div className='flex flex-col bg-green-500 h-screen items-center overflow-hidden'>
      <DataTopBar {...game.data}/>
      <div className='absolute w-full h-full' onClick={() => setSelected({id: "", fromShop:false, TypeId: "", pos: -1})}/>

      <div className='flex flex-col justify-between h-[60%] 2xl:h-[50%] bg-blue-500 items-center w-full mt-[7.5em]'>

        <div className='flex gap-[0.25%] relative w-[100%] h-32 flex-shrink-0 ml-[20%]'>
          {[...Array<null>(5)].map((n, i) => {
            const p = game.data?.Pet.filter(p => p.BattlePosition == i)[0]
            const Place = !p && Selected.id != ""
            const LvlUp = p && Selected.id != p.id && Selected.TypeId == p.AutomonId && p.Level != 3
            const Switc = p && Selected.id != "" && Selected.id != p.id && !Selected.fromShop && Selected.TypeId != p.AutomonId

            return <div className='w-[8%] relative' key={i} onClick={async () => {
              if(Selected.fromShop && !p) await BuyPet.mutateAsync({
                gameId: game.data!.id, PetId: Selected.id, indx: i
              })
              else if(!Selected.fromShop && (Place || Switc) && Selected.pos != -1 && Selected.pos != i) await changePos.mutateAsync({actualPos: Selected.pos, gameId: game.data!.id, p1: Selected.id, Pos: i})
                .then(() => setSelected({id: "", pos: -1, fromShop: false, TypeId: ""}))
              else if(!(!p || Selected.id == p.id || Selected.TypeId == p.AutomonId)) return setSelected({fromShop: false, id: p.id, pos: i, TypeId: p.AutomonId})
              await game.refetch()
            }}>
              <div className='absolute bg-green-700 w-full h-4 bottom-0'/>
              {p &&
                <BattlePet key={i} AType={p.BaseData.LevelAbilityType[p.Level-1]!} Damage={p.Damage} Health={p.Heath} ImagePath={p.BaseData.ImagePath} id={p.id}
                ShowLevel Tier={p.BaseData.ShopTier} desc={p.BaseData.LevelsDescription[p.Level-1]!} name={p.BaseData.Name} isFromShop={false} Level={p.Level} LvLProgress={p.LevelProgress}
                func={() => {
                  if(LvlUp) return lvlUp.mutateAsync({gameId: game.data!.id, id1: p.id, id2: Selected.id}).then(async () => {
                    setSelected({id: "", pos: -1, fromShop: false, TypeId: ""})
                    await game.refetch()
                  })
                  if(Selected.TypeId == p.AutomonId) return console.log("level up!!")
                  setSelected({id: p.id, fromShop: false, TypeId: p.AutomonId, pos: i})
                }}
                Selected={Selected} BaseId={p.BaseData.id} sellValue={p.Level}
                />
              }

              {Place && <Arrow/>}
              {LvlUp && <Star/>}
              {Switc && <Switch/>}
            </div>
          })}
        </div>

        <div className='flex gap-[0.25%] relative w-[100%] ml-[20%] h-32 flex-shrink-0' style={{
          pointerEvents: BuyPet.status == "pending" ? "none" : "auto"
        }}>
          {game.data.Shop!.ShopPets.map((j,i) => 
            <ShopPet Tier={j.BaseData.ShopTier} ImagePath={j.BaseData.ImagePath} key={i} Health={j.Heath} Damage={j.Damage} desc={j.BaseData.LevelsDescription[0]!} name={j.BaseData.Name} AType={j.BaseData.LevelAbilityType[0] ?? ""}
            isFromShop func={ () => {
              setSelected({id: j.id, fromShop: true, TypeId: j.AutomonId, pos: -1})
            }} ShowLevel={false} Selected={Selected} id={j.id} sellValue={3}/>
          )}
        </div>
      </div>

      <div className='absolute bottom-0 flex items-center justify-between w-screen p-4 text-2xl font-Rowdies'>
        <div>
          {!Selected.fromShop && Selected.id != "" ? 
          <SellBtn func={async (e) => {
            const btn = e.target as HTMLButtonElement
            btn.disabled = true
            const id = Selected.id
            setSelected({id: "", fromShop: false, TypeId: "", pos: -1})
            await sell.mutateAsync({GameId: game.data!.id, id}).then(() => game.refetch())
            btn.disabled = false
          }}/>
          :<>
            <RollBtn func={async (e) => {
              const btn = e.target as HTMLButtonElement
              btn.disabled = true
              setSelected({id: "", fromShop: false, TypeId:"", pos: -1})
              await roll.mutateAsync({GameId: game.data!.id}).then(() => game.refetch())
              btn.disabled = false
            }}/>
            {Selected.id != "" &&
            <FreezeBtn func={async (e) => {
              const btn = e.target as HTMLButtonElement
              btn.disabled = true
              await freeze.mutateAsync({id: Selected.id})
              btn.disabled = false
            }}/>
          }
          </>
          }
        </div>
        <button onClick={async (e) => {
          const btn = e.target as HTMLButtonElement
          btn.disabled = true
          await startBattle.mutateAsync({id: game.data!.id})
            .then(async (d) => 
              await RouterChanger.push(`/Battles/${d!.id}`)
              )
          btn.disabled = false
        }} disabled={game.data.Pet.length == 0}>
          Battle
        </button>
      </div>
    </div>
  )
}

function RollBtn({func} : {func: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}){
  return <button onClick={func}>
    Roll
  </button>
}
function SellBtn({func} : {func: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}){
  return <button onClick={func}>
    Sell
  </button>
}
function FreezeBtn({func} : {func: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}){
  return <button onClick={func}>
    Freeze
</button>
}

function Arrow(){
  return <div className='absolute flex flex-col w-full items-center justify-center top-[-20%] animate-bounce duration-500'>
    <div className='w-[15%] rounded-md aspect-[.5] bg-white'/>
    <div className='w-4 aspect-square rounded-md border-r-transparent border-l-transparent border-t-white border-b-0 border-t-[1.5em] border-[1em] relative translate-y-[-50%]'/>
  </div>
}

function Star(){
  return <div className='absolute flex flex-col w-full items-center justify-center top-[-20%] animate-pulse duration-500'>
    <div className='w-[15%] rounded-md aspect-[.5] bg-yellow-500'/>
    <div className='w-4 aspect-square rounded-md border-r-transparent border-l-transparent border-t-yellow-500 border-b-0 border-t-[1.5em] border-[1em] relative translate-y-[-50%]'/>
  </div>
}

function Switch(){
  return <div className='absolute w-full flex items-center justify-center top-[-20%] animate-spin'>
    Switch
  </div>
}

interface PetProps {
  ImagePath: string, desc: string, name: string
  Health: number, Damage: number, id: string
  Tier: number, AType: string, isFromShop: boolean,
  ShowLevel: boolean, sellValue: number
  func: () => void;
  Selected: {id: string, TypeId: string, fromShop: boolean}
}


interface BattlePetInterface extends PetProps{
  Level: number, LvLProgress: number, BaseId: string
}

function BattlePet({...p} : BattlePetInterface){
  return <div className='w-full'>
    <Pet AType={p.AType} Damage={p.Damage} Health={p.Health} Tier={p.Tier} ImagePath={p.ImagePath} isFromShop={false} sellValue={p.sellValue}
          desc={p.desc} name={p.name} func={p.func} ShowLevel Selected={p.Selected} id={p.id}/>
    <div className='absolute w-8 h-8 bg-white'>{p.Level} {p.LvLProgress}</div>
  </div>
}

function ShopPet({...p} : PetProps) {
  return <div className='w-[8%] relative flex-shrink-0'>
    <Pet {...p}/>
    <div className='w-[40%] 2xl:w-[33%] absolute top-0 translate-y-[-100%] left-0'>
      <TierIndicator {...p} size={.5} b_size={.2}/>
    </div>
  </div>
}

function Pet({...p} : PetProps){
  return <div className='flex items-center justify-center relative group petClick' style={{backgroundColor: p.Selected.id == p.id ? "red" : "transparent"}}>

    <div className='absolute w-[300%] 2xl:w-[250%] group-hover:flex hidden top-[-9em] z-10 bg-white p-2 flex-col rounded-md border-black border-4 items-center pb-4'>
      <div className='flex  w-full h-10 2xl:h-12 justify-between items-center'>
        <Image src={`/automons/${p.ImagePath}`} alt='automon' width={200} height={200} className='object-contain h-full aspect-square object-left'/>
        {/* <Image src={`/automons/${p.ImagePath}`} alt='automon' width={200} height={200} className='object-contain h-full aspect-square object-right'/> */}
        <div className='w-9 aspect-square rounded-full flex items-center justify-center bg-yellow-300 font-Rowdies border-4 border-yellow-500'>
          {p.sellValue}</div>
      </div>
      <h3 className='absolute 2xl:mt-2'>{p.name}</h3>

      <div className='flex items-center justify-center'>
        <div className='w-full h-[.1em] bg-gradient-to-r from-transparent via-black to-transparent absolute -z-[1]'/>
        <div className='w-6 aspect-square'>
          <TierIndicator {...p} size={.25} b_size={.15}/>
        </div>
      </div>

      <p className='indent-2 2xl:indent-6 text-sm font-Rowdies text-black/70'>
        <span className='font-bold text-black'>{p.AType ? p.AType.replace("_", " ") + " -> " : ""}</span>
        {p.desc}
      </p>
    </div>

    <button onClick={() => {
      p.func()
    }}>
      <Image src={`/automons/${p.ImagePath}`} alt='automon' width={400} height={400} className='object-contain w-full aspect-square object-left'/>
    </button>

    <div className='absolute bottom-0 w-[85%] 2xl:w-[75%] translate-y-[100%] flex items-center justify-between'>

      <div className='flex items-center justify-center p-[3%] rounded-full bg-white'>
        <div className='w-10 2xl:w-12 aspect-square bg-neutral-500 rounded-full flex-shrink-0 relative flex items-center justify-center text-2xl font-Rubik_WP border-4 border-Main_purple'>
          <p className='drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)] text-white'>{p.Damage}</p></div>
      </div>
      
      <div className='flex items-center justify-center p-[3%] rounded-full bg-white'>
        <div className='w-10 2xl:w-12 aspect-square bg-[#f02a2a] rounded-full flex-shrink-0 relative flex items-center justify-center text-2xl font-Rubik_WP border-4 border-Main_purple'>
          <p className='drop-shadow-[0_2.1px_2.1px_rgba(0,0,0,.8)] text-white'>{p.Health}</p></div>
      </div>

      <div className='flex justify-center absolute -z-[1] h-[60%] w-full'>
        <div className='w-[60%] bg-white h-full rounded-xl'/>
      </div>
    </div>

  </div>
}

function DataTopBar({...p} : {
  Gold: number, Lives: number, Trophies: number, Turn: number
}){
  return <div className='w-screen h-[10%] flex items-center px-8 gap-[4em]'>
    <div className='game-top-bar-content'>{p.Gold}</div>
    <div className='game-top-bar-content'>{p.Lives}</div>
    <div className='game-top-bar-content'>{p.Turn}</div>
    <div className='game-top-bar-content'>{p.Trophies}/10</div>
  </div>
}

export default Home