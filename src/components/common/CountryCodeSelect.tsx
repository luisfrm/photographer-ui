"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface CountryCodeOption {
  id: string;
  code: string;
  country: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { id: "US", code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { id: "ES", code: "+34", country: "Spain", flag: "🇪🇸" },
  { id: "MX", code: "+52", country: "Mexico", flag: "🇲🇽" },
  { id: "CO", code: "+57", country: "Colombia", flag: "🇨🇴" },
  { id: "AR", code: "+54", country: "Argentina", flag: "🇦🇷" },
  { id: "CL", code: "+56", country: "Chile", flag: "🇨🇱" },
  { id: "PE", code: "+51", country: "Peru", flag: "🇵🇪" },
  { id: "VE", code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { id: "GB", code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { id: "FR", code: "+33", country: "France", flag: "🇫🇷" },
  { id: "DE", code: "+49", country: "Germany", flag: "🇩🇪" },
  { id: "IT", code: "+39", country: "Italy", flag: "🇮🇹" },
];

export interface CountryCodeSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CountryCodeSelect({
  value,
  onValueChange,
  disabled,
  className,
}: CountryCodeSelectProps) {
  const selectedOption =
    COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0];

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-[115px] shrink-0 rounded-r-none border-r-0 focus-visible:z-10 focus-visible:ring-offset-0 bg-zinc-50/60 font-medium text-xs sm:text-sm",
          className
        )}
        aria-label="Select country calling code"
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-base leading-none">{selectedOption?.flag}</span>
          <span className="font-semibold text-zinc-900">{selectedOption?.code}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[260px] max-h-72">
        {COUNTRY_CODES.map((item) => (
          <SelectItem key={item.id} value={item.code} className="cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <span className="text-base leading-none">{item.flag}</span>
              <span className="font-semibold text-zinc-900 w-10 shrink-0">
                {item.code}
              </span>
              <span className="text-xs text-zinc-500 truncate max-w-[140px]">
                {item.country}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
