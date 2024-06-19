import React from "react";

const teamMembers = [
  {
    name: "Marina",
    role: "Front-end/AI",
    description:
      "Specializes in UI/UX design, front-end technologies, and AI implementation.",
    imgSrc: "/images/team/marina.png",
  },
  {
    name: "Fatima",
    role: "AI",
    description:
      "Expert in AI and API management. Focuses on the performance of the AI.",
    imgSrc: "/images/team/fatima.png",
  },
  {
    name: "김준혁",
    role: "Back-end",
    description:
      "Focuses on building server-side and user-side back end of web pages.",
    imgSrc: "/images/team/kimjunhyeok.png",
  },
  {
    name: "박세훈",
    role: "Back-end",
    description:
      "Proficient in programming languages for Back-end and cloud infrastructure.",
    imgSrc: "/images/team/parksehun.png",
  },
  {
    name: "Azizbek",
    role: "Front-end/Back-end/AI",
    description:
      "Excels in creating accessible & user-friendly/Implements the final website.",
    imgSrc: "/images/team/azizbek.png",
  },
];

export function TeamSection() {
  return (
    <section className="py-12 bg-transparent">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-4xl font-bold text-white">
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 w-80"
            >
              <div className="relative flex items-center justify-center h-full w-full">
                <img
                  className="h-full w-full object-cover"
                  src={member.imgSrc}
                  alt={member.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              <div className="p-6 text-white">
                <h3 className="mb-2 text-2xl font-semibold text-yellow-400">{member.name}</h3>
                <p className="mb-4 text-lg text-gray-300">{member.role}</p>
                <p className="text-sm text-gray-400">{member.description}</p>
              </div>
              <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <div className="w-full p-4 text-center bg-gray-800 bg-opacity-75 rounded-md">
                  <h3 className="mb-2 text-xl font-semibold text-yellow-400">{member.name}</h3>
                  <p className="mb-4 text-md text-gray-300">{member.role}</p>
                  <p className="text-sm text-gray-400">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;