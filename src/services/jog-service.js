module.exports = function createJogService({ jogRepository, jogValidator }) {
  return {
    async fetchForUser(userId) {
      const jogs = await jogRepository.fetchForUser(userId);
      return jogs;
    },
    async create(userId, { date, duration, km }) {
      await jogValidator.validateCreate({ date, duration, km });
      const [hours, minutes] = duration.split(':').map(d => Number(d));
      return jogRepository.create({
        date,
        distance: km * 1000,
        user_id: userId,
        duration: (hours * 60) + minutes
      });
    },
    async update(id, userId, { date, duration, km }) {
      await jogValidator.validateUpdate({ date, duration, km });
      const [hours, minutes] = duration.split(':').map(d => Number(d));
      return jogRepository.update(id, userId, {
        date,
        distance: km * 1000,
        duration: (hours * 60) + minutes
      });
    },
    async delete(id, userId) {
      return jogRepository.delete(id, userId);
    },

    async deleteByUserId(userId) {
      return jogRepository.deleteByUserId(userId);
    },

    async getJogById(id) {
      const jog = await jogRepository.getJogById(id);
      return jog;
    },

    async getAverages(userId) {
      const averages = await jogRepository.getAverages(userId);
      return averages;
    }
  };
};
