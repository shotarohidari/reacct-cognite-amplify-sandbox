import { Auth, Hub } from "aws-amplify"
import { useEffect, useState } from "react"

type UseAuthCogniteHook = [
  { loggedIn: boolean; confirmationNeeded: boolean },
  {
    signUp: (email: string, password: string) => Promise<void>
    confirmSignUp: (username: string, code: string) => Promise<void>
    signIn: (username: string, password: string) => Promise<void>
    signOut: () => Promise<void>
  }
]
export const useCogniteAuth = (): UseAuthCogniteHook => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [confirmationNeeded, setConfirmationNeeded] = useState(false)
  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
        autoSignIn: {
          enabled: true,
        },
      })
      setConfirmationNeeded(true)
    } catch (e) {
      console.log("error signing up :", e)
    }
  }

  const confirmSignUp = async (username: string, code: string) => {
    try {
      await Auth.confirmSignUp(username, code)
      setConfirmationNeeded(false)
    } catch (error) {
      console.log("error confirming sign up", error)
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password)
      setLoggedIn(true)
    } catch (err) {
      console.log(`error sigining in `, err)
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
      setConfirmationNeeded(false)
      setLoggedIn(false)
    } catch (err) {
      console.log(`error signing out: `, err)
    }
  }
  useEffect(() => {
    const hubListenCancelToken = Hub.listen("auth", ({ payload }) => {
      const { event } = payload
      if (event === "autoSignIn") {
        const user = payload.data
        console.log("auto sign in!")
        setLoggedIn(true)
      } else if (event === "autiSignIn_failure") {
        setLoggedIn(false)
      }
    })
    return () => {
      hubListenCancelToken()
    }
  }, [])
  return [
    { loggedIn, confirmationNeeded },
    { signUp, confirmSignUp, signIn, signOut },
  ]
}
