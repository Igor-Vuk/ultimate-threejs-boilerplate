import ReactDOM from "react-dom/client"
import { Loader } from "@react-three/drei"
import { StrictMode } from "react"
import "./style.css"

import Experience from "./Experience"

const root = ReactDOM.createRoot(document.querySelector("#root"))

root.render(
  <StrictMode>
    <Loader />
    <Experience />
  </StrictMode>,
)
