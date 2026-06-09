import ViewRegister from "../../views/auth/register";
import { SEO } from "@/components/custom/seo";

const Register = () => {
    return (
        <>
            <SEO title="Register - Smart Clothesline IoT" />
            <div>
            <ViewRegister></ViewRegister>
        </div>
        </>
    );
};

export default Register;