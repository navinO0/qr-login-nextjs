import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { getDeviceInfo } from "./getDeviceInfo";
import { SlScreenDesktop } from "react-icons/sl";
import { CiMobile3 } from "react-icons/ci";




const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const { request } = useApi();
  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setDeviceInfo(info);
    }
    const fetchData = async () => {
      setIsLoading(true);
      const { data, error, response } = await request('/user/get/devices', {}, true);
      if (!error && data?.data?.devices) {
        setDevices(data.data.devices);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch devices", error);
      }

      //   if (error) setError(error);
      //   else setProfile(data);
    };
    fetchDeviceInfo();
    fetchData();
  }, [request]);



  return (
    <div>
      <div className="mw-100">
        {isLoading ? <p>Loading...</p> : <> {
          devices.map((device, index) => (

            <div key={index}>
              
              <div>
                {/* <h4 className="text-sm leading-none font-medium">{device.deviceType}</h4> */}
                {device.deviceType === "desktop" ? <SlScreenDesktop fontSize={25} /> : <CiMobile3 fontSize={25} />}
              <div className="flex align-center justify-between gap-2">
                <>
                  <p className="text-muted-foreground text-sm">
                    {device.browser + " - " + device.os}
                    {deviceInfo?.fingerprint === device.fingerprint ? <p className="text-sm text-green-500 text-[12px] [text-shadow:0_0_8px_#22c55e]">This device</p> : ""}
                  </p>
                  </>
                <IoLogOutOutline className="text-red-500 text-[25px] [text-shadow:0_0_8px_#22c55e" />
                </div>
              </div>
              <Separator className={cn(
                 " mt-3 bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
              )} />
            </div>
          ))
        }
          <p className=" mt-2 text-center text-md transition-all duration-300 text-muted-foreground hover:text-red-500 hover:[text-shadow:0_0_8px_#ef4444] cursor-pointer">logout from all the devices</p>
        </>}
        {/* <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p> */}
      </div>
    </div>
  )
};

export default DeviceManager