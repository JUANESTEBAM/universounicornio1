import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const courses = [
  { id: 1, title: "Introducción", duration: "1 minuto", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/01.Introduccion.mp4" },
  { id: 2, title: "Demostración Practica Shampoo", duration: "4 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/05.Shampoo-Demostraci%C3%B3n.mp4" },
  { id: 3, title: "Acondicionador", duration: "30 segundos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/06.Acondicionador.mp4" },
  { id: 4, title: "Demostración Practica Acondicionador", duration: "40 segundos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/07.Acondicionador-demostraci%C3%B3n.mp4" },
  { id: 5, title: "Crema 3 in 1 ", duration: "40 segundos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/08.La+Crema+3+en+1.mp4" },
  { id: 6, title: "Demostración Practica Crema 3 in 1", duration: "20 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/09.Crema+de+peinar-demostraci%C3%B3n.mp4" },
  { id: 7, title: "Gel", duration: "30 segundos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/10.Gel.mp4" },
  { id: 8, title: "Demostración Practica Gel", duration: "10 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/11.Gel-demostraci%C3%B3n+(1).mp4" },
  { id: 9, title: "Aceite ", duration: "1 minuto", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/12.Aceite.mp4" },
  { id: 10, title: "Demostración Practica Aceite", duration: "1 minuto", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/13.Aceite-demostraci%C3%B3n.mp4" },
  { id: 11, title: "Transiciones", duration: "10 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/13.Transiciones.mp4" },
  { id: 12, title: "Pre- Estrategias de ventas", duration: "40 segundos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/14.Pre-estrategias+de+ventas.mp4" },
  { id: 13, title: "Tips de Ventas", duration: "3 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/15.Tips+de+ventas.mp4" },
  { id: 14, title: "Tips post Ventas", duration: "3 minutos", link: "https://cursosprofesionales.s3.us-east-1.amazonaws.com/16.Tips-post+ventas.mp4" },
];

export function CourseList() {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#F198C0]">Cursos Disponibles</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform">
            <CardHeader className="p-5 bg-[#F198C0] text-white text-center">
              <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-gray-600 mb-3">Duración: {course.duration}</p>
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#F198C0] hover:bg-[#e078a9] transition-colors">
                  Ver Curso
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
