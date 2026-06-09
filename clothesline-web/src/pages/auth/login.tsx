import ViewLogin from "../../views/auth/login";
import { SEO } from "@/components/custom/seo";

const Login = () => {
    return (
        <>
            <SEO title="Login - Smart Clothesline IoT" />
            <div>
            <ViewLogin></ViewLogin>
        </div>
        </>
    );
};

export default Login;