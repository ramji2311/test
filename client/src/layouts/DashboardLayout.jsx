function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6D4C41] text-white p-5">
        <h1 className="text-2xl font-bold mb-10">
          Miara
        </h1>

        <nav className="space-y-4">
          <button className="block w-full text-left hover:text-yellow-300">
            Dashboard
          </button>

          <button className="block w-full text-left hover:text-yellow-300">
            Orders
          </button>

          <button className="block w-full text-left hover:text-yellow-300">
            Customers
          </button>

          <button className="block w-full text-left hover:text-yellow-300">
            Calendar
          </button>

          <button className="block w-full text-left hover:text-yellow-300">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#F8F6F2] p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;