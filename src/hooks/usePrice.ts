import { useQuery } from "@tanstack/react-query";

export function usePrice() {
  const tokenPubKey = "3Gjckk5jXnJffBruUS2EEYhpiDEN6z5TPXLkFVHkSkkg";

  const { data } = useQuery({
    queryKey: ["price"],
    queryFn: async () => {
      const res = await fetch(`https://api.jup.ag/price/v2?ids=${tokenPubKey}`);

      return res.json();
    },
    select(data) {
      if (data == null) {
        return 0;
      }

      return data.data[tokenPubKey].price;
    },
  });

  return data;
}
