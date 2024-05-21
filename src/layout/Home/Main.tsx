/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useRouter } from 'next/navigation'
import React from 'react'
import { api } from '~/utils/api'
import type { SessionRetrieve } from '~/utils/interface'



function Main({...p}:SessionRetrieve) {
  const router = useRouter()
  const user = api.game.getUser.useQuery({
    id: p.s.user.id
  })
  const newGame = api.game.startNewGame.useMutation()

  if(user.status == "pending") return <>Loading</>

  const GoNewGame = async () => {
    await newGame.mutateAsync({id: p.s.user.id, isOnGame: user.data!.isOnGame}).then((d) => router.push(`/Game/${d.GameStatus!.id}`))
  }

  return (
    <div>

      <div className='flex items-center justify-center flex-col bg-Main_purple p-4 text-Main_white'>
        <button onClick={() => GoNewGame()}>Play new game</button>
        <button disabled={user.data!.isOnGame == false as boolean} onClick={() => router.push(`/Game/${user.data?.GameStatus?.id}`)}>Continue game</button>
      </div>
      
    </div>
  )
}

export default Main