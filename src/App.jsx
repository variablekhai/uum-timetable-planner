import "./App.css";
import React, { useState, useEffect } from "react";
import supabase from "./utils/db";
import { reorganizeData } from "./utils/helpers";
import { Search, School, Trash2 } from "lucide-react";

function App() {
  const [department, setDepartment] = useState(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  async function getCourseCatalog() {
    const { data, error } = await supabase
      .from("college_arts_sciences")
      .select("*");
    if (error) {
      console.error(error);
    } else {
      const reorganizedData = reorganizeData(data);
      setData(reorganizedData);
      console.log(reorganizedData);
    }
  }

  useEffect(() => {
    if (department === "cas") {
      getCourseCatalog();
    }
  }, [department]);

  const handleSelectCourse = (course, group) => {
    const isClashing = selectedCourses.some((selectedCourse) => {
      // Split the days of the selected course into an array
      const selectedCourseDays = selectedCourse.day.split(' ');
    
      // Split the days of the group course into an array
      const groupDays = group.day.split(' ');
    
      // Check if any of the days overlap
      const hasCommonDay = selectedCourseDays.some((selectedDay) =>
        groupDays.includes(selectedDay)
      );
    
      if (hasCommonDay) {
        // Check if the time slots overlap on the common day
        const selectedCourseStart = selectedCourse.startTime;
        const selectedCourseEnd = selectedCourse.endTime;
        const groupStart = group.startTime;
        const groupEnd = group.endTime;
    
        return (
          (selectedCourseStart < groupEnd && selectedCourseEnd > groupStart) ||
          (groupStart < selectedCourseEnd && groupEnd > selectedCourseStart)
        );
      }
    
      return false; // No clash if no common day
    });
    
    if (isClashing) {
      alert("This course clashes with another selected course.");
      return;
    }

    const groupsToSelect = course.groups.filter((g) => g.name === group.name);

    setSelectedCourses((prevSelectedCourses) => [
      ...prevSelectedCourses,
      ...groupsToSelect.map((g) => ({
        ...course,
        selectedGroup: g.name,
        day: g.day,
        startTime: g.startTime,
        endTime: g.endTime,
      })),
    ]);
  };

  const isCourseSelected = (course) => {
    return selectedCourses.some(
      (selectedCourse) => selectedCourse.code === course.code
    );
  };

  const handleRemoveCourse = (courseCode) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((course) => course.code !== courseCode)
    );
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = Array.from({ length: 22 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const getCourseAtTimeSlot = (day, time) => {
    return selectedCourses.find((course) => {
      const courseDays = course.day.split(", ");
      const courseStartTime = course.startTime;
      const courseEndTime = course.endTime;
      return (
        courseDays.includes(day) &&
        courseStartTime <= time &&
        courseEndTime > time
      );
    });
  };

  const getTimeSlotSpan = (startTime, endTime) => {
    const startSlot =
      (Number.parseInt(startTime.split(":")[0]) - 8) * 2 +
      (startTime.split(":")[1] === "30" ? 1 : 0);
    const endSlot =
      (Number.parseInt(endTime.split(":")[0]) - 8) * 2 +
      (endTime.split(":")[1] === "30" ? 1 : 0);
    return endSlot - startSlot;
  };

  const courseColors = Object.fromEntries(
    selectedCourses.map((course, index) => [
      course.code,
      `hsl(${(index * 137.508) % 360}, 70%, 85%)`,
    ])
  );

  const abbreviateDay = (day) => {
    const dayMap = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Sunday: "Sun",
    };
    return dayMap[day] || day;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          UUM Timetable Planner
        </h1>
        <p className="text-gray-600">Plan your semester schedule efficiently</p>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all hover:shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <School className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Let's get started 🚀
            </h2>
            <p className="text-gray-600">Choose your department to begin</p>
          </div>
        </div>

        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="" disabled selected>
            Select your department
          </option>
          <option value="cas">College of Arts and Sciences</option>
          <option value="cob">College of Business</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Available Courses */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Available Courses
          </h2>
          <p className="text-gray-600 mb-4">
            Search and select courses to add to your timetable
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for courses..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Course List */}
          <div className="overflow-y-auto max-h-96 pr-1">
            {data &&
              data
                .filter(
                  (course) =>
                    course.course_name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    course.code.toLowerCase().includes(search.toLowerCase())
                )
                .map((course) => (
                  <div
                    key={course.code}
                    className="mb-4 border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{course.code}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                        {course.groups.length} groups
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{course.course_name}</p>

                    <div className="space-y-2">
                      {course.groups.map((group, index) => (
                        <button
                          key={group.name + index}
                          className={`w-full py-2 px-4 border border-gray-300 rounded-lg flex justify-between items-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isCourseSelected(course)
                              ? "bg-gray-100 cursor-not-allowed"
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            !isCourseSelected(course) &&
                            handleSelectCourse(course, group)
                          }
                          disabled={isCourseSelected(course)}
                        >
                          <span className="font-medium">
                            Group {group.name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {group.day
                              .split(", ")
                              .map((day) => abbreviateDay(day))
                              .join(", ")}{" "}
                            • {group.startTime} - {group.endTime}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Selected Courses */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Selected Courses
          </h2>
          <p className="text-gray-600 mb-4">Your current course selection</p>

          <div className="overflow-y-auto max-h-96 pr-1">
            {selectedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-2">No courses selected yet</p>
                <p className="text-gray-400 text-sm">
                  Search and select courses from the available list
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left text-gray-700">Course</th>
                      <th className="py-3 text-left text-gray-700">Schedule</th>
                      <th className="py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourses.map((course) => (
                      <tr
                        key={course.code + course.selectedGroup}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3">
                          <div>
                            <span
                              className="inline-block px-2 py-1 text-xs font-medium rounded mr-2"
                              style={{
                                backgroundColor: courseColors[course.code],
                              }}
                            >
                              {course.code}
                            </span>
                            <span className="font-medium">
                              Group {course.selectedGroup}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {course.course_name}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-sm">
                            {course.day
                              .split(", ")
                              .map((day) => abbreviateDay(day))
                              .join(", ")}
                          </div>
                          <div className="text-xs text-gray-600">
                            {course.startTime} - {course.endTime}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all"
                            onClick={() => handleRemoveCourse(course.code)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Weekly Timetable
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-px bg-gray-200 rounded-lg">
              {/* Header */}
              <div className="bg-gray-100 p-3 font-medium text-gray-700 rounded-tl-lg">
                Time
              </div>
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`bg-gray-100 p-3 font-medium text-gray-700 text-center ${
                    index === days.length - 1 ? "rounded-tr-lg" : ""
                  }`}
                >
                  {abbreviateDay(day)}
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={`time-${time}`}>
                  <div
                    className={`bg-white p-3 text-sm border-t border-gray-100 ${
                      timeIndex === timeSlots.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    {time}
                  </div>

                  {days.map((day, dayIndex) => {
                    const course = getCourseAtTimeSlot(day, time);
                    const isStartOfCourse = course && course.startTime === time;
                    const isLastTimeSlot = timeIndex === timeSlots.length - 1;
                    const isLastDay = dayIndex === days.length - 1;

                    if (isStartOfCourse) {
                      const rowSpan = getTimeSlotSpan(
                        course.startTime,
                        course.endTime
                      );
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`relative border border-white ${
                            isLastDay && isLastTimeSlot ? "rounded-br-lg" : ""
                          }`}
                          style={{
                            gridRow: `span ${rowSpan}`,
                            backgroundColor: courseColors[course.code],
                          }}
                        >
                          <div className="absolute inset-0 p-2 overflow-hidden">
                            <div className="font-bold text-sm">
                              {course.code}
                            </div>
                            <div className="text-xs opacity-75">
                              Group {course.selectedGroup}
                            </div>
                            <div className="text-xs mt-1">
                              {course.startTime} - {course.endTime}
                            </div>
                          </div>
                        </div>
                      );
                    } else if (!course) {
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`bg-white border-t border-gray-50 ${
                            isLastDay && isLastTimeSlot ? "rounded-br-lg" : ""
                          }`}
                        />
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                © 2025 UUM Timetable Planner. All rights reserved.
              </p>
            </div>
            <div className="flex">
              <a
                href="https://github.com/variablekhai/uum-timetable-planner"
                className="text-gray-600 hover:text-blue-600 transition-colors underline"
              >
                Proudly Open Source.
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
