
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChartConfig } from "./types"
import { getPayloadConfigFromPayload } from "./utils"

interface TooltipItemProps {
  item: {
    name?: string;
    dataKey?: string;
    value?: number;
    payload?: Record<string, unknown>;
    color?: string;
    [key: string]: unknown;
  };
  index: number;
  config: ChartConfig;
  indicator?: 'line' | 'dot' | 'dashed';
  hideIndicator?: boolean;
  formatter?: (value: unknown, name: string, item: unknown, index: number, payload: unknown) => React.ReactNode;
  nestLabel?: boolean;
  color?: string;
}

export const TooltipItem: React.FC<TooltipItemProps> = ({
  item,
  index,
  config,
  indicator = 'dot',
  hideIndicator,
  formatter,
  nestLabel,
  color,
}) => {
  const key = `${item.name || item.dataKey || "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor = color || item.payload.fill || item.color

  return (
    <div
      key={item.dataKey}
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {formatter && item?.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, item.payload)
      ) : (
        <>
          {itemConfig?.icon ? (
            <itemConfig.icon />
          ) : (
            !hideIndicator && (
              <div
                className={cn(
                  "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                  {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent":
                      indicator === "dashed",
                    "my-0.5": nestLabel && indicator === "dashed",
                  }
                )}
                style={
                  {
                    "--color-bg": indicatorColor,
                    "--color-border": indicatorColor,
                  } as React.CSSProperties
                }
              />
            )
          )}
          <div
            className={cn(
              "flex flex-1 justify-between leading-none",
              nestLabel ? "items-end" : "items-center"
            )}
          >
            <span className="text-muted-foreground">
              {itemConfig?.label || item.name}
            </span>
            {item.value && (
              <span className="font-mono font-medium tabular-nums text-foreground">
                {item.value.toLocaleString()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export const TooltipLabel: React.FC<{
  label: string | unknown;
  payload: unknown[];
  hideLabel: boolean;
  labelFormatter?: (label: unknown, payload: unknown[]) => React.ReactNode;
  labelClassName?: string;
  config: ChartConfig;
  labelKey?: string;
}> = ({
  label,
  payload,
  hideLabel,
  labelFormatter,
  labelClassName,
  config,
  labelKey,
}) => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = `${labelKey || (item as any).dataKey || (item as any).name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }
