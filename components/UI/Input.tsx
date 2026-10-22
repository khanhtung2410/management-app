import { useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({
    label,
    error,
    id,
    className = "",
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...inputProps
}: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const describedBy = [ariaDescribedBy, error ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className="flex-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                {...inputProps}
                id={inputId}
                aria-describedby={describedBy}
                aria-invalid={error ? true : ariaInvalid}
                className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                } ${className}`}
            />
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
