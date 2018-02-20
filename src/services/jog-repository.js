module.exports = function createJogRepository({ db }) {
  return {
    fetchForUser(userId) {
      return db('jogs').where({ user_id: userId }).orderBy('date', 'desc');
    },

    async create({ user_id, date, duration, distance }) {
      const [jogId] = await db('jogs').insert({ user_id, date, duration, distance }).returning('id');
      return jogId;
    },

    async update(id, userId, { date, duration, distance }) {
      await db('jogs')
        .where({ id, user_id: userId }).update({ date, duration, distance });
      return id;
    },

    delete(id, userId) {
      return db('jogs')
        .where({ id, user_id: userId }).delete();
    },

    deleteByUserId(userId) {
      return db('jogs')
        .where({ user_id: userId }).delete();
    },

    async getJogById(id) {
      return db('jogs').where({ id }).first();
    },

    async getAverages(userId) {
      const { rows } = await db.raw(`
        SELECT date_trunc('week', date::date) AS week,
              round(avg((distance / 1000.) / (duration / 60.)), 2) as average_speed,
              round(avg(distance / 1000.), 2) as average_distance
        FROM jogs
        where user_id = ?
        GROUP BY week
        ORDER BY week
      `, [userId]);

      return rows;
    }
  };
};
