"use client";

import { BookOpen, Users, ShieldCheck } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>
        <p className="mb-12 text-center text-lg text-gray-600">
          Welcome to KitabWale, your ultimate destination for buying and selling
          used books online.
        </p>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <BookOpen className="text-primary h-12 w-12" />
            </div>
            <h2 className="mb-4 text-center text-xl font-semibold">
              Our Mission
            </h2>
            <p className="text-center text-gray-600">
              At KitabWale, we aim to make reading accessible to everyone by
              providing a platform where people can buy and sell their old books
              easily.
            </p>
          </div>

          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <Users className="text-primary h-12 w-12" />
            </div>
            <h2 className="mb-4 text-center text-xl font-semibold">
              Our Community
            </h2>
            <p className="text-center text-gray-600">
              We believe in building a community of book lovers who can share
              their passion for reading while promoting eco-friendly practices.
            </p>
          </div>

          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <ShieldCheck className="text-primary h-12 w-12" />
            </div>
            <h2 className="mb-4 text-center text-xl font-semibold">
              Our Commitment
            </h2>
            <p className="text-center text-gray-600">
              We are committed to providing a secure platform for transactions
              and ensuring customer satisfaction at every step.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="bg-white py-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Why Choose KitabWale?
          </h2>
          <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="transform rounded-lg bg-gray-100 p-6 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 flex items-center justify-center">
                <span className="text-primary text-4xl">📚</span>
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold">
                Wide Selection
              </h3>
              <p className="text-center text-gray-600">
                Thousands of used books available at your fingertips.
              </p>
            </div>

            <div className="transform rounded-lg bg-gray-100 p-6 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 flex items-center justify-center">
                <span className="text-primary text-4xl">📝</span>
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold">
                Easy Listing
              </h3>
              <p className="text-center text-gray-600">
                Sell your old books in just a few clicks.
              </p>
            </div>

            <div className="transform rounded-lg bg-gray-100 p-6 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 flex items-center justify-center">
                <span className="text-primary text-4xl">🔒</span>
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold">
                Secure Transactions
              </h3>
              <p className="text-center text-gray-600">
                Safe payment methods ensure your peace of mind.
              </p>
            </div>

            <div className="transform rounded-lg bg-gray-100 p-6 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 flex items-center justify-center">
                <span className="text-primary text-4xl">🤝</span>
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold">
                Community Driven
              </h3>
              <p className="text-center text-gray-600">
                Join a community of readers and sellers who share your passion.
              </p>
            </div>
          </div>
        </section>

        {/* Images Section */}
        <div className="mt-16 mb-4 flex flex-col items-center gap-4 md:flex-row">
          <img
            src="/images/book1.jpg"
            alt="Books"
            className="mb-4 w-full rounded-lg shadow-md md:mb-0 md:w-[600px]"
          />
          <img
            src="/images/book2.jpg"
            alt="Reading"
            className="w-full rounded-lg shadow-md md:w-[600px]"
          />
        </div>
        <h2 className="mb-4 text-center text-xl font-semibold">
          Join Us Today!
        </h2>
        <p className="mb-8 text-center text-lg text-gray-600">
          Sign up now to start buying and selling your favorite books on
          KitabWale!
        </p>

        <div className="flex justify-center">
          <a
            href="/"
            className="hover:bg-primary-dark rounded-lg bg-blue-500 px-6 py-3 text-white transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
