import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
            {...props}
        />
    );
}

export function AppCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-6 h-[280px]">
            <div className="flex items-start justify-between">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-3 flex-grow">
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-32 rounded" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-12 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        </div>
    );
}
