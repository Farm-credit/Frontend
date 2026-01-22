import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-black text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-orange-400">Farm</span>
            <span className="text-lime-500">Credit</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/marketplace" 
            className="text-gray-300 hover:text-white transition-colors duration-200 font-semibold"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </nav>
  );
}
