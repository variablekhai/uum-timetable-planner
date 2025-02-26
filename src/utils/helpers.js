export function reorganizeData(originalData) {
  // Sample fetched data
  // {
  //     "id": 1,
  //     "course_code": "MPB1013",
  //     "group": "A",
  //     "bahasa": "",
  //     "total_of_offer": 25,
  //     "balance": 25,
  //     "day": "(IK)",
  //     "time": "8:30 - 10:00AM",
  //     "venue": "BT A22",
  //     "course_name": "BASIC ENGLISH PROFICIENCY",
  //     "mooc": ""
  // }

  // Mapping of day codes to full day names
  const dayMapping = {
    I: "Monday",
    S: "Tuesday",
    R: "Wednesday",
    K: "Thursday",
    J: "Friday",
    A: "Sunday",
  };

  // Helper function to convert day codes to full day names
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

  // Create a map to group courses by their code
  const courseMap = new Map();

  originalData.forEach((item) => {
    const courseCode = item.course_code;
    const courseName = item.course_name;
    const groupName = item.group;
    const days = convertDayCodes(item.day.replace(/[()]/g, "")); // Remove parentheses and convert

    const [startTime, endTime] = item.time.split(" - ");
    const endModifier = endTime.includes("PM") ? "PM" : "AM";

    // Remove AM/PM from endTime for conversion
    const cleanEndTime = endTime.replace(/(AM|PM)/, "").trim();

    let [startHours, startMinutes] = startTime.split(":").map(Number);
    let [endHours, endMinutes] = cleanEndTime.split(":").map(Number);

    let startModifier = "AM"; // Default assumption

    // Determine the startModifier based on endModifier and startHours
    if (endModifier === "PM") {
      if (startHours >= 1 && startHours <= 6) {
        startModifier = "PM"; // Early morning (1 AM - 6 AM)
      } else if (startHours >= 7 && startHours <= 11) {
        startModifier = "AM"; // Late morning (7 AM - 11 AM)
      } else if (startHours === 12) {
        startModifier = "PM"; // Noon (12 PM)
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
      day: days.join(", "), // Combine multiple days into a single string
      startTime: convertedStartTime,
      endTime: convertedEndTime,
    };

    // Check if the course already exists in the map
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
      // Add the group to the existing course
      courseMap.get(courseCode).groups.push(group);
    }
  });

  // Convert the map to an array of courses
  return Array.from(courseMap.values());
}
