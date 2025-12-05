// In-memory database fallback for development
const matches = new Map();

const memoryDb = {
  from: (table) => ({
    insert: (records) => ({
      select: () => ({
        single: async () => {
          const record = records[0];
          matches.set(record.id, record);
          return { data: record, error: null };
        }
      })
    }),
    select: (fields = '*') => ({
      eq: (field, value) => ({
        single: async () => {
          const match = matches.get(value);
          return { data: match || null, error: match ? null : { code: 'PGRST116' } };
        }
      })
    }),
    update: (updates) => ({
      eq: (field, value) => ({
        select: () => ({
          single: async () => {
            const match = matches.get(value);
            if (match) {
              Object.assign(match, updates);
              matches.set(value, match);
              return { data: match, error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          }
        })
      })
    })
  })
};

module.exports = memoryDb;
