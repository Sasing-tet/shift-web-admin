import dynamic from "next/dynamic";
import Sidenav from "@/components/sidebar/SidebarNavigator";

// import OpenStreetMap from '../component/OpenStreetMap'
const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

const home = () => {
  return (
    <div className="home-components">
      <Sidenav />
      <OpenStreetMap />
      <div></div>
    </div>
  );
};

export default home;
