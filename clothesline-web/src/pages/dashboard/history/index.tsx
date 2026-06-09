"use client";

import HistoryPage from "@/views/dashboard/history";
import { SEO } from "@/components/custom/seo";
import DashboardLayout from "@/views/dashboard/layout";
import { ReactElement } from "react";

const History = () => {
    return (
        <>
            <SEO title="Riwayat - Smart Clothesline IoT" />
            <HistoryPage />
        </>
    );
}

History.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "Historical Data" },
  ];
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            {page}
        </DashboardLayout>
    );
}

export default History;