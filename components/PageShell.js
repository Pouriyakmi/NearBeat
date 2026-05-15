import Head from 'next/head';
import FloatingOrbs from './FloatingOrbs';
import NavBar from './NavBar';

export default function PageShell({ children, title = 'NearBeat' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="NearBeat is a social music presence prototype for nearby listeners."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative min-h-screen overflow-hidden bg-night text-white">
        <FloatingOrbs />
        <div className="noise-layer" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <NavBar />
          {children}
        </div>
      </main>
    </>
  );
}
