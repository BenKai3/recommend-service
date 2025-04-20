import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/register" className="text-white hover:underline">
            Register
          </Link>
        </li>
        <li>
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}