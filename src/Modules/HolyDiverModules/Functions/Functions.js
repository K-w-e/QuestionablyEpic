import moment from "moment";
import axios from "axios";
import { damageExclusions, healerCooldownsDetailed } from "../Data/Data";

// Returns Seconds from 0 to Loglength
export function addMissingTimestamps(loglength) {
  let newarray = [{ timestamp: 0 }];
  let ticks = [];
  let tickcount = 0;
  let length = moment(loglength).startOf("second") / 1000;
  for (let i = 0; i < length; i++) {
    ticks = ticks.concat(tickcount + 1000);
    tickcount = tickcount + 1000;
  }
  ticks.forEach((element) => newarray.push({ timestamp: element }));
  return newarray;
}

// Returns Unique Objects from an array of Objects
export function getUniqueObjectsFromArray(arr, comp) {
  // store the comparison  values in array
  const unique = arr
    .map((e) => e[comp])
    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
}

// reduces array provided by timestamp. returns multiple abilities to one timestamp
export function reduceTimestamps(array) {
  let timestampSum = array.reduce((acc, cur) => {
    acc[cur.timestamp] = array.reduce((x, n) => {
      for (let prop in n) {
        if (cur.timestamp === n.timestamp)
          if (x.hasOwnProperty(prop)) x[prop] += n[prop];
          else x[prop] = n[prop];
      }
      x.timestamp = cur.timestamp;
      return x;
    }, {});
    return acc;
  }, {});
  return timestampSum;
}

// returns fight duration Time end - time start of log
export function fightDurationCalculator(time1, time2) {
  let time = time1 - time2;
  return time;
}

export function durationmaker(
  ability,
  originalTimestamp,
  abilityname,
  endtime
) {
  let duration = healerCooldownsDetailed
    .filter((obj) => {
      return obj.name === ability;
    })
    .map((obj) => obj.duration);
  let newarray = [{ timestamp: originalTimestamp, [abilityname]: 1 }];
  let tickcount = originalTimestamp;
  for (let i = 0; i < duration; i++) {
    if (endtime !== tickcount) {
      tickcount = tickcount + 1000;
      newarray.push({ timestamp: tickcount, [abilityname]: 1 });
    }
  }
  return newarray;
}

