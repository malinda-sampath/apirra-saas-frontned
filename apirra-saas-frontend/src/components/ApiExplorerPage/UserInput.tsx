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
      {label ? (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <input
        type="text"
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export default UserInput;
