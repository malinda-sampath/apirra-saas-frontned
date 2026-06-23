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
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </label>
      )}
      <input
        type="text"
        className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </div>
  );
};

export default UserInput;
