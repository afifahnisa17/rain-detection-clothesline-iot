import { ReactElement } from "react";
import DashboardLayout from "@/views/dashboard/layout";
import SensorsPage from "@/views/dashboard/sensors";
import { SEO } from "@/components/custom/seo";

const Sensors = () => {
  return (
    <>
      <SEO title="Monitoring Sensor - Smart Clothesline IoT" />
      <SensorsPage />
    </>
  );
};

Sensors.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "Sensors" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {page}
    </DashboardLayout>
  );
};

export default Sensors;