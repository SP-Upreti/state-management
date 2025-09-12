import { useState, useRef, useEffect, FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../../contexts/AppContext"
import CartSidebar from "../cart/CartSidebar"

interface PropsTypes {
    class: string
}

// Profile Dropdown
const ProfileDropDown = (props: PropsTypes) => {

    const [state, setState] = useState(false)
    const { auth } = useAppContext()
    const profileRef = useRef<HTMLButtonElement>(null)

    const navigation = [
        { title: "Dashboard", path: "/" },
        { title: "Admin Panel", path: "/admin" },
        { title: "Settings", path: "/" },
        { title: "Log out", path: "/", action: 'logout' },
    ]

    const handleNavClick = (item: any) => {
        if (item.action === 'logout') {
            auth.logout();
        }
        setState(false);
    }

    useEffect(() => {
        const handleDropDown = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setState(false);
            }
        }
        document.addEventListener('click', handleDropDown)
    }, [])

    return (
        <div className={`relative ${props.class}`}>
            <div className="flex items-center space-x-4">
                <button ref={profileRef} className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 lg:focus:ring-indigo-600"
                    onClick={() => setState(!state)}
                >
                    <img
                        src={auth.user?.image || "https://randomuser.me/api/portraits/men/46.jpg"}
                        className="w-full h-full rounded-full"
                        alt="Profile"
                    />
                </button>
                <div className="lg:hidden">
                    <span className="block">
                        {auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Guest'}
                    </span>
                    <span className="block text-sm text-gray-500">
                        {auth.user?.email || 'Not logged in'}
                    </span>
                </div>
            </div>
            <ul className={`bg-white top-12 right-0 mt-5 space-y-5 lg:absolute lg:border lg:rounded-md lg:text-sm lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
                {
                    navigation.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                to={item.path}
                                className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
                                onClick={() => handleNavClick(item)}
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default function Navbar() {

    const [menuState, setMenuState] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { cart, auth } = useAppContext();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate("/products");
        }
    }

    const handleCartToggle = () => {
        setCartOpen(!cartOpen);
    }

    // Replace / path with your path
    const navigation = [
        { title: "Fashion", path: "/products" },
        { title: "Grocery", path: "/products" },
        { title: "Accessories", path: "/products" },
        { title: "All Categories", path: "/products" },
    ]

    // Only show admin link for admin users
    if (auth.user?.role === 'admin') {
        navigation.push({ title: "Admin", path: "/admin" });
    }

    return (
        <>
            <nav className="bg-white border-b sticky top-0 z-10" style={{ height: menuState ? "100dvh" : "" }}>
                <div className="flex items-center space-x-8 py-3 px-4 max-w-screen-xl mx-auto md:px-8">
                    <div className="flex-none lg:flex-initial">
                        <Link to="/">
                            <img
                                src="/logo.svg"
                                width={120}
                                height={50}
                                alt="Ecommerce Logo"
                            />
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <div className={`bg-white absolute z-20 w-full top-16 left-0 p-4 border-b lg:static lg:block lg:border-none ${menuState ? '' : 'hidden'}`}>
                            <ul className="mt-12 space-y-5 lg:flex lg:space-x-6 lg:space-y-0 lg:mt-0">
                                {
                                    navigation.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 hover:text-gray-900">
                                            <Link to={item.path}>
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            <ProfileDropDown
                                class="mt-5 pt-5 border-t lg:hidden"
                            />
                        </div>
                        <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-6">
                            <form onSubmit={handleSubmit} className="flex items-center space-x-2 border rounded-md p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-none text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    className="w-full outline-none appearance-none placeholder-gray-500 text-gray-500 sm:w-80"
                                    type="text"
                                    name="value"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                />
                            </form>

                            {/* Cart Button */}
                            <button
                                onClick={handleCartToggle}
                                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L2 21m5-8v8m0-8h10m-9 8h9" />
                                </svg>
                                {cart.totals.totalQuantity > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.totals.totalQuantity > 99 ? '99+' : cart.totals.totalQuantity}
                                    </span>
                                )}
                            </button>

                            {/* Auth Section */}
                            {auth.isAuthenticated ? (
                                <ProfileDropDown class="hidden lg:block" />
                            ) : (
                                <div className="hidden lg:flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            <button
                                className="outline-none text-gray-400 block lg:hidden"
                                onClick={() => setMenuState(!menuState)}
                            >
                                {
                                    menuState ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                    )
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    )
}