import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"
import NotificationSystem from "../src/components/notification/notification.jsx"
import { Outlet } from "react-router-dom"
import "./App.css"

function App() {

	return (
		<>
			<div className="main-background">
				<ScrollToTop />
				<Navbar className="navbar" />
				<NotificationSystem />
				<Outlet className="outlet" />
				<Footer className="footer" />
			</div>
		</>
	)
}

export default App
