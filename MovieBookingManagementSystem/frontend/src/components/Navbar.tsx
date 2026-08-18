import { Link } from "@tanstack/react-router";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          🎬 MovieBook
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-sm hover:text-blue-600"
          >
            Movies
          </Link>

          {token && (
            <Link
              to="/my-bookings"
              className="text-sm hover:text-blue-600"
            >
              My Bookings
            </Link>
          )}

          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;