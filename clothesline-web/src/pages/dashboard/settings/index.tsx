import { ReactElement } from "react";
import DashboardLayout from "@/views/dashboard/layout";
import SettingsPage from "@/views/dashboard/settings";
import { SEO } from "@/components/custom/seo";

const Settings = () => {
  return (
    <>
      <SEO title="Pengaturan - Smart Clothesline IoT" />
      <SettingsPage />
    </>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "Configuration" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {page}
    </DashboardLayout>
  );
};

export default Settings;
