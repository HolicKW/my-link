import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-md relative">
        {/* subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full -z-10" />

        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col items-center">

          {/* Avatar Area */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700/50 overflow-hidden shrink-0 flex items-center justify-center">
              {/* Optional: Add a real image src later. Using an icon or placeholder for now. */}
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-zinc-200 to-zinc-500 whitespace-nowrap px-2">
                하매뎡
              </span>
            </div>
          </div>

          {/* Profile Basic Info */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">함대영 / 하매뎡</h1>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-400">
              <span className="bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                🎮 게임기획자
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-3 font-medium">
              게이머의 심장으로 기획하고, 개발자의 머리로 설계합니다.
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full space-y-3">
            <a
              href="https://github.com/HolicKW"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-400 group-hover:text-white transition-colors"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">GitHub</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all expected"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
