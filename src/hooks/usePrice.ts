import { useQuery } from "@tanstack/react-query";

export function usePrice() {
  const tokenPubKey = "3Gjckk5jXnJffBruUS2EEYhpiDEN6z5TPXLkFVHkSkkg";

  const { data } = useQuery({
    queryKey: ["price"],
    queryFn: async () => {
      const res = await fetch(
        `https://price.jup.ag/v4/price?ids=${tokenPubKey}&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
      );

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
