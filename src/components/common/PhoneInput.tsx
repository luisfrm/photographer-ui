"use client";

import CountryCodeSelect, {
  COUNTRY_CODES,
} from "@/components/common/CountryCodeSelect";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: "default" | "sm";
}

/** Helper to extract countryCode and raw number from a phone string */
function parsePhone(value?: string) {
  if (!value) return { countryCode: "+1", number: "" };
  const trimmed = value.trim();
  // Find matching country code sorted by length descending (e.g. +58 before +5)
  const sortedCodes = [...COUNTRY_CODES].sort(
    (a, b) => b.code.length - a.code.length
  );
  const matched = sortedCodes.find((c) => trimmed.startsWith(c.code));
  if (matched) {
    return {
      countryCode: matched.code,
      number: trimmed.slice(matched.code.length).trim(),
    };
  }
  return { countryCode: "+1", number: trimmed };
}

export default function PhoneInput({
  id,
  value = "",
  onChange,
  placeholder = "(555) 000-0000",
  disabled = false,
  required = false,
  className,
  size = "default",
}: PhoneInputProps) {
  const { countryCode, number } = parsePhone(value);

  const handleCountryChange = (newCode: string) => {
    const combined = number ? `${newCode} ${number}` : newCode;
    onChange?.(combined);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    const combined = newNumber ? `${countryCode} ${newNumber}` : "";
    onChange?.(combined);
  };

  const heightClass = size === "sm" ? "h-8 text-xs" : "h-10 text-sm";

  return (
    <div className={cn("flex rounded-md shadow-2xs items-stretch", className)}>
      <CountryCodeSelect
        value={countryCode}
        onValueChange={handleCountryChange}
        disabled={disabled}
        className={cn(heightClass, "rounded-r-none border-r-0")}
      />
      <Input
        id={id}
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(heightClass, "rounded-l-none focus-visible:z-10")}
      />
    </div>
  );
}
