"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSetting } from "@/hooks/use-setting";
import { Label } from "../ui/label";
import { ModeToggle } from "../mode-toggle";

const SettingModal = () => {
  const settings = useSetting();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className=" text-lg font-medium">我的设置</h2>
        </DialogHeader>
        <div className=" flex items-center justify-between">
          <div className=" flex flex-col gap-y-1">
            <Label>外观</Label>
            <span className=" text-[0.8rem] text-muted-foreground">
              自定义 Jotion 在您的设备上的外观
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingModal;
