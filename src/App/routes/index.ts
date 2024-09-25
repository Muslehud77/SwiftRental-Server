import { Router } from "express";
import { UserRouter } from "../Modules/User/user.route";
import { AuthRouts } from "../Modules/Auth/auth.route";
import { CarRoutes } from "../Modules/Car/car.route";
import { BookingRoutes } from "../Modules/Booking/booking.route";
import { PaymentRoutes } from "../Modules/Payment/payment.route";


const router = Router()

const moduleRoutes = [
    {
        path: "/users",
        route: UserRouter
    },
    
    {
        path: "/auth",
        route: AuthRouts
    },
    {
        path: "/cars",
        route: CarRoutes
    },
    
    {
        path: "/bookings",
        route: BookingRoutes
    },
    {
        path: "/pay",
        route: PaymentRoutes
    },

]

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router