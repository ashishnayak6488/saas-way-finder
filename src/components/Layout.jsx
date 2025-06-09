import Link from 'next/link';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 text-center">
                    <img
                        src="/avatar.png" // Replace with a valid avatar image
                        alt="Profile"
                        className="w-16 h-16 rounded-full mx-auto"
                    />
                    <h2 className="mt-4 text-lg font-semibold">Ganesh</h2>
                    <p className="text-sm text-gray-500">Joined 6 months ago</p>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard">
                                <a className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-200">
                                    <span className="material-icons mr-3">dashboard</span>
                                    Dashboard
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/content">
                                <a className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-200">
                                    <span className="material-icons mr-3">description</span>
                                    Content
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/playlist">
                                <a className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-200">
                                    <span className="material-icons mr-3">playlist_play</span>
                                    Playlist
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/screen">
                                <a className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-200">
                                    <span className="material-icons mr-3">tv</span>
                                    Screen
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/reports">
                                <a className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-200">
                                    <span className="material-icons mr-3">analytics</span>
                                    Reports
                                </a>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-6 mt-auto">
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        Contact Support
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
    );
};

export default Layout;
