"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface AppStatusIndicatorProps {
  status: "idle" | "building" | "running" | "error" | "deployed";
  className?: string;
}

export function AppStatusIndicator({ status, className }: AppStatusIndicatorProps) {
  const statusConfig = {
    idle: {
      icon: Clock,
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      label: "Idle"
    },
    building: {
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      label: "Building",
      animate: true
    },
    running: {
      icon: CheckCircle,
      color: "text-green-500", 
      bgColor: "bg-green-100 dark:bg-green-900/20",
      label: "Running"
    },
    error: {
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20", 
      label: "Error"
    },
    deployed: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      label: "Deployed"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
      config.bgColor,
      className
    )}>
      <Icon 
        className={cn(
          "h-4 w-4",
          config.color,
          config.animate && "animate-spin"
        )} 
      />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}