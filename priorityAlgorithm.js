/**
 * Created by sheriefbadran on 1/6/15.
 */

module.exports = function (activities, weather) {

  for (var i = 0, max = activities.length; i < max; i++) {

    //console.log(activities[i].priorityref);
    //console.log(activities[i].name);
    //console.log(typeof activities[i]);
    activities[i].score = 0;
    // TODO: The algorithm has many repeating chunks of code. Refactor!
    // TODO: The algorithm should be encapsulated into a node module.
    if (!activities[i].indoors) {

      // ================================
      // TEMPERATURE ====================
      // ================================
      // If outdoor temperature is within the optimal open-domain, assign high score value (8) to the activity.
      if ((activities[i].priorityref.t.optmin <= weather.t &&
        activities[i].priorityref.t.optmax >= weather.t) ||
        (activities[i].priorityref.t.optmin === 0 &&
        activities[i].priorityref.t.optmax === 0 &&
        weather.t === 0)) {

        activities[i].score += 8;
      }

      // If the outdoor temperature is within the open-domain between optimal max and absolute max or optimal min and absolute min,
      // assign intermediate score (3) to the activity.
      else if (activities[i].priorityref.t.min <= weather.t &&
        activities[i].priorityref.t.max >= weather.t) {

        activities[i].score += 3;
      }

      // ================================
      // WIND VELOCITY ==================
      // ================================
      if ((activities[i].priorityref.ws.optmin <= weather.ws &&
        activities[i].priorityref.ws.optmax >= weather.ws) ||
        (activities[i].priorityref.ws.optmin === 0 &&
        activities[i].priorityref.ws.optmax === 0 &&
        weather.ws === 0)) {

        activities[i].score += 8;
      }

      else if (activities[i].priorityref.ws.min <= weather.ws &&
        activities[i].priorityref.ws.max >= weather.ws) {

        activities[i].score += 3;
      }

      // ================================
      // PRECIPITATION - TOTAL ==========
      // ================================
      if ((activities[i].priorityref.pit.optmin <= weather.pit &&
        activities[i].priorityref.pit.optmax >= weather.pit) ||
        (activities[i].priorityref.pit.optmin === 0 &&
        activities[i].priorityref.pit.optmax === 0 &&
        weather.pit === 0)) {

        activities[i].score += 8;
      }

      else if (activities[i].priorityref.pit.min <= weather.pit &&
        activities[i].priorityref.pit.max >= weather.pit) {

        activities[i].score += 3;
      }

      // ================================
      // PRECIPITATION - SNOW ===========
      // ================================
      if ((activities[i].priorityref.pis.optmin <= weather.pis &&
        activities[i].priorityref.pis.optmax >= weather.pis) ||
        (activities[i].priorityref.pis.optmin === 0 &&
        activities[i].priorityref.pis.optmax === 0 &&
        weather.pis === 0)) {

        activities[i].score += 8;
      }

      else if (activities[i].priorityref.pis.min <= weather.pis &&
        activities[i].priorityref.pis.max >= weather.pis) {

        activities[i].score += 3;
      }
    }

    if (activities[i].indoors) {

      if (activities[i].priorityref.always) {

        activities[i].score += 1;
      }

      if (activities[i].priorityref.extremealways) {

        activities[i].score += 3;
      }

      if (activities[i].priorityref.t.optmax >= weather.t) {

        activities[i].score += 8;
      }

      if (activities[i].priorityref.ws.optmax >= weather.ws) {

        activities[i].score += 8;
      }

      if (weather.pit > 0) {

        activities[i].score += 1;
      }

      if (weather.pis > 0) {

        activities[i].score += 2;
      }
    }
  };

  return activities;
};