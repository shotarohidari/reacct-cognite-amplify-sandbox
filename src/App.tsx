import { useEffect, useState } from "react"

import {
  Box,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import {
  Outlet,
  ReactLocation,
  Router,
  useNavigate,
} from "@tanstack/react-location"
import { useAuth } from "./context/AuthContext"

const location = new ReactLocation()

const Login = () => {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useAuth()
  return (
      <LoginLayout>
        <TextField
          onChange={(e) => setUserName(e.target.value)}
          label="ユーザー名"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          label="パスワード"
        />
        <Button onClick={() => signIn(username, password)}>ログイン</Button>
      </LoginLayout>
  )
}

const LoginLayout = ({ children }: { children: any }) => {
  return (
    <Stack sx={{ width: "50%" }} spacing={2}>
      {children}
    </Stack>
  )
}
const SignUp = () => {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const { signUp } = useAuth()

  return (
    <LoginLayout>
      <TextField
        onChange={(e) => setUserName(e.target.value)}
        label="ユーザー名"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        label="パスワード"
      />
      <Button onClick={() => signUp(username, password)}>
        アカウントを作成する
      </Button>
    </LoginLayout>
  )
}
const ConfirmSignUp = () => {
  const [username, setUserName] = useState("")
  const [code, setCode] = useState("")

  const { confirmSignUp } = useAuth()
  return (
    <LoginLayout>
      <TextField
        onChange={(e) => setUserName(e.target.value)}
        label="ユーザー名"
      />
      <TextField onChange={(e) => setCode(e.target.value)} label="コード" />
      <Button onClick={() => confirmSignUp(username, code)}>認証する</Button>
    </LoginLayout>
  )
}

const DashBoard = () => {
  return <Box>ようこそ！ ダッシュボード画面です。</Box>
}

const AuthWrapper = ({ children }: { children: any }) => {
  const { loggedIn, signOut, confirmationNeeded } = useAuth()
  const [loginOrSignUp, setLoginOrSignUp] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    loggedIn && navigate({ to: "dashboard" })
    !loggedIn && navigate({ to: "login" })
  }, [loggedIn])
  return loggedIn ? (
    <Box>
      {children}
      <Button onClick={() => signOut()}>ログアウト</Button>
    </Box>
  ) : (
    <Box>
      {!confirmationNeeded ? (
        <>
          <ToggleButtonGroup color="primary" exclusive>
            <ToggleButton
              value="login"
              onClick={(e, value) => setLoginOrSignUp(value)}>
              ログイン
            </ToggleButton>
            <ToggleButton
              value="signUp"
              onClick={(e, value) => setLoginOrSignUp(value)}>
              アカウント作成
            </ToggleButton>
          </ToggleButtonGroup>
          {loginOrSignUp === "login" && <Login />}
          {loginOrSignUp === "signUp" && <SignUp />}
        </>
      ) : (
        <ConfirmSignUp />
      )}
    </Box>
  )
}

function App() {
  return (
    <Router
      location={location}
      routes={[{ path: "dashboard", element: <DashBoard /> }]}>
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    </Router>
  )
}

export default App
