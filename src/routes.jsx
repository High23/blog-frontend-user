import App from "./App";
import ErrorPage from "./components/errorpage/errorpage.jsx";
import LogIn from "./components/login/login.jsx";
import SignUp from "./components/sign-up/sign-up.jsx";
import { CurrentUser, User, EditCurrentUser } from "./components/user/user.jsx";
import LogOut from "./components/logout/logout.jsx";
import { Post, CreatePost } from "./components/post/post.jsx";

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
        path: "logout",
        element: <LogOut></LogOut>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "sign-up",
        element: <SignUp></SignUp>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "user",
        element: <CurrentUser></CurrentUser>,
        errorElement: <ErrorPage></ErrorPage>
    },
    {
        path: "user/:userId/edit",
        element: <EditCurrentUser></EditCurrentUser>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "user/:userId",
        element: <User></User>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "post/create",
        element: <CreatePost></CreatePost>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "post/:postId",
        element: <Post></Post>,
        errorElement: <ErrorPage></ErrorPage>,
    },
]

export default routes;
