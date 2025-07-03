import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  name: string;
  options: { value: string | number; label: string }[];
  value: string | number | null;
  onChange: (selectedOption: { value: string | number; label: string } | null) => void;
  placeholder: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(value || "");

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleChange = (newValue: string) => {
    const selectedOption = options.find((item) => String(item.value) === newValue) || null;
    setSelectedValue(selectedOption ? selectedOption.value : null);
    onChange(selectedOption);
  };

  return (
    <div className="select-field">
      <Select value={String(selectedValue)} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item.value} value={String(item.value)}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
