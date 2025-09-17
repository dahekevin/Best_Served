import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"
import ScrollToTop from "./components/scrollToTop/ScrollToTop"
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
