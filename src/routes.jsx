import App from "./App";
import ErrorPage from "./components/errorpage/errorpage.jsx";
import LogIn from "./components/login/login.jsx";

const routes = [
    {
        path: "/",
        element: <App></App>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "login",
        element: <LogIn></LogIn>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "sign-up",
        element: <App></App>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "post/create",
        element: <App></App>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "post/:postId",
        element: <App></App>,
        errorElement: <ErrorPage></ErrorPage>,
    },
]

export default routes;
