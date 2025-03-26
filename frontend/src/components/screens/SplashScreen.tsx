export function SplashScreen() {
  return (
    <div className="w-screen h-screen overflow-hidden grid grid-cols-[20%_80%] space-x-8 bg-default p-20 child:rounded-lg">
      <aside className="grid grid-rows-[20%_80%] space-y-8 child:rounded-lg">
        {/* Card do usuário com efeito de loading */}
        <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
          </div>
        </div>

        {/* Menu com efeito de loading */}
        <div className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main content com efeito de loading */}
      <main className="rounded-lg bg-white py-6 px-5 flex flex-col overflow-hidden">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
