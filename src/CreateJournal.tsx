import { useState } from "react";
import { Button, Container, TextField } from "@radix-ui/themes";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { Transaction } from "@mysten/sui/transactions";

export function CreateJournal({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const journalPackageId = useNetworkVariable("journalPackageId");
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const {
    mutate: signAndExecute,
    isPending,
    isSuccess,
  } = useSignAndExecuteTransaction();

  const create = async () => {
    if (!currentAccount || !title.trim()) return;

    const tx = new Transaction();

    tx.moveCall({
      target: `${journalPackageId}::journal::new_journal`,
      arguments: [tx.pure.string(title)],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest,
            options: { showEffects: true },
          });
          const newJournalId = effects?.created?.[0]?.reference?.objectId;
          if (newJournalId) onCreated(newJournalId);
        },
        onError: (err) => {
          console.error("Transaction failed:", err);
        },
      },
    );
  };

  return (
    <Container>
      <TextField.Root
        placeholder="Enter journal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="3"
        mb="3"
      />
      <Button
        onClick={create}
        disabled={isPending || isSuccess || !title.trim()}
      >
        {isPending || isSuccess ? <ClipLoader size={20} /> : "Create Journal"}
      </Button>
    </Container>
  );
}
