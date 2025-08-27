// src/components/users/modules/components/SettingRow.tsx
import { PropsWithChildren } from "react";

type SettingRowProps = {
  title: string;
  description?: string;
  right?: React.ReactNode;
};

export function SettingRow({ title, description, right }: PropsWithChildren<SettingRowProps>) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="text-sm">
        <div className="font-medium">{title}</div>
        {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
      </div>
      {right}
    </div>
  );
}
