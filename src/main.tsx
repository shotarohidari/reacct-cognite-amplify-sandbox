import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Amplify } from "aws-amplify"
import awsExports from "./aws-exports"
import { AuthContextProvider } from "./context/AuthContext"

Amplify.configure(awsExports)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
)
