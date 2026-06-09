import { ReactElement } from "react";
import SystemLogsPage from "@/views/dashboard/logs/system";
import { SEO } from "@/components/custom/seo";
import DashboardLayout from "@/views/dashboard/layout";

const SystemLogs = () => {
  return (
    <>
      <SEO title="Log Sistem - Smart Clothesline IoT" />
      <SystemLogsPage />
    </>
  );
};

SystemLogs.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "System Logs" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {page}
    </DashboardLayout>
  );
};

export default SystemLogs;