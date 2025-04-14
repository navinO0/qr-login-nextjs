"use client";
import useProtectedRoute from '@/core/protectedRoute';
// pages/index.js
import Head from 'next/head';

export default function Home() {
  useProtectedRoute()
  return (
    <>
      <Head>
        <title>Realtime Whiteboard & QR Auth</title>
        <meta
          name="description"
          content="Secure, seamless whiteboard collaboration with QR login."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="bg-gray-50 text-gray-800 font-inter">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-100 to-indigo-200 py-24 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 font-poppins mb-6 leading-tight">
            Bring Ideas to Life with Real-Time Whiteboarding
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Collaborate visually with your team in real-time. Draw, write, share,
            and brainstorm ideas anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="white-board/create-room"
              className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              🎨 Create a Room
            </a>
            <a
              href="white-board/join"
              className="border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 hover:text-white transition"
            >
              🔗 Join with Room Code
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🔐',
                title: 'QR Code Authentication',
                desc: 'Scan and login instantly with your phone — no passwords, no hassle.',
              },
              {
                icon: '🧑‍🤝‍🧑',
                title: 'Real-Time Collaboration',
                desc: 'Multiple users drawing and writing together — just like a real whiteboard.',
              },
              {
                icon: '⚙️',
                title: 'Built with Fast Tech',
                desc: 'Fastify, Next.js, Socket.IO, and Mediasoup power the real-time engine.',
              },
              {
                icon: '💾',
                title: 'Persistent Storage',
                desc: 'All sessions saved with Redis and PostgreSQL — pick up where you left off.',
              },
              {
                icon: '📱',
                title: 'Device Friendly',
                desc: 'Use on mobile, tablet, or desktop — all fully responsive.',
              },
              {
                icon: '🔒',
                title: 'End-to-End Security',
                desc: 'QR-based login + encrypted channels = peace of mind.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
