import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  isError = false,
  errorMessage = '',
}) => {
  return (
    <form className="w-[100%] mb-[1rem]">
      <input
        className={`w-[100%] h-[3.5rem] px-[2rem]   ${isError ? 'border-[2px] border-negative' : 'border-[1px] border-border-default'} rounded-[5px] text-available-medium-16 text-text-light bg-surface-default`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {isError ? (
        <label className="text-negative  text-available-medium-14">{errorMessage}</label>
      ) : (
        ''
      )}
    </form>
  );
};

export default InputField;
