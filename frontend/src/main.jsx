import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Home from './pages/home/Home.jsx'
import Profile from './pages/profile/Profile.jsx'
import Auth from './pages/auth/auth.jsx'
import ReservationList from './pages/reservation/Reservation.jsx'
import RestaurantDashboard from './pages/restaurantDashboard/RestaurantDashboard.jsx'
import Tables from './pages/tables/Tables.jsx'
import Plans from './pages/plans/Plans.jsx'
import RestaurantList from './pages/restaurants/Restaurants.jsx'
import Restaurant from './pages/restaurant/Restaurant.jsx'
import UpdateClientProfile from './pages/updateClientProfile/UpdateClientProfile.jsx'
import UpdateRestaurantProfile from './pages/updateRestaurantProfile/UpdateRestaurantProfile.jsx'
import MakeReservation from './pages/makeReservation/MakeReservation.jsx'
import RegisterRestaurantPage from './pages/registerRestaurant/registerRestaurant.jsx'
import ClientLogin from './pages/clientAuth/clientLogin.jsx'
import ClientRegister from './pages/clientAuth/clientRegister.jsx'
import ProfileTeste from './pages/profileTeste/ProfileTeste.jsx'
import ResProfile from './pages/resProfile/ResProfile.jsx'
import AdminDashboard from './pages/admPage/admPage.jsx'
import UpdateAdmProfile from './pages/updateAdmPage/UpdateAdmPage.jsx'

const pages = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/login', element: <ClientLogin /> },
			{ path: '/restaurant-profile', element: <ResProfile /> },
			{ path: '/reservation', element: <ReservationList /> },
			{ path: '/restaurant-page', element: <Restaurant /> },
			{ path: '/tables', element: <Tables /> },
			{ path: '/plans', element: <Plans /> },
			{ path: '/restaurants', element: <RestaurantList /> },
			{ path: '/update-client-profile', element: <UpdateClientProfile /> },
			{ path: '/update-restaurant-profile', element: <UpdateRestaurantProfile /> },
			{ path: '/make-reservation', element: <MakeReservation /> },
			{ path: '/restaurant-registration', element: <RegisterRestaurantPage /> },
			{ path: '/client-profile', element: <Profile /> },
			{ path: '/client-registration', element: <ClientRegister /> },
			{ path: '/auth', element: <Auth /> },
			{ path: '/restaurant-dashboard', element: <RestaurantDashboard /> },
			{ path: '/client-profile/me', element: <ProfileTeste /> },
			{ path: '/admin', element: <AdminDashboard /> },
			{ path: '/admin-update', element: <UpdateAdmProfile /> },
		]
	}
])

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={pages}>

		</RouterProvider>
	</StrictMode>,
)
