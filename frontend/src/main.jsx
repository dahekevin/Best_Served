import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Home from './pages/home/Home.jsx'
import Profile from './pages/profile/Profile.jsx'
import Auth from './pages/auth/auth.jsx'
import ReservationList from './pages/reservation/Reservation.jsx'
import RestaurantDashboard from './pages/dashboard/Dashboard.jsx'
import Tables from './pages/tables/Tables.jsx'
import Plans from './pages/plans/Plans.jsx'
import RestaurantList from './pages/restaurants/Restaurants.jsx'
import Restaurant from './pages/restaurant/Restaurant.jsx'
import UpdateUserProfile from './pages/updateUserProfile/UpdateUserProfile.jsx'
import UpdateRestaurantProfile from './pages/updateRestaurantProfile/UpdateRestaurantProfile.jsx'
import MakeReservation from './pages/makeReservation/MakeReservation.jsx'
import RegisterRestaurantPage from './pages/registerRestaurant/registerRestaurant.jsx'
import SdUserLogin from './pages/sdUserAuth/SdUserLogin.jsx'
import SdUserRegister from './pages/sdUserAuth/SdUserRegister.jsx'
import ProfileTeste from './pages/profileTeste/ProfileTeste.jsx'
import ResProfile from './pages/resProfile/ResProfile.jsx'

const pages = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/profile', element: <Profile /> },
			{ path: '/restaurant-profile', element: <ResProfile /> },
			{ path: '/auth', element: <Auth /> },
			{ path: '/reservation', element: <ReservationList /> },
			{ path: '/restaurant', element: <Restaurant /> },
			{ path: '/dashboard', element: <RestaurantDashboard /> },
			{ path: '/tables', element: <Tables /> },
			{ path: '/plans', element: <Plans /> },
			{ path: '/restaurants', element: <RestaurantList /> },
			{ path: '/user-update-profile', element: <UpdateUserProfile /> },
			{ path: '/restaurant-update-profile', element: <UpdateRestaurantProfile /> },
			{ path: '/make-reservation', element: <MakeReservation /> },
			{ path: '/register-restaurant', element: <RegisterRestaurantPage /> },
			{ path: '/sd-user-login', element: <SdUserLogin /> },
			{ path: '/sd-user-register', element: <SdUserRegister /> },
			{ path: '/sd-user-profile/me', element: <ProfileTeste /> }
		]
	}
])

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={pages}>

		</RouterProvider>
	</StrictMode>,
)
