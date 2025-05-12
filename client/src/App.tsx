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

  const [UserSymptoms, setUserSymptoms] = useState<Symptom[]>([]);
  const [SymptomsList, setSymptomsList] = useState<Symptom[]>([]);
  const [GetResult, setGetResult] = useState(false);
  const [UserPredict, setUserPredict] = useState<Predict | null>(null);

  const handleConfirm = () => {
    if (gender && age) {
      setConfirmed(true);

      // получаем список симптомов
      fetch("http://localhost:8000/data", {
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
    }
  };

  const handleReset = () => {
    setGender(null);
    setAge(null);
    setConfirmed(false);

    setUserSymptoms([]);
    setSymptomsList([])
    setGetResult(false);
    setUserPredict(null)
  };

  const handleGetResult = () => {
    if (UserSymptoms) {
      setGetResult(true);
      setUserPredict(null)
      
      // отправляем симптомы
      fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(UserSymptoms)
      })
      .then(res => res.json())
      .then(data => setUserPredict(data))
      .catch(err => console.error(err));
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
              <RadioGroupItem value="woman" id="woman" />
              <Label htmlFor="woman" className="text-base">
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

              if (val === "") {
                setAge(null);
                return;
              }

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
          options={SymptomsList ?? ""}
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
      {
      GetResult && !UserPredict ? (
        <div className="mt-[100px] max-w-115 relative">
          <CircularProgress className="absolute right-0" />
        </div>
      )
      : GetResult && UserPredict ? (
        <Card className="mt-10 max-w-230">
          <CardHeader>
            <CardTitle className="text-2xl">Ваш результат на основе выбранных симптомов</CardTitle>
          </CardHeader>
          <CardContent className="text-xl underline underline-offset-6">
            {
              UserPredict.prob === "high" ? (
                <p>Высокая вероятность необходимости посещения специалиста - <span className="font-bold">{UserPredict.spec}</span></p>
              )
              : UserPredict.prob === "average" ? (
                <p>Средняя вероятность необходимости посещения специалиста - <span className="font-bold">{UserPredict.spec}</span></p>
              )
              : (
                <p>Программа не может точно сказать к какому специалисту Вам обратиться. Возможно стоит добавить больше симптомов.</p>
              )
            }
          </CardContent>
          <CardFooter>
            <p>Если у вас возникают сомнения Вы можете обратиться к <span className="font-bold">{UserPredict.second_spec + "у"}</span> или к врачу общей практики <span className="font-bold">(ВОП)</span> для более точной диагностики.</p>
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
