import Image from "next/image";

interface LogoProps {
  className?: string;
  height?: number;
  width?: number;
}
export const Logo = ({ className, height = 50, width = 50 }: LogoProps) => {
  return (
    <div className="flex flex-col items-center ">
      <Image
        src="/images/dried-fruit.webp"
        alt="Picture of the author"
        width={width}
        height={height}
      />
      <h1 className="text-slate-700 text-lg font-serif italic">ThaiFruitz</h1>
    </div>
  );
};
