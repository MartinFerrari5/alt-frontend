import { useState, useEffect, useCallback } from "react"

export function useSidebar(defaultOpen = true) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    // Function to toggle sidebar
    const toggleSidebar = useCallback(() => {
        setIsOpen((prevState) => !prevState)
    }, [])

    // Auto-close on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false)
            } else if (window.innerWidth >= 768 && !isOpen) {
                setIsOpen(true)
            }
        }

        // Set initial state
        handleResize()

        // Add event listener
        window.addEventListener("resize", handleResize)

        // Clean up
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return {
        isOpen,
        setIsOpen,
        toggleSidebar,
    }
}
