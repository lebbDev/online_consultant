import { useState } from "react";
import { SymptomsSelector } from "./components/symptoms-selector"
import { Button } from "./components/ui/button"
import { MultiSelectComboBox, type OptionType } from "./components/ui/multiple-combobox";

const frameworks: OptionType[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
];

function App() {

  const [selectedFrameworks, setSelectedFrameworks] = useState<OptionType[]>([]);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Выберите фреймворки:</h1>
      <MultiSelectComboBox
        options={frameworks}
        selected={selectedFrameworks}
        onChange={setSelectedFrameworks}
        placeholder="Выберите один или несколько фреймворков..."
        className="w-[400px]"
      />
      <div className="mt-4">
        <p>Выбранные фреймворки:</p>
        <ul>
          {selectedFrameworks.map(fw => (
            <li key={fw.value}>{fw.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
