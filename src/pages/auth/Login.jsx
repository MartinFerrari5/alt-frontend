const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-100 to-white antialiased">
      <div className="container mx-auto px-6">
        <div className="flex h-full flex-col items-center justify-evenly text-center md:flex-row md:text-left">
          {/* Left Section */}
          <div className="flex w-full flex-col md:w-1/2">
            <div>
              <svg
                className="fill-stroke mx-auto h-20 w-20 text-gray-800 md:float-left"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-800">Client Area</h1>
            <p className="mx-auto w-5/12 text-gray-500 md:mx-0">
              Control and monitorize your website data from dashboard.
            </p>
          </div>

          {/* Right Section */}
          <div className="mx-auto w-full md:mx-0 md:w-1/2 lg:w-9/12">
            <div className="flex w-full flex-col rounded-xl bg-white p-10 shadow-xl">
              <h2 className="mb-5 text-left text-2xl font-bold text-gray-800">
                Sigin
              </h2>
              <form className="w-full">
                <div className="my-5 flex w-full flex-col">
                  <label htmlFor="username" className="mb-2 text-gray-500">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Please insert your username"
                    className="appearance-none rounded-lg border-2 border-gray-100 px-4 py-3 placeholder-gray-300 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="my-5 flex w-full flex-col">
                  <label htmlFor="password" className="mb-2 text-gray-500">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Please insert your password"
                    className="appearance-none rounded-lg border-2 border-gray-100 px-4 py-3 placeholder-gray-300 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="my-5 flex w-full flex-col">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-green-600 py-4 text-green-100 hover:bg-green-700"
                  >
                    <div className="flex flex-row items-center justify-center">
                      <svg
                        className="mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      <span className="font-bold">Sigin</span>
                    </div>
                  </button>
                  <div className="mt-5 flex justify-evenly">
                    <a
                      href="#"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Recover password!
                    </a>
                    <a
                      href="#"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Signup!
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
