import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head';
import React from 'react'
import Main from '~/layout/Home/Main';
import SignIn_ from '~/layout/components/SignIn_';

function Home() {
  const s = useSession();
  
  if(s.status == "loading") return <></>
  if(s.status == "unauthenticated") return <SignIn_/>

  return (
    <>
      <Head>
        <title>Automons - Home</title>
      </Head>
      <Main s={s.data!}/>
    </>
  )
}

export default Home