import calliu from "/calliu.png";
import logo from "/logo_colors.svg";

export function PresentationSplashScreen() {
  return (
    <div className="w-screen h-screen bg-default flex flex-row overflow-hidden items-center justify-center animate-pulse">
      <div className="h-screen flex justify-center items-center w-[50vw] bg-[#13261f]">
        <img src={calliu} className="content relative" alt="calliu" />
      </div>
      <div className="h-screen flex justify-center items-center w-[50vw]">
        <img src={logo} className="h-56" alt="logo colors" />
      </div>
    </div>
  );
}
