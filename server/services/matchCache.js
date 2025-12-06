const NodeCache = require('node-cache');

// Cache matches for 5 minutes, check for expired entries every 60 seconds
const matchCache = new NodeCache({ 
  stdTTL: 300, 
  checkperiod: 60,
  useClones: false // Better performance for objects
});

const MatchCache = {
  get: (matchId) => {
    return matchCache.get(matchId);
  },

  set: (matchId, matchData) => {
    matchCache.set(matchId, matchData);
  },

  invalidate: (matchId) => {
    matchCache.del(matchId);
  },

  getOrFetch: async (matchId, fetchFn) => {
    let data = matchCache.get(matchId);
    if (data) {
      return data;
    }
    data = await fetchFn();
    if (data) {
      matchCache.set(matchId, data);
    }
    return data;
  },

  // Get cache statistics for monitoring
  getStats: () => {
    return matchCache.getStats();
  }
};

module.exports = MatchCache;
