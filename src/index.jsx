import ReactDOM from "react-dom/client"
import { StrictMode } from "react"
import "./style.css"

import Experience from "./Experience"

const root = ReactDOM.createRoot(document.querySelector("#root"))

root.render(
  <StrictMode>
    <Experience />
  </StrictMode>,
)
