import { ComponentExample } from "@/components/component-example";
import MovieCard from "@/components/custom-ui/movie-card";

export default function Page() {
// return <ComponentExample />;
return (
    <div className="flex-1 h-full w-full flex flex-col gap-2 items-center justify-center bg-background ">
        hello
        <MovieCard />
    </div>
)
}