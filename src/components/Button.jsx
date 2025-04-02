import React from "react"
import PropTypes from "prop-types"
import { tv } from "tailwind-variants"

const button = tv({
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive:
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline:
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary:
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        },
        disabled: {
            true: "cursor-not-allowed opacity-50 hover:opacity-50",
        },
    },
    compoundVariants: [
        {
            // Puedes definir variantes compuestas si lo requieres
        },
    ],
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

const Button = React.forwardRef(
    ({ children, variant, size, className, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                className={button({
                    variant,
                    size,
                    disabled: rest.disabled,
                    className,
                })}
                {...rest}
            >
                {children}
            </button>
        )
    }
)

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
    ]),
    size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
    className: PropTypes.string,
}

Button.displayName = "Button"

export default Button
