import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./components/Auth.tsx";
import { SocketContextProvider } from "./components/SocketContext.tsx";
// import { GeistSans } from "geist/font/sans";
// import { GeistProvider, CssBaseline } from "@geist-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <Toaster position="bottom-left" reverseOrder={false} />
          <App />
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
