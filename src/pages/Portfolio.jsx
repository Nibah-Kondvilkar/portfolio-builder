import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

function Portfolio() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }

      const projectSnapshot = await getDocs(
        collection(db, "users", userId, "projects")
      );

      const projectList = projectSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectList);
    };

    const fetchExperiences = async () => {
  const querySnapshot = await getDocs(
    collection(db, "users", userId, "experiences")
  );

  const expData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setExperiences(expData);
};

    fetchData();
    fetchExperiences();
  }, [userId]);

  if (!profile) {
    return <h1 className="text-center mt-20">Loading Portfolio...</h1>;
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">

    {/* NAVBAR */}
        <nav className="sticky top-0 bg-black border-b border-purple-500/20 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

            <h1 className="text-purple-400 font-bold text-lg">
            {profile?.name || "Portfolio"}
            </h1>

            <div className="flex gap-6 text-gray-300 text-sm">
            <a href="#home" className="relative group">Home
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#skills" className="relative group">Skills
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#projects" className="relative group">Projects
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#experiences" className="relative group">Experience
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            </div>

        </div>
        </nav>

    {/* HERO */}
    <div id="home" className="text-center py-12">
      <img
        src={profile?.profileImage || "https://via.placeholder.com/150"}
        alt="profile"
        className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-purple-500 shadow-lg"
      />

      <h1 className="text-4xl font-bold mt-4">{profile?.name}</h1>

      <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
        {profile?.bio}
      </p>
    </div>


    {/* SKILLS */}
    <div id="skills" className="max-w-6xl mx-auto py-8 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Skills
      </h2>

      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        {profile.skills?.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-900 border border-purple-500/20 px-5 py-2 rounded-full
            hover:border-purple-500 hover:text-purple-400 transition duration-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>


    {/* PROJECTS */}
    <div id="projects" className="max-w-6xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-gray-900 border border-purple-500/20 rounded-xl
            hover:border-purple-500 hover:-translate-y-1 transition p-4"
          >

            <img
              src={project.imageURL}
              alt={project.title}
              className="rounded-lg mb-4 h-40 w-full object-cover"
            />

            <h3 className="text-xl font-semibold">{project.title}</h3>

            <p className="text-gray-400 text-sm mt-2">
              {project.description}
            </p>

            <div className="flex gap-4 mt-4">

              {project.github && (
                <a
                  href={project.github}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                  target="_blank"
                >
                  GitHub
                </a>
              )}

              {project.live && (
                <a
                  href={project.live}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                  target="_blank"
                >
                  Live
                </a>
              )}

            </div>

          </div>
        ))}
      </div>
    </div>


    {/* EXPERIENCE */}
    {experiences.length > 0 && (
      <div id="experiences" className="max-w-6xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center">
          Experiences
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-gray-900 border border-purple-500/20 p-6 rounded-xl
              hover:border-purple-500 hover:-translate-y-1 transition"
            >

              <h3 className="font-bold text-xl text-purple-400">
                {exp.role}
              </h3>

              <p className="text-gray-300 mt-1">{exp.company}</p>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(exp.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
                {" - "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Present"}
              </p>

              <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                {exp.description}
              </p>

            </div>
          ))}
        </div>
      </div>
    )}
   
   {/* FOOTER */}
        <footer className="border-t border-purple-500/20 mt-16 py-6 text-center text-gray-400 text-sm">
        
        <p>
            © {new Date().getFullYear()} {profile?.name}. All rights reserved.
        </p>

        </footer>

  </div>
);
}

export default Portfolio;