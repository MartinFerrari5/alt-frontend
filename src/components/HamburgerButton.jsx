const HamburgerButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="p-2 text-gray-500 lg:hidden"
            aria-label="Toggle Sidebar"
        >
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                ></path>
            </svg>
        </button>
    )
}

export default HamburgerButton
