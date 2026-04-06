import type { ButtonHTMLAttributes } from "react";

export const Button = ({
  message,
  btnType,
}: {
  message: string;
  btnType: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}) => {
  return <button type={btnType}>{message}</button>;
};
