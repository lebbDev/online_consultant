import { useState } from "react";
import { SymptomsSelector } from "./components/Symptoms-selector";
import { Button } from "./components/ui/button";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./components/ui/command";

function App() {
  return (
    <div className="p-4 pl-10">
      <h1 className="text-2xl">
        ОНЛАЙН-КОНСУЛЬТАНТ по направлению к медицинским специалистам
      </h1>
      <h2 className="mt-5 text-lg">Введите ваши данные:</h2>

      <div className="flex mt-2">
        <div>
          <h2>Пол</h2>
          <RadioGroup>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="man" id="man" />
              <Label htmlFor="man">мужчина</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="women" id="women" />
              <Label htmlFor="women">женщина</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="ml-9 max-w-[80px]">
          <h2>Возраст</h2>
          <Input />
        </div>
      </div>

      <Button variant="outline" className="mt-5">
        Подтвердить
      </Button>
      <Button variant="outline" className="mt-5">
        Сбросить
      </Button>

      <div>
        <h2 className="mt-10 text-lg">Какие проблемы вас беспокоят?</h2>
        <SymptomsSelector />
      </div>
    </div>
  );
}

export default App;

// const frameworks: OptionType[] = [
//   { value: "next.js", label: "Next.js" },
//   { value: "sveltekit", label: "SvelteKit" },
//   { value: "nuxt.js", label: "Nuxt.js" },
//   { value: "remix", label: "Remix" },
//   { value: "astro", label: "Astro" },
//   { value: "react", label: "React" },
//   { value: "vue", label: "Vue.js" },
//   { value: "angular", label: "Angular" },
// ];

// const [selectedFrameworks, setSelectedFrameworks] = useState<OptionType[]>([]);
// h1 className="text-xl mb-4">Выберите фреймворки:</h1>
//       <MultiSelectComboBox
//         options={frameworks}
//         selected={selectedFrameworks}
//         onChange={setSelectedFrameworks}
//         placeholder="Выберите один или несколько фреймворков..."
//         className="w-[400px]"
//       />
//       <div className="mt-4">
//         <p>Выбранные фреймворки:</p>
//         <ul>
//           {selectedFrameworks.map(fw => (
//             <li key={fw.value}>{fw.label}</li>
//           ))}
//         </ul>
//       </div>
