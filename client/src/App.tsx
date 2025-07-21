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
import CircularProgress from '@mui/material/CircularProgress';
import pharmacyIcon from "@/assets/pharmacy.png";

interface Symptom {
  value: string;
  label: string;
}

interface Predict {
  prob: string;
  spec: string;
  second_spec: string;
}

function App() {
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [userSymptoms, setUserSymptoms] = useState<Symptom[]>([]);
  const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictResult, setPredictResult] = useState<Predict | null>(null);

  const isFormValid = gender && age;

  const host = import.meta.env.VITE_API_HOST;
  const port = import.meta.env.VITE_API_PORT;

  const handleConfirm = () => {
    if (!isFormValid) return;

    setConfirmed(true);

    // получаем список симптомов
    fetch(`http://${host}:${port}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "gender": gender,
        "age": age
      })
    })
      .then(res => res.json())
      .then(data => setSymptomsList(data))
      .catch(err => console.error(err));
  };

  const handleReset = () => {
    setGender(null);
    setAge(null);
    setConfirmed(false);
    setUserSymptoms([]);
    setSymptomsList([])
    setIsLoading(false);
    setPredictResult(null)
  };

  const handleGetResult = () => {
    if (!userSymptoms.length) return;

    setIsLoading(true);
    setPredictResult(null)
      
    // отправляем симптомы
    fetch(`http://${host}:${port}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userSymptoms)
    })
      .then(res => res.json())
      .then(data => {
        setPredictResult(data)
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <div className="mt-[100px] max-w-115 relative">
          <CircularProgress className="absolute right-0" />
        </div>
      );
    }

    if (!predictResult) return null;

    const { prob, spec, second_spec } = predictResult;

    return (
      <Card className="mt-10 max-w-230">
        <CardHeader>
          <CardTitle className="text-2xl">
            Ваш результат на основе выбранных симптомов
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xl underline underline-offset-6">
          {prob === "high" ? (
            <p>
              Высокая вероятность необходимости посещения специалиста{" "}
              <span className="font-bold">{spec + "а"}</span>
            </p>
          ) : prob === "average" ? (
            <p>
              Средняя вероятность необходимости посещения специалиста{" "}
              <span className="font-bold">{spec + "а"}</span>
            </p>
          ) : (
            <p>
              Программа не может точно сказать к какому специалисту Вам
              обратиться. Возможно стоит добавить больше симптомов.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <p>
            Если у вас возникают сомнения, обратитесь к{" "}
            <span className="font-bold">{second_spec + "у"}</span> или к врачу
            общей практики <span className="font-bold">(ВОП)</span> для более
            точной диагностики.
          </p>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="p-4 pl-10 pr-10 h-[1000px]">
      {/* Header */}
      <div className="flex relative h-25">
        <Card className="absolute left-0 bg-blue-400 text-white min-w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">ОНЛАЙН-КОНСУЛЬТАНТ</CardTitle>
            <CardDescription className="text-xl text-white">
              по направлению к медицинским специалистам
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="absolute right-0 border-red-500 border-5 min-w-[300px] h-[120px]">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              <div className="flex relative">
                <p className="text-red-500">ДокЗнаток</p>
                <img
                  src={pharmacyIcon}
                  alt="pharmacy"
                  className="absolute right-0 bottom-[-25px] w-[43px] h-[43px]"
                />
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Form section */}
      <div className="flex relative mt-9 max-w-[393px]">
        <h2 className="text-xl font-medium">Введите ваши данные:</h2>
        <div className="flex absolute right-0 bottom-0">
          <p className="mr-1">*зачем это нужно?</p>
          <Tooltip title="Данные о возрасте и поле учитываются при формировании списка симптомов и в конечном результате">
            <HelpOutlineIcon />
          </Tooltip>
        </div>
      </div>

      <div className="mt-4 flex">
        <div>
          <h2 className="text-lg">Пол</h2>
          <RadioGroup value={gender ?? ""} onValueChange={setGender}>
            {["man", "woman"].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value} className="text-base">
                  {value === "man" ? "мужчина" : "женщина"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="ml-9 max-w-[80px]">
          <h2 className="text-lg">Возраст</h2>
          <Input
            className="mt-2"
            value={age ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return setAge(null);
              const num = Number(val);
              if (/^\d+$/.test(val) && num >= 0 && num <= 120) {
                setAge(val);
              }
            }}
          />
        </div>
      </div>

      <Button
        variant="outline_blue"
        className="mt-7"
        onClick={confirmed ? handleReset : handleConfirm}
        disabled={!isFormValid && !confirmed}
      >
        {confirmed ? "Сбросить" : "Подтвердить"}
      </Button>

      {/* Symptoms section */}
      <h2 className="mt-8 text-xl font-medium">Какие проблемы вас беспокоят?</h2>

      <Autocomplete
        className="mt-5 max-w-180"
        multiple
        id="tags-outlined"
        options={symptomsList}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        noOptionsText="Симптомы не найдены"
        value={userSymptoms}
        onChange={(_, newValue) => setUserSymptoms(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Выберите симптомы" placeholder="Вы выбрали" />
        )}
      />

      <Button
        variant="outline_blue"
        className="mt-7"
        onClick={handleGetResult}
        disabled={!userSymptoms.length}
      >
        Получить результат
      </Button>

      {/* Result */}
      {renderResult()}
    </div>
  );
}

export default App;