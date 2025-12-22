import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h1 className="text-7xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Siden ble ikke funnet
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          Siden du leter etter eksisterer ikke eller har blitt flyttet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild>
            <Link href="/">Gå til hjemmesiden</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/viineja-luettelo">Bla gjennom viner</Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Hurtiglenker
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/viinit-luettelo"
              className="text-gray-600 hover:underline"
            >
              Vinartikler
            </Link>
            <Link
              href="/yrityksen-profiili"
              className="text-gray-600 hover:underline"
            >
              Selskapsprofil
            </Link>
            <Link href="/tiimimme" className="text-gray-600 hover:underline">
              Vårt team
            </Link>
            <Link
              href="/ota-yhteytta"
              className="text-gray-600 hover:underline"
            >
              Kontakt oss
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
