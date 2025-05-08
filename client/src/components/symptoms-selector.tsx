import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Убедитесь, что путь к вашим компонентам верный

// 1. Определяем тип для элементов
interface ItemType {
  value: string;
  label: string;
}

// 2. Типизируем наш полный список данных
const ALL_ITEMS: ItemType[] = [
  { value: "apple", label: "Яблоко" },
  { value: "banana", label: "Банан" },
  { value: "orange", label: "Апельсин" },
  { value: "grape", label: "Виноград" },
  { value: "pineapple", label: "Ананас" },
  { value: "strawberry", label: "Клубника" },
  { value: "blueberry", label: "Голубика" },
  { value: "raspberry", label: "Малина" },
  { value: "mango", label: "Манго" },
  { value: "kiwi", label: "Киви" },
  // ... добавьте сюда много элементов
];

export function SymptomsSelector() {
  const [inputValue, setInputValue] = React.useState<string>("");
  // 3. Типизируем состояние filteredItems
  const [filteredItems, setFilteredItems] = React.useState<ItemType[]>([]);

  React.useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredItems([]);
      return;
    }

    // 4. Тип item в filter будет выведен корректно, но можно и явно указать (item: ItemType)
    const results = ALL_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(results);
  }, [inputValue]);

  // 5. Типизируем параметр selectedValue и логику поиска
  const handleSelect = (selectedValue: string) => {
    // selectedValue - это то, что было передано в prop 'value' компонента CommandItem
    const item = ALL_ITEMS.find(i => i.value === selectedValue);

    if (item) {
      console.log("Выбрано:", item.label);
      // Здесь можно сделать что-то с выбранным элементом (item)
      setInputValue(""); // Очистить инпут после выбора (опционально)
    }
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Например, кашель..."
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        {inputValue.trim() !== "" && filteredItems.length === 0 && (
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
        )}

        {inputValue.trim() !== "" &&
          // 6. Типизируем параметр item в map
          filteredItems.map((item: ItemType) => (
            <CommandItem
              key={item.value}
              // Важно: 'value' здесь должно быть строкой (или числом),
              // которая будет передана в onSelect.
              // Используем item.value, так как он обычно уникален.
              value={item.value}
              onSelect={handleSelect} // onSelect получит item.value
            >
              {item.label}
            </CommandItem>
          ))}
      </CommandList>
    </Command>
  );
}