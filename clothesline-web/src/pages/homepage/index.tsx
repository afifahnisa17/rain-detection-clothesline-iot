import TampilanHomepage from "../views/homepage";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const homepage = () => {

    const { push } = useRouter();
    const { data, error, isLoading } = useSWR('/api/weather', fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    });

    return (
        <div>
            <TampilanHomepage weathers={isLoading ? [] : data} />
        </div>
    );
};

export default homepage;