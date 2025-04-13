import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

const UserAvatar = ({ name, imageUrl, size = "md", className = "" }) => {
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()
    }

    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    }

    return (
        <Avatar
            className={`${sizeClasses[size]} border-2 border-greenApp ${className} transition-transform duration-200 ease-in-out hover:scale-110`} // Añadir clases de transición y hover
        >
            <AvatarImage src={imageUrl || undefined} alt={name} />
            <AvatarFallback className="bg-darkGreen text-white">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
