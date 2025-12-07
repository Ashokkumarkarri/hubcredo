import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 animate-in fade-in duration-700">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="px-8 py-3 text-lg">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
