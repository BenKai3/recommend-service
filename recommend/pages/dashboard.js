import Navigation from '../components/Navigation';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your dashboard. Here you’ll see your media lists and recommendations.</p>
      </div>
    </div>
  );
}