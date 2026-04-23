import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm shadow-gray-200/20">
        <div className="flex items-center justify-between px-4 h-14 relative">
          <Link className="hover:opacity-70 transition-opacity" href="/">
            <Image
              src="/logo.png"
              alt="Corea Hoy"
              width={96}
              height={38}
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="flex items-center gap-3">
            <button className="text-xl p-1 text-gray-600 cursor-pointer">🔍</button>
            <div className="relative">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer group">
                <span className="text-base leading-none">🌐</span>
                <span className="leading-none">ES</span>
                <span className="text-[10px] text-gray-400 transition-transform duration-200 ">
                  ▼
                </span>
              </button>
            </div>
            <Link
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              href="/login"
            >
              Iniciar sesión
            </Link>
          </div>
          <ul className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-black text-white border-black shadow-md shadow-black/10">
              Todos
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              K-POP
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              Drama
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              Noticias
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              Cultura
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              Deportes
            </li>
            <li className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white text-gray-500 border-gray-200 hover:border-gray-400">
              Comida
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
