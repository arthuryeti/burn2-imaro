import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function useBalance() {
  const { connection } = useConnection();

  const { data } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const publicKey = new PublicKey(
        "2KEJdenGheqtbxtDsohok58BhoDxE2oo5xVHMKvRrmvx"
      );

      return connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey("3Gjckk5jXnJffBruUS2EEYhpiDEN6z5TPXLkFVHkSkkg"),
      });
    },
    select(data) {
      if (data == null) {
        return 0;
      }

      if (data && data.value && data.value.length > 0) {
        const walletTokenAccount = data.value[0];
        const amount =
          walletTokenAccount.account.data.parsed.info.tokenAmount.uiAmount;

        return amount;
      }
    },
  });

  return data;
}
