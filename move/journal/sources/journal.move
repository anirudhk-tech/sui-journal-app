

module 0x0::journal {
    use std::vector;
    use std::string::String;
    use sui::object;
    use sui::tx_context;

    public struct Journal has key, store {
        id: object::UID,
        owner: address,
        title: String,
        entries: vector<Entry>,
    }

    public struct Entry has store {
        content: String,
        created_at_ms: u64,
    }

    public fun new_journal(title: String, ctx: &mut TxContext): Journal {
        let j = Journal {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            title,
            entries: vector::empty(),
        };
        j
    }

    public fun add_entry(journal: &mut Journal, content: String, timestamp: u64) {
        let entry = Entry {
            content,
            created_at_ms: timestamp,
        };
        vector::push_back(&mut journal.entries, entry);
    }
}

