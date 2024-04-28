import { AbilityType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React from 'react'
import { api } from '~/utils/api'
import type { AutomonData } from '~/utils/interface'


function Admin() {
    const s = useSession()
    const [AutomonData, setAUData] = React.useState<AutomonData>({BaseDmg: 0, BaseHealth: 0, ImagePath: "", LevelAbilityType: [], AbilityFunc: "", Name: "", LevelsDescription: []})

    const isAdmin = api.dev.isAdmin.useQuery({id: s.data?.user.id ?? ""})
    const addAuto = api.dev.createAutomon.useMutation()

    
    if(isAdmin.status != "success" || !isAdmin.data?.isAdmin) return <>...</>

  return (
    <div>
        <AddAutomon func={setAUData}/>
        <button onClick={() => addAuto.mutate({...AutomonData})}>Send</button>
    </div>
  )
}

function AddAutomon({...p}: {func: React.Dispatch<React.SetStateAction<AutomonData>>}){
    return <div className='bg-Main_purple p-4 flex gap-5 flex-wrap'>
        <input type="text" placeholder='Name' onChange={(e) => p.func(d => ({...d, Name: e.target.value}) )}/>
        <input type="text" placeholder='ImagePath' onChange={(e) => p.func(d => ({...d, ImagePath: e.target.value}) )}/>
        <input type="number" placeholder='BaseHealth' onChange={e => p.func(d => ({...d, BaseHealth: e.target.valueAsNumber}))}/>
        <input type="number" placeholder='BaseDmg' onChange={e => p.func(d => ({...d, BaseDmg: e.target.valueAsNumber}))}/>
        <input type="text" placeholder='AbilityFunc' onChange={(e) => p.func(d => ({...d, AbilityFunc: e.target.value}) )}/>

        {[...Array<number>(3)].map((j,i) => 
        <textarea rows={5} key={i} placeholder={`Level Desc ${i+1}`} onChange={(e) => p.func(d => {
            d.LevelsDescription[i] = e.target.value
            return {...d}
        } )}/>
        )}

        {[...Array<null>(3)].map((j,i) => 
            <select name="" id="" key={i} onChange={e => p.func(d => {
                d.LevelAbilityType[i] = e.target.value as AbilityType
                return {...d}
            })}>
                {Object.keys(AbilityType).filter((v) =>  isNaN(Number(v))).map((e, k) => <option key={k} value={e}>{e}</option>)}
            </select>
        )}
    </div>
}

export default Admin