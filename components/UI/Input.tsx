// Hiển thị input văn bản có nhãn và lỗi truy cập được; không dùng cho textarea, select hoặc điều khiển không phải input.
import { useId, type InputHTMLAttributes } from "react";

interface InputProps {
    label?: string;
    error?: string;
    /** Class for the outer layout wrapper. */
    className?: string;
    /** Native props and styles for the input element. */
    input?: InputHTMLAttributes<HTMLInputElement>;
}

export function Input({
    label,
    error,
    className = "",
    input = {},
}: InputProps) {
    const {
        id,
        className: inputClassName = "",
        "aria-describedby": ariaDescribedBy,
        "aria-invalid": ariaInvalid,
        ...inputProps
    } = input;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const describedBy = [ariaDescribedBy, error ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className={`flex-1 ${className}`.trim()}>
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
                className={`w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${error
                    ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-600"
                    : "border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-600"
                    } ${inputClassName}`.trim()}
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
