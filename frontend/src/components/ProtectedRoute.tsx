import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute() {

        const UserToken = localStorage.getItem('token');

        if(UserToken) {
          return (<Outlet />)
        }
        else {
       return( <Navigate to="/login" /> )
        }
}

export default ProtectedRoute;