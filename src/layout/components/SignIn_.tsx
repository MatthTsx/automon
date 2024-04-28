import { signIn } from 'next-auth/react'
import React from 'react'

function SignIn_() {
  return (
    <button onClick={() => signIn('discord')}>Sign In</button>
  )
}

export default SignIn_