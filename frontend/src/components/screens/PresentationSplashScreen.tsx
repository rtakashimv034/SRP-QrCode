import logo from "/logo_colors.svg";
export function PresentationSplashScreen() {
  return (
    <div className="w-screen h-screen bg-default flex overflow-hidden items-center justify-center animate-pulse">
      <img src={logo} alt="logo colors" />
    </div>
  );
}
