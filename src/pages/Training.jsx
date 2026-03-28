import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Training() {
  const [courses, setCourses] = useLocalStorage("trainingCourses", []);

  const addCourse = () => {
    const newCourse = {
      id: Date.now(),
      title: "Capacitación en CRM B2B",
      instructor: "María López",
      status: "Pendiente",
      date: new Date().toLocaleDateString(),
    };
    setCourses([...courses, newCourse]);
  };

  const completeCourse = (id) => {
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, status: "Completado" } : c
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Capacitación de Agentes</h2>
        <button
          onClick={addCourse}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Nuevo Curso
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Curso</th>
              <th className="p-2">Instructor</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="p-2">{course.title}</td>
                <td className="p-2">{course.instructor}</td>
                <td className="p-2">{course.status}</td>
                <td className="p-2">{course.date}</td>
                <td className="p-2">
                  {course.status === "Pendiente" && (
                    <button
                      onClick={() => completeCourse(course.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Completar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Training;
