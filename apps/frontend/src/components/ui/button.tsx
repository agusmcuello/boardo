import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    if (asChild && props.children) {
      return <>{props.children}</>;
    }

    const classes = [styles.button, styles[variant], styles[size], className]
      .filter(Boolean)
      .join(" ");

    return <button className={classes} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
