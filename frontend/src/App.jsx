import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import { Outlet } from "react-router-dom"

function App() {

	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	)
}

export default App