// Returns Array of Healer Information
export async function importHealerLogData(starttime, endtime, reportid) {
  const APIHEALING =
    "https://www.warcraftlogs.com:443/v1/report/tables/healing/";
  const apiMonk = "&sourceclass=Monk";
  const apiPaladin = "&sourceclass=Paladin";
  const apiDruid = "&sourceclass=Druid";
  const apiPriest = "&sourceclass=Priest";
  const apiShaman = "&sourceclass=Shaman";
  const API2 = "&api_key=92fc5d4ae86447df22a8c0917c1404dc";
  const START = "?start=";
  const END = "&end=";
  let healers = [];
  // Class Casts Import

  await axios
    .get(
      APIHEALING + reportid + START + starttime + END + endtime + apiMonk + API2
    )
    .then((result) => {
      healers = Object.keys(result.data.entries)
        .filter((key) => result.data.entries[key].icon === "Monk-Mistweaver")
        .map((key) => result.data.entries[key]);
    })
    .catch(function (error) {
      console.log(error);
    });

  await axios
    .get(
      APIHEALING +
        reportid +
        START +
        starttime +
        END +
        endtime +
        apiPaladin +
        API2
    )
    .then((result) => {
      healers = healers.concat(
        Object.keys(result.data.entries)
          .filter((key) => result.data.entries[key].icon === "Paladin-Holy")
          .map((key) => result.data.entries[key])
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  await axios
    .get(
      APIHEALING +
        reportid +
        START +
        starttime +
        END +
        endtime +
        apiDruid +
        API2
    )
    .then((result) => {
      healers = healers.concat(
        Object.keys(result.data.entries)
          .filter(
            (key) => result.data.entries[key].icon === "Druid-Restoration"
          )
          .map((key) => result.data.entries[key])
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  await axios
    .get(
      APIHEALING +
        reportid +
        START +
        starttime +
        END +
        endtime +
        apiPriest +
        API2
    )
    .then((result) => {
      healers = healers.concat(
        Object.keys(result.data.entries)
          .filter(
            (key) =>
              result.data.entries[key].icon === "Priest-Holy" ||
              result.data.entries[key].icon === "Priest-Discipline"
          )
          .map((key) => result.data.entries[key])
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  await axios
    .get(
      APIHEALING +
        reportid +
        START +
        starttime +
        END +
        endtime +
        apiShaman +
        API2
    )
    .then((result) => {
      healers = healers.concat(
        Object.keys(result.data.entries)
          .filter(
            (key) => result.data.entries[key].icon === "Shaman-Restoration"
          )
          .map((key) => result.data.entries[key])
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  return healers;
}

export async function importDamageLogData(starttime, endtime, reportid) {
  const APIdamagetaken =
    "https://www.warcraftlogs.com:443/v1/report/events/damage-taken/";
  const API2 = "&api_key=92fc5d4ae86447df22a8c0917c1404dc";
  const START = "?start=";
  const END = "&end=";
  const HOSTILITY = "&hostility=0";
  let damage = [];
  let nextpage = 0;
  // Class Casts Import

  await axios
    .get(
      APIdamagetaken +
        reportid +
        START +
        starttime +
        END +
        endtime +
        HOSTILITY +
        API2
    )
    .then((result) => {
      damage = Object.keys(result.data.events)
        .filter(
          (key) =>
            damageExclusions.includes(result.data.events[key].ability.guid) ===
              false &&
            // Has to Have unmitigatedAmount
            result.data.events[key].unmitigatedAmount
        )
        .map((key) => result.data.events[key]);
      nextpage = result.data.nextPageTimestamp;
    })
    .catch(function (error) {
      console.log(error);
    });
  // Loop of the import updating the next page until the next page is undefined (no next page from json return)
  do {
    await axios
      .get(
        APIdamagetaken +
          reportid +
          START +
          nextpage +
          END +
          endtime +
          HOSTILITY +
          API2
      )
      .then((result) => {
        damage = damage.concat(
          Object.keys(result.data.events)
            .filter(
              (key) =>
                damageExclusions.includes(
                  result.data.events[key].ability.guid
                ) === false &&
                // Has to Have unmitigatedAmount
                result.data.events[key].unmitigatedAmount
            )
            .map((key) => result.data.events[key])
        );
        nextpage = result.data.nextPageTimestamp;
      })
      .catch(function (error) {
        console.log(error);
      });
  } while (nextpage != undefined || null);

  return damage;
}

export async function importCastsLogData(
  starttime,
  endtime,
  reportid,
  healerID
) {
  const APICast = "https://www.warcraftlogs.com:443/v1/report/events/casts/";
  const START = "?start=";
  const END = "&end=";
  const HOSTILITY = "&hostility=0";
  const API2 = "&api_key=92fc5d4ae86447df22a8c0917c1404dc";
  let nextpage = 0;
  let cooldowns = [];

  await axios
    .get(
      APICast + reportid + START + starttime + END + endtime + HOSTILITY + API2
    )
    .then((result) => {
      cooldowns = Object.keys(result.data.events)
        .filter(
          (key) =>
            healerCooldownsDetailed
              .map((obj) => obj.guid)
              .includes(result.data.events[key].ability.guid) &&
            healerID.includes(result.data.events[key].sourceID)
        )
        .map((key) => result.data.events[key]);
      nextpage = result.data.nextPageTimestamp;
    })
    .catch(function (error) {
      console.log(error);
    });
  // Loop of the import updating the next page until the next page is undefined (no next page from json return)
  let i = 0;
  do {
    await axios
      .get(
        APICast + reportid + START + nextpage + END + endtime + HOSTILITY + API2
      )
      .then((result) => {
        cooldowns = cooldowns.concat(
          Object.keys(result.data.events)
            .filter(
              (key) =>
                healerCooldownsDetailed
                  .map((obj) => obj.guid)
                  .includes(result.data.events[key].ability.guid) &&
                healerID.includes(result.data.events[key].sourceID)
            )
            .map((key) => result.data.events[key])
        );
        nextpage = result.data.nextPageTimestamp;
      })
      .catch(function (error) {
        console.log(error);
      });
    i = i + 1;
  } while (nextpage != undefined || null);
  return cooldowns;
}