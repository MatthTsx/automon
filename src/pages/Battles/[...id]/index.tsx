import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'

function Home() {
    const router = useRouter().asPath.replace("/Battles/", "")
    const data = api.game.GetFightData.useQuery({id: router})

    console.log(data.data)
    return (
        <div>Home</div>
    )
}

export default Home