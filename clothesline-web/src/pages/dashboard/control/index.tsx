import { ReactElement } from "react";
import ControlPage from "@/views/dashboard/control";
import { SEO } from "@/components/custom/seo";
import DashboardLayout from "@/views/dashboard/layout";

const Control = () => {
  return (
    <>
      <SEO title="Kontrol Alat - Smart Clothesline IoT" />
      <ControlPage />
    </>
  );
};

Control.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "Control Panel" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {page}
    </DashboardLayout>
  );
};

export default Control;