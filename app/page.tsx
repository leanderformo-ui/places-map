import MapView from "./MapView";
import PlacesList from "./PlacesList";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Mine steder 🌍
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Klikk på kartet for å lagre steder du har vært. Klikk på et sted i
            lista for å zoome inn.
          </p>
        </header>

        <section className="space-y-4">
          <MapView />
          <PlacesList />
        </section>
      </div>
    </main>
  );
}
