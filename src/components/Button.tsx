import React, { PropsWithChildren } from "react";

function Button(props: PropsWithChildren<{ onClick(): void; disabled?: boolean }>) {
  return <button
    onClick={props.onClick}
    disabled={props.disabled}
    className={`rounded-xl text-white w-32 py-2 my-6 transition-all ${
      props.disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-300'
    }`}
  >
    {props.children}
  </button>;
}

export default Button;
