type BadgeStatus = "online" | "live" | "off" | "error" | "warning" | "idle" | "offline" | "none";

interface StatusConfig {
    label: string;
    colorClass: string;
    pingClass?: string;
    textClass?: string;
    animate: boolean;
}

interface SwitchBadgeProps {
    status: BadgeStatus;
    size?: "sm" | "md" | "lg";
}

export function SwitchBadge({ status, size = "sm" }: SwitchBadgeProps) {
    const statusMap: Record<BadgeStatus, StatusConfig> = {
        live: {
            label: "Live",
            colorClass: "bg-blue-500",
            pingClass: "bg-blue-400",
            textClass: "text-blue-600 dark:text-blue-400",
            animate: true,
        },
        off: {
            label: "Off",
            colorClass: "bg-zinc-500",
            pingClass: "bg-zinc-400",
            textClass: "text-zinc-600 dark:text-zinc-400",
            animate: false,
        },
        error: {
            label: "Critical",
            colorClass: "bg-red-500",
            pingClass: "bg-red-400",
            textClass: "text-red-600 dark:text-red-400",
            animate: true,
        },
        warning: {
            label: "Pending",
            colorClass: "bg-amber-500",
            pingClass: "bg-amber-400",
            textClass: "text-amber-600 dark:text-amber-400",
            animate: false,
        },
        idle: {
            label: "Idle",
            colorClass: "bg-emerald-500",
            pingClass: "bg-emerald-400",
            textClass: "text-emerald-600 dark:text-emerald-400",
            animate: false,
        },
        online: {
            label: "Online",
            colorClass: "bg-green-500",
            pingClass: "bg-green-400",
            textClass: "text-green-600 dark:text-green-400",
            animate: true,
        },
        offline: {
            label: "Offline",
            colorClass: "bg-zinc-500",
            pingClass: "bg-zinc-400",
            textClass: "text-zinc-600 dark:text-zinc-400",
            animate: false,
        },
        none: {
        label: "No Device",
        colorClass: "bg-zinc-300 dark:bg-zinc-700",
        textClass: "text-zinc-500 dark:text-zinc-500",
        animate: false,
        }
    };

    const sizeClasses = {
        sm: {
            container: "px-3 py-1 gap-2",
            dot: "h-2 w-2",
            text: "text-[10px]",
        },
        md: {
            container: "px-4 py-1.5 gap-2.5",
            dot: "h-2.5 w-2.5",
            text: "text-xs",
        },
        lg: {
            container: "px-5 py-2 gap-3 w-fit",
            dot: "h-3 w-3",
            text: "text-sm",
        }
    };

    const current = statusMap[status];
    const currentSize = sizeClasses[size];

    return (
        <div className={`flex shadow-2xs items-center ${currentSize.container} bg-zinc-100 dark:bg-zinc-900 rounded-full transition-colors duration-500`}>
            <span className={`relative flex ${currentSize.dot}`}>
                {current.animate && current.pingClass && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingClass}`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-full w-full transition-colors duration-500 ${current.colorClass}`}></span>
            </span>

            <span className={`${currentSize.text} font-bold ${current.textClass || "text-foreground"} uppercase tracking-wider select-none`}>
                {current.label}
            </span>
        </div>
    );
}