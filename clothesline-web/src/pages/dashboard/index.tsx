import { ReactElement } from "react";
import Dashboard from "../../views/dashboard";
import { SEO } from "@/components/custom/seo";
import DashboardLayout from "../../views/dashboard/layout";

const Homepage = () => {
    return (
        <>
            <SEO title="Dashboard Utama - Smart Clothesline IoT" />
            <Dashboard />
        </>
    );
};

Homepage.getLayout = function getLayout(page: ReactElement) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            {page}
        </DashboardLayout>
    );
};

export default Homepage;