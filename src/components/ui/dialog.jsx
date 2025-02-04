import { Dialog as HeadlessDialog } from "@headlessui/react"
import { cn } from "../../util/cn"

export function Dialog({ open, onOpenChange = () => {}, children }) {
    return (
        <HeadlessDialog
            open={open}
            onClose={onOpenChange}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {children}
            </div>
        </HeadlessDialog>
    )
}

export function DialogContent({ className, children }) {
    return (
        <HeadlessDialog.Panel
            className={cn(
                "rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900",
                className
            )}
        >
            {children}
        </HeadlessDialog.Panel>
    )
}

export function DialogHeader({ children }) {
    return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
    return <h2 className="text-lg font-semibold">{children}</h2>
}

export function DialogDescription({ children }) {
    return (
        <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
    )
}

export function DialogFooter({ className, children }) {
    return (
        <div className={cn("mt-4 flex justify-end gap-2", className)}>
            {children}
        </div>
    )
}
