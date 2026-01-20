import React, { useState } from 'react';
import { projects } from '../../../../../src/data/projects'; 
import { FaExternalLinkAlt } from 'react-icons/fa';
import ProjectDetail from './ProjectDetail';

export default function ProjectsSlide() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Función para depurar el clic
  const handleProjectClick = (project) => {
    console.log("¡CLICK DETECTADO!", project.title); // <--- Mira la consola al hacer clic
    setSelectedProject(project);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      
      <div className="flex flex-col items-center justify-center h-full w-full p-8">
        <h2 className="text-5xl font-black uppercase tracking-widest mb-8 text-transparent bg-clip-text bg-linear-to-r from-black to-gray-500">
          Proyectos
        </h2>

        <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl overflow-y-auto max-h-[70vh] p-2 pr-4">
          {projects.map((project) => (
            <div 
              key={project.id}
              // Usamos la función de debug
              onClick={() => handleProjectClick(project)}
              style={{ touchAction: 'manipulation' }}
              className="swiper-no-swiping group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <span className="text-sm font-mono border border-gray-300 group-hover:border-white px-2 py-0.5 rounded-full shrink-0">
                    {project.year}
                  </span>
                </div>

                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className="flex items-center gap-2 text-blue-600 group-hover:text-blue-300 text-xs font-mono mb-4 hover:underline z-10 relative break-all"
                  >
                    <FaExternalLinkAlt size={10} className="shrink-0" />
                    {project.link}
                  </a>
                )}

                <p className="text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity mt-2">
                  {project.tech}
                </p>
              </div>
              
              <div className="mt-4 flex justify-between items-end">
                 <span className="text-xs font-bold tracking-widest border-b border-transparent group-hover:border-white pb-1 opacity-0 group-hover:opacity-100 transition-all">
                    VER DETALLES +
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEBUG VISUAL: Si selectedProject existe, mostramos un texto rojo gigante por si el componente falla */}
      {selectedProject && (
        <>
            {/* Componente real */}
            <ProjectDetail 
                project={selectedProject} 
                onClose={() => {
                    console.log("CERRANDO DETALLE");
                    setSelectedProject(null);
                }} 
            />
        </>
      )}

    </div>
  );
}