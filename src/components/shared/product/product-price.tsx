import { cn } from "@/lib/utils";
import { ReactElement } from "react";

export default function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}): ReactElement {
  const stringValue = value.toFixed(2);

  const [initValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {initValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}
