import { JournalGallery } from "./JournalGallery";

// Inside the Flex where JournalList is rendered:
<Flex direction="column" gap="6">
  <CreateJournal
    onCreated={(id) => {
      window.location.hash = id;
      setJournal(id);
    }}
  />
  <JournalList
    onSelectJournal={(id) => {
      window.location.hash = id;
      setJournal(id);
    }}
  />
  <JournalGallery
    onSelectJournal={(id) => {
      window.location.hash = id;
      setJournal(id);
    }}
  />
</Flex>;
