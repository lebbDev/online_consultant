"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils"; // Утилита для классов из shadcn
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectComboBoxProps {
  options: OptionType[];
  selected: OptionType[];
  onChange: React.Dispatch<React.SetStateAction<OptionType[]>>;
  placeholder?: string;
  className?: string;
}

export function MultiSelectComboBox({
  options,
  selected,
  onChange,
  placeholder = "Выберите...",
  className,
}: MultiSelectComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(""); // Для управления вводом в CommandInput

  const handleSelect = (option: OptionType) => {
    onChange((prevSelected) =>
      prevSelected.some((item) => item.value === option.value)
        ? prevSelected.filter((item) => item.value !== option.value)
        : [...prevSelected, option]
    );
    setInputValue(""); // Очищаем ввод после выбора
  };

  const handleRemove = (option: OptionType) => {
    onChange((prevSelected) =>
      prevSelected.filter((item) => item.value !== option.value)
    );
  };

  // Опции, которые еще не выбраны
  const availableOptions = options.filter(
    (option) => !selected.some((s) => s.value === option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10" // Автоматическая высота
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge
                  variant="secondary"
                  key={item.value}
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем открытие/закрытие Popover
                    handleRemove(item);
                  }}
                >
                  {item.label}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Поиск..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              {availableOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value} // Убедитесь, что value здесь уникально и соответствует option.value
                  onSelect={() => {
                    handleSelect(option);
                    // setOpen(false); // Можно оставить открытым для множественного выбора
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.some((s) => s.value === option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {selected.length > 0 && (
                 <CommandGroup heading="Выбранные">
                    {selected.map((option) => (
                        <CommandItem
                            key={`selected-${option.value}`}
                            value={`selected-${option.value}`}
                            onSelect={() => {
                                handleSelect(option); // Позволит убрать выбор
                            }}
                            className="opacity-70" // Можно добавить стиль для выбранных
                        >
                             <Check className="mr-2 h-4 w-4 opacity-100" />
                            {option.label}
                        </CommandItem>
                    ))}
                 </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}