import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Home from './pages/home/home.jsx'
import Profile from './pages/profile/profile.jsx'
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

const pages = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/restaurant', element: <Restaurant /> },
			{ path: '/', element: <Home /> },
			{ path: '/profile', element: <Profile /> },
			{ path: '/auth', element: <Auth /> },
			{ path: '/reservation', element: <ReservationList /> },
			{ path: '/dashboard', element: <RestaurantDashboard /> },
			{ path: '/tables', element: <Tables /> },
			{ path: '/plans', element: <Plans /> },
			{ path: '/restaurants', element: <RestaurantList /> },
			{ path: '/user-update-profile', element: <UpdateUserProfile /> },
			{ path: '/restaurant-update-profile', element: <UpdateRestaurantProfile /> },
			{ path: '/make-reservation', element: <MakeReservation /> },
			{ path: '/register-restaurant', element: <RegisterRestaurantPage /> }
		]
	}
])

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={pages}>

		</RouterProvider>
	</StrictMode>,
)
