# UUM Timetable Planner

The **UUM Timetable Planner** is a web application designed to help students at Universiti Utara Malaysia (UUM) efficiently manage their course schedules. This tool allows students to plan their semesters, visualize their timetables, and avoid scheduling conflicts. Built with modern web technologies, the application provides a seamless and user-friendly experience.

---

## Features

- **Course Scheduling**: Easily add, remove, and manage courses for the semester.
- **Timetable Visualization**: View your weekly timetable in a clean and intuitive layout.
- **Conflict Detection**: Automatically detect and highlight scheduling conflicts.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

---

## Technologies Used

- **Frontend Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) for fast and efficient development.
- **Styling**: [daisyUI](https://daisyui.com/) + [TailwindCSS](https://tailwindcss.com/) for modern and responsive UI design.
- **Database**: [Supabase](https://supabase.com/) for fast and efficient SQL database.
  
---

## Getting Started

Follow these steps to set up and run the UUM Timetable Planner on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (for package management)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/uum-timetable-planner.git
   cd uum-timetable-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the application**:
   The application will be running at `http://localhost:5173`. Open this URL in your browser to view the app.

---

## Project Structure

Here’s an overview of the project structure:

```
uum-timetable-planner/
├── public/              # Static assets (images, fonts, etc.)
├── src/                 # Source code
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── .gitignore           # Files and directories to ignore in Git
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```
For the time being, this application uses only 1 page(App.jsx) for everything. Further optimization(e.g. reusable components) and abstraction should be considered.

---

## Contributing

Contributions are highly encouraged and welcomed! If you'd like to contribute to the UUM Timetable Planner, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Push your branch to your forked repository.
5. Open a pull request, explaining the changes you've made.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

- **GitHub Issues**: [Open an issue](https://github.com/variablekhai/uum-timetable-planner/issues)

---

Happy scheduling! 🎉
