import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Share2 } from 'lucide-react';

const Home: React.FC = () => {


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-gray-100">
      <header className="container mx-auto p-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-400">SecureVault</Link>
          <div>
            <Link to="/login" className="mr-2 text-indigo-300 hover:text-indigo-100 px-4 py-2 rounded hover:bg-indigo-800">
              Login
            </Link>
            <Link to="/Login" className="text-indigo-300 border border-indigo-400 px-4 py-2 rounded hover:bg-indigo-800">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto mt-16 px-4">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 z-100">
            Your Digital Fortress Awaits
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Unleash the power of quantum-resistant encryption. Your files, your control, our ironclad protection.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-indigo-400" />}
            title="Impenetrable Security"
            description="Our cutting-edge encryption algorithms create an unbreakable shield around your data, ensuring it remains for your eyes only."
          />
          <FeatureCard
            icon={<Lock className="h-12 w-12 text-indigo-400" />}
            title="Zero-Knowledge Privacy"
            description="We can't peek, we can't pry. Your secrets are locked away with a key that only you possess. True privacy, guaranteed."
          />
          <FeatureCard
            icon={<Share2 className="h-12 w-12 text-indigo-400" />}
            title="Seamless Sharing"
            description="Share your protected files with the confidence of a digital locksmith. You control who gets the key, for how long, and when it expires."
          />
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Digital World?</h2>
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold">
            Get Started Now
          </Link>
        </section>
      </main>

      <footer className="mt-16 py-8 bg-gray-800 text-center text-indigo-200">
        <p>&copy; 2023 SecureVault. All rights reserved. Your trust, our priority.</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default Home;

