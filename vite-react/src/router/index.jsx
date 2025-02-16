import Login from "../components/login"
import { Navigate } from "react-router-dom"

const routes = [
    {
        path: "/",
        element: <Navigate to="/login"></Navigate>
    },
    {
        path: "/login",
        element: <Login></Login>
    }
]
 
export default routes