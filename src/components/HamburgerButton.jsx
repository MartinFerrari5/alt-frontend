// src/components/HamburgerButton.jsx
const HamburgerButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      data-drawer-target="sidebar-multi-level-sidebar"
      data-drawer-toggle="sidebar-multi-level-sidebar"
      aria-controls="sidebar-multi-level-sidebar"
      className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <span className="sr-only">Open sidebar</span>
      <svg
        className="w-6 h-6"
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
  );
};

export default HamburgerButton;
