import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Delete, Plus, PlusSquare, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SerieType } from "./MySeries";

type FormDataType = {
  titre: string;
  synopsis: string;
  episodes: number[];
};

export default function NewSeries() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "episodes" as never,
  });

  useEffect(() => {
    document.title = "Serie Sync - Créer une série";
  }, []);

  const onSubmit = (data: FormDataType) => {
    let series: SerieType[] = [];
    if (localStorage.getItem("series")) {
      series = JSON.parse(localStorage.getItem("series")!) as SerieType[];
    }
    const newSerie: SerieType = {
      titre: data.titre,
      synopsis: data.synopsis,
      saison: [],
    };

    for (let i = 0; i < data.episodes.length; i++) {
      newSerie.saison.push({
        numero: i + 1,
        episodes: [],
      });
      for (let j = 0; j < data.episodes[i]; j++) {
        newSerie.saison[i].episodes.push({
          numero: j + 1,
          vu: false,
        });
      }
    }
    series.push(newSerie);
    localStorage.setItem("series", JSON.stringify(series));
    formReset();
    toast.success(data.titre + " a bien été ajouté" + "🎉🎉");
  };

  const watchListSubmit = (data: FormDataType) => {
    let watchlist: string[] = [];
    if (localStorage.getItem("watchlist")) {
      watchlist = JSON.parse(localStorage.getItem("watchlist")!);
    }
    watchlist.push(data.titre);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    formReset();
    toast.success(data.titre + " a bien été ajouté à la watchlist" + "🎉🎉");
  };

  const formReset = () => {
    reset();
    fields.map((_, index) => remove(index));
  };

  return (
    <div className="container mx-auto mt-8 p-8 rounded-lg shadow-md pb-16">
      <h1 className="font-bold text-2xl mb-6">Créer une nouvelle série</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="title">Titre</Label>
          <Input
            type="text"
            id="title"
            {...register("titre", {
              required: "Le titre est obligatoire",
              maxLength: {
                value: 100,
                message: "Le titre ne doit pas dépasser 100 caractères",
              },
            })}
          />
          {errors.titre && (
            <span className="text-red-500">{errors.titre.message}</span>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="synopsis">Synopsis</Label>
          <Textarea
            id="synopsis"
            {...register("synopsis", {
              required: false,
              maxLength: {
                value: 400,
                message: "Le synopsis ne doit pas dépasser 400 caractères",
              },
            })}
          />
          {errors.synopsis && (
            <span className="text-red-500">{errors.synopsis.message}</span>
          )}
        </div>

        {fields.map((field, index) => (
          <div className="mb-4" key={field.id}>
            <Label htmlFor={"saison" + index + 1}>Saison {index + 1}</Label>
            <Button
              size={"xs"}
              variant="destructive"
              onClick={() => remove(index)}
              className="ml-2"
            >
              <Delete size={16} />
            </Button>
            <Input
              type="number"
              id={`saision${index + 1}`}
              {...register(`episodes.${index}`, {
                required: "Ce champ est requis",
                min: 1,
              } as const)}
            />

            {errors.episodes && (
              <span className="text-red-500">{errors.episodes.message}</span>
            )}
          </div>
        ))}

        <div className="md:flex-row md:justify-end gap-4 flex flex-col">
          <div className="flex justify-center gap-4 ">
            <Button disabled={isSubmitting} variant="destructive" type="reset">
              Réinitialiser <RotateCcw size={16} className="ml-1" />
            </Button>
            <Button
              disabled={isSubmitting}
              variant="secondary"
              onClick={() => append({ episode: [] })}
            >
              Ajouter une saison <PlusSquare size={16} className="ml-1" />
            </Button>
          </div>

          <Button
            disabled={isSubmitting}
            variant="ghost"
            type="reset"
            onClick={handleSubmit(watchListSubmit)}
          >
            Ajouter a la watch list <Plus size={16} className="ml-1" />
          </Button>

          <Button disabled={isSubmitting} variant="outline" type="submit">
            Créer <Plus size={16} className="ml-1" />
          </Button>
        </div>
      </form>
    </div>
  );
}
