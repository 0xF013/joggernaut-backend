const moment = require('moment');

module.exports = function createUserValidator() {
  async function validate(isUpdate, { date, km, duration }) {
    const validationErrors = {};

    if (!date) {
      validationErrors.date = 'DATE_REQUIRED';
    } else if (date > (new Date())) {
      validationErrors.date = 'DATE_IN_FUTURE';
    }

    if (!km) {
      validationErrors.distance = 'DISTANCE_REQUIRED';
    } else if (!km.match(/\d+(\.d+)?/)) {
      validationErrors.distance = 'DISTANCE_INVALID';
    } else if (Number(km) <= 0) {
      validationErrors.distance = 'DISTANCE_REQUIRED';
    }

    if (!duration) {
      validationErrors.duration = 'DURATION_REQUIRED';
    } else if (!duration.match(/^\d{1,2}:\d{2}$/)) {
      validationErrors.duration = 'DURATION_INVALID';
    } else {
      const [hours, minutes] = duration.split(':').map(d => Number(d));
      if (minutes > 59) {
        validationErrors.duration = 'DURATION_INVALID';
      } else if (hours >= 12) {
        validationErrors.duration = 'DURATION_TOO_LONG';
      } else {
        const mmt = moment(date).add((hours * 60) + minutes, 'minutes');
        if (mmt.toDate() > new Date()) {
          validationErrors.duration = 'END_DATE_IN_FUTURE';
        }
        if (!validationErrors.distance) {
          const hoursCount = hours + (minutes / 60);
          const avgSpeed = km / hoursCount;
          if (avgSpeed >= 45) {
            validationErrors.distance = 'SPEED_USAIN_BOLT';
          }
        }
      }
    }

    if (Object.keys(validationErrors).length) {
      const error = new Error();
      error.validationErrors = validationErrors;
      throw error;
    }
  }

  return {
    async validateCreate(payload) {
      await validate(false, payload);
      return true;
    },
    async validateUpdate(payload) {
      await validate(true, payload);
      return true;
    }
  };
};
