import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const {
    isAuthenticated,
    error: auth0Error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      axios
        .post("http://localhost:5000/api/login", { email: user.email })
        .then((res) => {
          console.log("Token sent to email:", res.data.message);
        })
        .catch((err) => {
          console.error(
            "Error sending token email:",
            err.response?.data || err.message
          );
        });
    }
  }, [isAuthenticated, user]);

  const handleLogin = () => {
    console.log("Attempting to log in...");
    loginWithRedirect({
      appState: { returnTo: window.location.origin },
    }).catch((err) => {
      console.error("Login error:", err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Auth0 Email Demo</h1>
          {isAuthenticated ? (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-lg w-full">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                User Profile
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Authentication details and email options.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.email}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Auth0 User ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.sub}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-lg w-full text-center px-4 py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">
              Authentication Required
            </h2>
            <p className="mt-2 text-gray-600">
              Please log in to access your profile and send authentication
              tokens to your email.
            </p>
            <button
              onClick={handleLogin}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In with Auth0
            </button>

            {auth0Error && (
              <div className="mt-4 bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{auth0Error.message}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
