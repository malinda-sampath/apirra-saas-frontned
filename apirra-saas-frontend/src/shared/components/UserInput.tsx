import React from "react";

type UserInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const UserInput: React.FC<UserInputProps> = ({
  label = "User Input",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <input
        type="text"
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-blue-400 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/20 ${className}`}
        {...props}
      />
    </div>
  );
};

export default UserInput;
