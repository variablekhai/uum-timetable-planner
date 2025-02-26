export function reorganizeData(originalData) {
  console.log(originalData);

  const dayMapping = {
    I: "Monday",
    S: "Tuesday",
    R: "Wednesday",
    K: "Thursday",
    J: "Friday",
    A: "Sunday",
  };

  const convertDayCodes = (dayCodes) => {
    return dayCodes
      .split("")
      .map((code) => dayMapping[code] || "")
      .filter((day) => day !== "");
  };

  function convertTo24Hour(time, modifier) {
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  const courseMap = new Map();

  originalData.forEach((item) => {
    const courseCode = item.course_code;
    const courseName = item.course_name;
    const groupName = item.group;

    if (!item.day || !item.time) {
      console.warn(`Skipping item with missing day or time: ${JSON.stringify(item)}`);
      return;
    }

    const days = convertDayCodes(item.day.replace(/[()]/g, ""));
    if (days.length === 0) {
      console.warn(`Skipping item with invalid day codes: ${JSON.stringify(item)}`);
      return;
    }

    const [startTime, endTime] = item.time.split(" - ");
    if (!startTime || !endTime) {
      console.warn(`Skipping item with invalid time format: ${JSON.stringify(item)}`);
      return;
    }

    const endModifier = endTime.includes("PM") ? "PM" : "AM";
    const cleanEndTime = endTime.replace(/(AM|PM)/, "").trim();

    let [startHours, startMinutes] = startTime.split(":").map(Number);
    let [endHours, endMinutes] = cleanEndTime.split(":").map(Number);

    let startModifier = "AM";
    if (endModifier === "PM") {
      if (startHours >= 1 && startHours <= 6) {
        startModifier = "PM";
      } else if (startHours >= 7 && startHours <= 11) {
        startModifier = "AM";
      } else if (startHours === 12) {
        startModifier = "PM";
      }
    }

    const convertedStartTime = convertTo24Hour(
      `${startHours}:${startMinutes}`,
      startModifier
    );
    const convertedEndTime = convertTo24Hour(
      `${endHours}:${endMinutes}`,
      endModifier
    );

    const group = {
      name: groupName,
      day: days.join(", "),
      startTime: convertedStartTime,
      endTime: convertedEndTime,
    };

    if (!courseMap.has(courseCode)) {
      courseMap.set(courseCode, {
        id: courseCode.toLowerCase(),
        code: courseCode,
        course_name: courseName,
        groups: [group],
        venue: item.venue,
        mooc: item.mooc,
      });
    } else {
      courseMap.get(courseCode).groups.push(group);
    }
  });

  return Array.from(courseMap.values());
}
