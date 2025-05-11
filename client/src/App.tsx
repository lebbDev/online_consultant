import { useState } from "react";
import { Button } from "./components/ui/button";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Symptom {
  value: string;
  label: string;
}

// const test: Symptom[] = [
// ];

const symptoms = [
  { value: "кашель", label: "Кашель" },
  { value: "головная боль", label: "Головная боль" },
  { value: "общая слабость", label: "Общая слабость" },
  { value: "озноб", label: "Озноб" },
  { value: "потеря аппетита", label: "Потеря аппетита" },
  { value: "зуд в горле", label: "Зуд в горле" },
  { value: "головокружение", label: "Головокружение" },
  {
    value: "боль во время дефекации",
    label: "Боль во время дефекации",
  },
  {
    value: "изменение характера выделений из влагалища",
    label: "Изменение характера выделений из влагалища",
  },
  {
    value: "появление уплотнений или образований в молочных железах",
    label: "Появление уплотнений или образований в молочных железах",
  },
  {
    value: "красные, синие или фиолетовые сосудистые образования",
    label: "Красные, синие или фиолетовые сосудистые образования",
  },
];

function App() {
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [UserSymptoms, setUserSymptoms] = useState<Symptom[]>([]);
  const [GetResult, setGetResult] = useState(false);

  const handleConfirm = () => {
    if (gender && age) {
      setConfirmed(true);
      // получаем список симптомов
      console.log(gender);
      console.log(age);
    }
  };

  const handleReset = () => {
    setGender(null);
    setAge(null);
    setConfirmed(false);
    setUserSymptoms([]);
    setGetResult(false);
  };

  const handleGetResult = () => {
    if (UserSymptoms && age && gender) {
      setGetResult(true);
      // отправляем симптомы
      console.log(UserSymptoms);
    }
  };

  return (
    <div className="p-4 pl-10 pr-10 h-[1000px]">
      <Card className="bg-blue-400 text-white max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ОНЛАЙН-КОНСУЛЬТАНТ
          </CardTitle>
          <CardDescription className="text-xl text-white">
            по направлению к медицинским специалистам
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex relative mt-9 max-w-[393px]">
        <h2 className="text-xl font-medium">Введите ваши данные:</h2>
        <div className="flex absolute right-0 bottom-0">
          <p className="mr-1">*зачем это нужно?</p>
          <Tooltip
            disableFocusListener
            disableTouchListener
            title="Данные о возрасте и поле учитываются при формировании списка симптомов и в конечном результате"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </div>
      </div>

      <div className="mt-4 flex">
        <div>
          <h2 className="text-lg">Пол</h2>
          <RadioGroup value={gender ?? ""} onValueChange={setGender}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="man" id="man" />
              <Label htmlFor="man" className="text-base">
                мужчина
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="women" id="women" />
              <Label htmlFor="women" className="text-base">
                женщина
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="ml-9 max-w-[80px]">
          <h2 className="text-lg">Возраст</h2>
          <Input
            className="mt-2"
            type="string"
            value={age ?? ""}
            onChange={(e) => {
              const val = e.target.value;

              // Разрешаем пустое значение (чтобы можно было стереть)
              if (val === "") {
                setAge(null);
                return;
              }

              // Разрешаем только целые числа от 0 до 120
              const num = Number(val);
              if (/^\d+$/.test(val) && num >= 0 && num <= 120) {
                setAge(val);
              }
            }}
          />
        </div>
      </div>

      {!confirmed ? (
        <Button
          variant="outline"
          className="mt-7 bg-blue-400 hover:bg-blue-500 text-white hover:text-white"
          onClick={handleConfirm}
          disabled={!(gender && age)}
        >
          Подтвердить
        </Button>
      ) : (
        <Button
          variant="outline"
          className="mt-7 bg-blue-400 hover:bg-blue-500 text-white hover:text-white"
          onClick={handleReset}
        >
          Сбросить
        </Button>
      )}

      <h2 className="mt-8 text-xl font-medium">
        Какие проблемы вас беспокоят?
      </h2>
      <div>
        <Autocomplete
          className="mt-5 max-w-180"
          multiple
          id="tags-outlined"
          options={symptoms ?? ""}
          getOptionLabel={(option) => option.label}
          filterSelectedOptions
          noOptionsText="Симптомы не найдены"
          value={UserSymptoms}
          onChange={(e, newValue) => {
            setUserSymptoms(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Выберите симптомы"
              placeholder="Вы выбрали"
            />
          )}
        />

        <Button
          variant="outline"
          className="mt-7 bg-blue-400 hover:bg-blue-500 text-white hover:text-white"
          onClick={handleGetResult}
          disabled={UserSymptoms.length ? false : true}
        >
          Получить результат
        </Button>
      </div>
      {GetResult ? (
        <Card className="mt-10 max-w-230">
          <CardHeader>
            <CardTitle className="text-2xl">Ваш результат на основе выбранных симптомов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl underline underline-offset-4">Высокая вероятность необходимости посещения специалиста - НЕВРОЛОГ</p>
          </CardContent>
          <CardFooter>
            <p>*Если у вас возникают сомнения о правильности выбранного специалиста, Вы можете обратиться к Терапевту или к врачу общей практики (ВОП) для более точной диагностики.</p>
          </CardFooter>
        </Card>
      )
      : (
        <div></div>
      )
      }
    </div>
  );
}

export default App;
