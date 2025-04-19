import { useState, useEffect } from "react";
import { Lightbulb, DoorOpen, TvIcon, Thermometer, Lock, Fan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/context/ChatContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DeviceState {
  name: string;
  type: string;
  state: boolean;
  brightness?: number;
  temperature?: number;
  color?: string;
}

const SmartDeviceControl = () => {
  const { controlSmartDevice } = useChat();
  
  // Demo device states
  const [devices, setDevices] = useState<DeviceState[]>([
    { name: "Living Room", type: "light", state: false, brightness: 80, color: "#f5d76e" },
    { name: "Bedroom", type: "light", state: false, brightness: 50, color: "#ffffff" },
    { name: "Kitchen", type: "light", state: false, brightness: 100, color: "#ffffff" },
    { name: "Main Door", type: "door", state: false },
    { name: "TV", type: "tv", state: false },
    { name: "AC", type: "thermostat", state: false, temperature: 22 },
    { name: "Security System", type: "lock", state: true },
    { name: "Fan", type: "fan", state: false }
  ]);

  // Handle device state updates
  const toggleDevice = async (index: number) => {
    const device = devices[index];
    const newState = !device.state;
    
    try {
      // Call the controlSmartDevice function with the device name and action
      await controlSmartDevice(device.name.toLowerCase(), newState ? "on" : "off");
      
      // Update local state
      const updatedDevices = [...devices];
      updatedDevices[index] = { ...device, state: newState };
      setDevices(updatedDevices);
    } catch (error) {
      console.error(`Error toggling ${device.name}:`, error);
    }
  };

  // Handle brightness change
  const changeBrightness = async (index: number, value: number) => {
    const device = devices[index];
    
    try {
      // Call controlSmartDevice with the device name and brightness action
      await controlSmartDevice(device.name.toLowerCase(), `brightness to ${value}%`);
      
      // Update local state
      const updatedDevices = [...devices];
      updatedDevices[index] = { ...device, brightness: value };
      setDevices(updatedDevices);
    } catch (error) {
      console.error(`Error changing brightness for ${device.name}:`, error);
    }
  };

  // Get device icon based on type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return <Lightbulb className="h-5 w-5" />;
      case "door":
        return <DoorOpen className="h-5 w-5" />;
      case "tv":
        return <TvIcon className="h-5 w-5" />;
      case "thermostat":
        return <Thermometer className="h-5 w-5" />;
      case "lock":
        return <Lock className="h-5 w-5" />;
      case "fan":
        return <Fan className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {devices.map((device, index) => (
        <Card key={device.name} className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                {getDeviceIcon(device.type)}
                {device.name}
              </CardTitle>
              <Badge variant={device.state ? "default" : "secondary"} className={device.state ? "bg-emerald-600" : ""}>
                {device.state ? "ON" : "OFF"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`toggle-${device.name}`}>Power</Label>
                <Switch
                  id={`toggle-${device.name}`}
                  checked={device.state}
                  onCheckedChange={() => toggleDevice(index)}
                />
              </div>
              
              {device.type === "light" && device.brightness !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`brightness-${device.name}`}>Brightness</Label>
                    <span className="text-xs text-muted-foreground">{device.brightness}%</span>
                  </div>
                  <Slider
                    id={`brightness-${device.name}`}
                    min={1}
                    max={100}
                    step={1}
                    value={[device.brightness]}
                    onValueChange={(value) => changeBrightness(index, value[0])}
                    disabled={!device.state}
                  />
                </div>
              )}
              
              {device.type === "thermostat" && device.temperature !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`temp-${device.name}`}>Temperature</Label>
                    <span className="text-xs text-muted-foreground">{device.temperature}°C</span>
                  </div>
                  <Slider
                    id={`temp-${device.name}`}
                    min={16}
                    max={30}
                    step={0.5}
                    value={[device.temperature]}
                    onValueChange={(value) => {
                      const updatedDevices = [...devices];
                      updatedDevices[index] = { ...device, temperature: value[0] };
                      setDevices(updatedDevices);
                    }}
                    disabled={!device.state}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SmartDeviceControl;