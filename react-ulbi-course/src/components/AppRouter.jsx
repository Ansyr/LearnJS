import React, {useContext} from 'react';
import {Route, Routes} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../router/routes";
import {AuthContext} from "../context";
import MyLoader from "./UI/Loader/MyLoader";


const AppRouter = () => {
    const {isAuth,isLoading} = useContext(AuthContext)
    if(isLoading){
        return <MyLoader/>
    }
    return (
        isAuth ? <Routes>
                {privateRoutes.map(route =>
                    <Route path={route.path} element={route.component} exact={route.exact} key={route.path}/>
                )}
            </Routes> :
            <Routes>
                {publicRoutes.map(route =>
                    <Route path={route.path} element={route.component} exact={route.exact} key={route.path}/>
                )}
            </Routes>
    );
};

export default AppRouter;