import React, { useMemo, useState } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "pressable";
};

export default function Button({
  variant = "default",
  style,
  className,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  ...props
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  // Exact replica of your .pressablebtn CSS (inline)
  const pressableBase: React.CSSProperties = useMemo(
    () => ({
      background: "#F5C97A",
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      borderRadius: 7,
      boxShadow: "0 7px 0 #6E441A",
      display: "inline-block",
      transition: "all .2s",
      position: "relative",
      padding: "10px 7px",
      top: 0,
      cursor: "pointer",
      border: "none", // matches absence of border in your CSS
    }),
    []
  );

  const pressableActive: React.CSSProperties = useMemo(
    () => ({
      top: 3,
      boxShadow: "0 2px 0 #6E441A",
      transition: "all .2s",
    }),
    []
  );

  // A simple default style (adjust as you like)
  const defaultStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: 16,
      padding: "10px 14px",
      borderRadius: 8,
      cursor: "pointer",
      border: "1px solid rgba(0,0,0,.15)",
      background: "#f5f5f5",
      color: "#111",
      transition: "background-color .2s ease",
    }),
    []
  );

  const variantStyle =
    variant === "pressable"
      ? { ...(pressableBase as object), ...(pressed ? pressableActive : {}) }
      : defaultStyle;

  const mergedStyle: React.CSSProperties = { ...variantStyle, ...style };

  return (
    <button
      {...props}
      className={className}
      style={mergedStyle}
      onMouseDown={(e) => {
        if (variant === "pressable") setPressed(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (variant === "pressable") setPressed(false);
        onMouseUp?.(e);
      }}
      onMouseLeave={(e) => {
        if (variant === "pressable") setPressed(false);
        onMouseLeave?.(e);
      }}
      onTouchStart={(e) => {
        if (variant === "pressable") setPressed(true);
        onTouchStart?.(e);
      }}
      onTouchEnd={(e) => {
        if (variant === "pressable") setPressed(false);
        onTouchEnd?.(e);
      }}
    />
  );
}
