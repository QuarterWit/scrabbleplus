import React from "react";

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Section({ id, title, subtitle, className = "", children }: Props) {
  return (
    <section
  id={id}
  //border-4 border-red-200
  className={`w-full h-full  mx-auto px-4 py-5 flex flex-col items-center ${className}`}
>
  {title && <h2 className="text-2xl font-bold mb-1 text-center">{title}</h2>}
  {subtitle && <p className="text-sm text-gray-500 mb-6 text-center">{subtitle}</p>}
  {children}
</section>

  );
}
