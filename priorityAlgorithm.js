/**
 * Created by sheriefbadran on 1/6/15.
 */

module.exports = function (activities, weather) {

  for (var i = 0, max = activities.length; i < max; i++) {

    activities[i].score = 0;
    // TODO: The algorithm has many repeating chunks of code. Refactor!
    if (!activities[i].indoors) {

      // ================================
      // TEMPERATURE ====================
      // ================================
      // If outdoor temperature is within the optimal open-domain, assign high score value (8) to the activity.
      if ((activities[i].priorityref.t.optmin <= weather.t && activities[i].priorityref.t.optmax >= weather.t) ||
          (activities[i].priorityref.t.optmin === 0 &&
           activities[i].priorityref.t.optmax === 0 &&
           weather.t === 0)) {

        activities[i].score += 8;
        console.log(activities[i].name +": " + "+ 8 for optimal temp");
      }

      // If the outdoor temperature is within the open-domain between optimal max and absolute max or optimal min and absolute min,
      // assign intermediate score (3) to the activity.
      else if (activities[i].priorityref.t.min <= weather.t &&
        activities[i].priorityref.t.max >= weather.t) {

        activities[i].score += 3;
        console.log(activities[i].name +": " + "+ 3 for medium temp");
      }

      // ================================
      // WIND VELOCITY ==================
      // ================================
      if ((activities[i].priorityref.ws.optmin <= weather.ws && activities[i].priorityref.ws.optmax >= weather.ws) ||
          (activities[i].priorityref.ws.optmin === 0 &&
           activities[i].priorityref.ws.optmax === 0 &&
           weather.ws === 0)) {

        activities[i].score += 8;
        console.log(activities[i].name +": " + "+ 8 for optimal wind");
      }

      else if (activities[i].priorityref.ws.min <= weather.ws &&
               activities[i].priorityref.ws.max >= weather.ws) {

        activities[i].score += 3;
        console.log(activities[i].name +": " + "+ 3 for medium wind");
      }

      // ================================
      // PRECIPITATION - TOTAL ==========
      // ================================

      // If no optimal max and min precipitation in the reference
      if (activities[i].priorityref.pit.optmin === 0 &&
          activities[i].priorityref.pit.optmax === 0) {

        // If there is no precipitation
        if (weather.pit === 0) {

          activities[i].score += 3;
        }

        // If there is no optimal max and min, check if pit is below max.
        if (activities[i].priorityref.pit.max >= weather.pit) {

          activities.score += 3;
        }
      }

      // If there is given optimal max and min precipitation in activity reference
      else if (activities[i].priorityref.pit.optmin <= weather.pit &&
               activities[i].priorityref.pit.optmax >= weather.pit) {

        activities[i].score += 8;
        console.log(activities[i].name +": " + "+ 8 for no rain");
      }

      // If there is given min and max of medium importance.
      else if (activities[i].priorityref.pit.min <= weather.pit &&
               activities[i].priorityref.pit.max >= weather.pit) {

        activities[i].score += 3;
        console.log(activities[i].name +": " + "+ 3 for no rain");
      }

      // ================================
      // PRECIPITATION - SNOW ===========
      // ================================

      // If no optimal max and min precipitation in the reference
      if (activities[i].priorityref.pis.optmin === 0 &&
          activities[i].priorityref.pis.optmax === 0) {

        // If there is no precipitation
        if (weather.pis === 0) {

          activities[i].score += 3;
        }

        // If there is no optimal max and min, check if pit is below max.
        if (activities[i].priorityref.pis.max >= weather.pis) {

          activities.score += 3;
        }
      }

      // If there is given optimal max and min precipitation in activity reference
      else if (activities[i].priorityref.pis.optmin <= weather.pis &&
               activities[i].priorityref.pis.optmax >= weather.pis) {

        activities[i].score += 8;
        console.log(activities[i].name +": " + "+ 8 for no snow");
      }

      // If there is given min and max of medium importance.
      else if (activities[i].priorityref.pis.min <= weather.pis &&
               activities[i].priorityref.pis.max >= weather.pis) {

        activities[i].score += 3;
        console.log(activities[i].name +": " + "+ 3 for no snow");
      }
    }

    if (activities[i].indoors) {

      if (activities[i].priorityref.always) {

        activities[i].score += 4;
      }

      if (activities[i].priorityref.extremealways) {

        activities[i].score += 8;
      }

      if (activities[i].priorityref.t.optmax >= weather.t) {

        activities[i].score += 8;
      }

      if (weather.t < 10) {

        activities[i].score += 8;
      }

      if (activities[i].priorityref.ws.optmax <= weather.ws) {

        activities[i].score += 8;
      }

      if (weather.ws > 4) {

        activities[i].score += 3;
      }

      if (weather.pit > 0) {

        activities[i].score += 8;
      }

      if (weather.pis > 0) {

        activities[i].score += 2;
      }
    }
  };

  return activities;
};