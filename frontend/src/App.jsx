import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import { Outlet } from "react-router-dom"
import "./App.css"

function App() {

	return (
		<>
			<div className="main-background">
				<Navbar className="navbar" />
				<Outlet className="outlet" />
				<Footer className="footer" />
			</div>
		</>
	)
}

export default App
