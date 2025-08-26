import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"
import { Outlet } from "react-router-dom"
import "./App.css"

function App() {

	return (
		<>
			<div className="main-background">
				<ScrollToTop />
				<Navbar className="navbar" />
				<Outlet className="outlet" />
				<Footer className="footer" />
			</div>
		</>
	)
}

export default App
