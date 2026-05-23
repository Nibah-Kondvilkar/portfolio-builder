import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addDoc } from "firebase/firestore";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddProject from "../components/AddProject";

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false); 
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectLive, setProjectLive] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [githubContact, setGithubContact] = useState("");

  
  useEffect(() => {
  const fetchUserProfile = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setSkills(data.skills?.join(", ") || "");
        setProfileImage(data.profileImage || "");

      }
    }
  };

  const fetchProjects = async () => {
    if (user) {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "projects")
      );

      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectsData);
    }
  };
  const fetchExperiences = async () => {
  if (user) {
    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "experiences")
    );

    const expData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setExperiences(expData);
  }
};
const fetchContacts = async () => {
  if (user) {
    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "contacts")
    );

    const contactData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setContacts(contactData);
  }
};
  fetchUserProfile();
  fetchProjects();
  fetchExperiences();
  fetchContacts();
}, [user]);

  const handleUpdate = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Name cannot be empty");
    return;
  }
  if (!skills.trim()) {
    alert("Skills cannot be empty");
    return;
  }

  
  const updatedSkills = skills.split(",").map(skill => skill.trim());

    await updateDoc(doc(db, "users", user.uid), {
      name,
      bio,
      skills: updatedSkills,
      profileImage
    });

    alert("Profile updated");

    setProfile({
      ...profile,
      name,
      bio,
      skills: updatedSkills,
      profileImage
    });

    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  /* edit and delete functionality */
  const handleDeleteProject = async (projectId) => {
  await deleteDoc(doc(db, "users", user.uid, "projects", projectId));

  setProjects(projects.filter((p) => p.id !== projectId));
};

const handleEditProject = (project) => {
  setEditingProject(project);

  setProjectTitle(project.title || "");
  setProjectDescription(project.description || "");
  setProjectImage(project.imageURL || "");
  setProjectGithub(project.github || "");
  setProjectLive(project.live || "");
};

const handleUpdateProject = async (e) => {
  e.preventDefault();

  await updateDoc(
    doc(db, "users", user.uid, "projects", editingProject.id),
    {
      title: projectTitle,
      description: projectDescription,
      imageURL: projectImage,
      github: projectGithub,
      live: projectLive,
    }
  );
  alert("Project updated");
  setProjects(
    projects.map((p) =>
      p.id === editingProject.id
        ? {
            ...p,
            title: projectTitle,
            description: projectDescription,
            imageURL: projectImage,
            github: projectGithub,
            live: projectLive,
          }
        : p
    )
  );

  setEditingProject(null);
};

/* edit and delete experince  */
const handleDeleteExperience = async (id) => {
  await deleteDoc(doc(db, "users", user.uid, "experiences", id));

  setExperiences(experiences.filter(exp => exp.id !== id));
};
const handleEditExperience = (exp) => {
  setShowExperienceForm(false);
  setEditingExperience(exp);

  setCompany(exp.company);
  setRole(exp.role);
  setExpDescription(exp.description);
  setStartDate(exp.startDate);
  setEndDate(exp.endDate);
};


 const handleAddExperience = async (e) => {
  e.preventDefault();

  const docRef = await addDoc(
    collection(db, "users", user.uid, "experiences"),
    {
      company,
      role,
      description: expDescription,
      startDate,
      endDate: currentlyWorking ? null : endDate
    }
  );
  
  setExperiences([
    ...experiences,
    {
      id: docRef.id,
      company,
      role,
      description: expDescription,
      startDate,
      endDate
    }
  ]);
  setCurrentlyWorking(false);
  setEditingExperience(null);

  setCompany("");
  setRole("");
  setExpDescription("");
  setStartDate("");
  setEndDate("");
};

/* update experience */
const handleUpdateExperience = async (e) => {
  e.preventDefault();

  await updateDoc(
    doc(db, "users", user.uid, "experiences", editingExperience.id),
    {
      company,
      role,
      description: expDescription,
      startDate,
      endDate
    }
  );
  alert("Experience updated");
  setExperiences(
    experiences.map((exp) =>
      exp.id === editingExperience.id
        ? {
            ...exp,
            company,
            role,
            description: expDescription,
            startDate,
            endDate
          }
        : exp
    )
  );

  setEditingExperience(null);
};

const handleAddContact = async (e) => {
  e.preventDefault();

  const docRef = await addDoc(
    collection(db, "users", user.uid, "contacts"),
    {
      phone,
      email: contactEmail,
      linkedin,
      github: githubContact
    }
  );

  setContacts([
    ...contacts,
    {
      id: docRef.id,
      phone,
      email: contactEmail,
      linkedin,
      github: githubContact
    }
  ]);
  
   alert("Contact Added");
  setPhone("");
  setContactEmail("");
  setLinkedin("");
  setGithubContact("");

  setShowContactForm(false);
  setEditingContact(null);
};

/* Edit  */
const handleEditContact = (contact) => {

  setShowContactForm(false);

  setEditingContact(contact);

  setPhone(contact.phone);
  setContactEmail(contact.email);
  setLinkedin(contact.linkedin);
  setGithubContact(contact.github);
};
/*Update */
const handleUpdateContact = async (e) => {
  e.preventDefault();

  await updateDoc(
    doc(db, "users", user.uid, "contacts", editingContact.id),
    {
      phone,
      email: contactEmail,
      linkedin,
      github: githubContact
    }
  );
  alert("Contact updated");
  setContacts(
    contacts.map((c) =>
      c.id === editingContact.id
        ? { ...c, phone, email: contactEmail, linkedin, github: githubContact }
        : c
    )
  );

  setEditingContact(null);

    setPhone("");
    setContactEmail("");
    setLinkedin("");
    setGithubContact("");
    setShowContactForm(false);
    };
/*Delete */
const handleDeleteContact = async (id) => {
  await deleteDoc(doc(db, "users", user.uid, "contacts", id));

  setContacts(contacts.filter((c) => c.id !== id));
};

const portfolioURL = `${window.location.origin}/portfolio/${user?.uid}`;
const copyLink = () => {
  navigator.clipboard.writeText(portfolioURL);
  alert("Portfolio link copied!");
};
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {profile && !editing && (
            <div className="mt-6 bg-white p-6 rounded shadow w-96">
              {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border"
            />
          )}
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Name:</strong> {profile.name || "Not set"}</p>
          <p><strong>Bio:</strong> {profile.bio || "Not set"}</p>
          <p>
            <strong>Skills:</strong>{" "}
            {profile.skills?.length > 0
              ? profile.skills.join(", ")
              : "No skills added"}
          </p>

          {/* Buttons Section */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {showProjectForm ? "Close" : "Add Project"}
            </button>
             
            <button
                onClick={() => setShowExperienceForm(!showExperienceForm)}
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                {showExperienceForm ? "Close" : "Add Experience"}
            </button>

            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              {showContactForm ? "Close Contact" : "Add Contact"}
            </button>
          </div>
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-6 rounded shadow w-96"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 mb-4 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Bio"
            className="w-full p-2 mb-4 border rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills (comma separated)"
            className="w-full p-2 mb-4 border rounded"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Image URL"
            className="w-full p-2 mb-4 border rounded"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded"
          >
            Save
          </button>
        </form>
      )}
  {showExperienceForm && (
  <form
    onSubmit={handleAddExperience}
    className="mt-6 bg-white p-6 rounded shadow w-96"
  >
    <h2 className="text-xl font-semibold mb-4">Add Experience</h2>

    <input
      type="text"
      placeholder="Company"
      required
      className="w-full p-2 mb-3 border rounded"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
    />

    <input
      type="text"
      placeholder="Role"
      required
      className="w-full p-2 mb-3 border rounded"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    />

    <textarea
      placeholder="Description"
      required
      className="w-full p-2 mb-3 border rounded"
      value={expDescription}
      onChange={(e) => setExpDescription(e.target.value)}
    />
    <label className="text-sm font-medium">Start Date</label>
    <input
      type="date"
      placeholder="Start Date"
      className="w-full p-2 mb-3 border rounded"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
    <label className="flex items-center gap-2 mb-3">
      <input
        type="checkbox"
        checked={currentlyWorking}
        onChange={(e) => setCurrentlyWorking(e.target.checked)}
      />
      Currently Working Here
    </label>
    {!currentlyWorking && (
  <>
    <label className="text-sm font-medium">End Date</label>
    <input
      type="date"
      className="w-full p-2 mb-3 border rounded"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </>
)}

    <button className="w-full bg-black text-white p-2 rounded">
      Add Experience
    </button>
  </form>
)}
 {showContactForm && (
  <form
    onSubmit={handleAddContact}
    className="mt-6 bg-white p-6 rounded shadow w-96"
  >
    <h2 className="text-xl font-semibold mb-4">Add Contact</h2>

    <input
      type="text"
      placeholder="Phone"
      required
      className="w-full p-2 mb-3 border rounded"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <input
      type="email"
      placeholder="Email"
      required
      className="w-full p-2 mb-3 border rounded"
      value={contactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
    />

    <input
      type="text"
      placeholder="LinkedIn"
      className="w-full p-2 mb-3 border rounded"
      value={linkedin}
      onChange={(e) => setLinkedin(e.target.value)}
    />

    <input
      type="text"
      placeholder="GitHub"
      className="w-full p-2 mb-3 border rounded"
      value={githubContact}
      onChange={(e) => setGithubContact(e.target.value)}
    />

    <button 
    type="submit"
    className="w-full bg-black text-white p-2 rounded">
      Add Contact
    </button>
  </form>
)}
      
      {/* Edit Project Form */}
{editingProject && (
  <form
    onSubmit={handleUpdateProject}
    className="mt-6 bg-white p-6 rounded shadow w-96"
  >
    <h2 className="text-xl font-semibold mb-4">Edit Project</h2>

    <input
      type="text"
      placeholder="Project Title"
      className="w-full p-2 mb-3 border rounded"
      value={projectTitle}
      onChange={(e) => setProjectTitle(e.target.value)}
    />

    <textarea
      placeholder="Description"
      className="w-full p-2 mb-3 border rounded"
      value={projectDescription}
      onChange={(e) => setProjectDescription(e.target.value)}
    />

    <input
      type="text"
      placeholder="Image URL"
      className="w-full p-2 mb-3 border rounded"
      value={projectImage}
      onChange={(e) => setProjectImage(e.target.value)}
    />

    <input
      type="text"
      placeholder="GitHub Link"
      className="w-full p-2 mb-3 border rounded"
      value={projectGithub}
      onChange={(e) => setProjectGithub(e.target.value)}
    />

    <input
      type="text"
      placeholder="Live Demo Link"
      className="w-full p-2 mb-3 border rounded"
      value={projectLive}
      onChange={(e) => setProjectLive(e.target.value)}
    />

    <button
      type="submit"
      className="w-full bg-black text-white p-2 rounded"
    >
      Update Project
    </button>
  </form>
)}

      {/* Add Project Section */}
      {showProjectForm && (
        <div className="mt-6 bg-white p-6 rounded shadow w-96">
          <h2 className="text-xl font-semibold mb-4">
            Add New Project
          </h2>
          <AddProject />
        </div>
      )}
      
      {!editing && projects.length > 0 && (
    <div className="mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
      Your Projects
    </h2>
    
    <div className="grid md:grid-cols-2 gap-4">
    {projects.map(project => (
  <div
    key={project.id}
    className="border p-3 mb-3 rounded hover:bg-gray-100 cursor-pointer"
  >
    <h3 className="font-bold">{project.title}</h3>
    {project.imageURL && (
          <img
            src={project.imageURL}
            alt={project.title}
            className="mt-2 h-32 object-cover"
          />
        )}
    <p className="text-sm">{project.description}</p>

    <div className="flex gap-3 mt-2">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          className="text-blue-500"
        >
          GitHub
        </a>
      )}

      {project.live && (
        <a
          href={project.live}
          target="_blank"
          className="text-green-500"
        >
          Live
        </a>
      )}
    </div>
    
        {/* Edit + Delete buttons */}
    <div className="flex gap-3 mt-3">
      <button
        onClick={() => handleEditProject(project)}
        className="bg-yellow-400 px-3 py-1 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => handleDeleteProject(project.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
        
      </div>
      
    ))}
    </div>
  </div>
)}
{!editing && experiences.length > 0 && (
  <div className="mt-6 bg-white p-6 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">
      Your Experience
    </h2>
    <div className="grid md:grid-cols-2 gap-4">
    {experiences.map((exp) => (
      <div key={exp.id} className="border p-3 mb-3 rounded">
        <h3 className="font-bold">{exp.role}</h3>
        <p className="text-sm">{exp.company}</p>
        <p className="text-xs text-gray-500">
          {exp.startDate} - {exp.endDate}
        </p>

        <p className="text-sm mt-2">{exp.description}</p>

        <div className="flex gap-3 mt-3">
          <button
            onClick={() => handleEditExperience(exp)}
            className="bg-yellow-400 px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteExperience(exp.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
    </div>
  </div>
)}
{editingExperience && (
  <form
    onSubmit={handleUpdateExperience}
    className="mt-6 bg-white p-6 rounded shadow w-96"
  >
    <h2 className="text-xl font-semibold mb-4">Edit Experience</h2>

    <input
      type="text"
      placeholder="Company"
      className="w-full p-2 mb-3 border rounded"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
    />

    <input
      type="text"
      placeholder="Role"
      className="w-full p-2 mb-3 border rounded"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    />

    <textarea
      placeholder="Description"
      className="w-full p-2 mb-3 border rounded"
      value={expDescription}
      onChange={(e) => setExpDescription(e.target.value)}
    />
   <label className="text-sm font-medium">Start Date</label>
    <input
      type="date"
      placeholder="Start Date"
      className="w-full p-2 mb-3 border rounded"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
    <label className="flex items-center gap-2 mb-3">
      <input
        type="checkbox"
        checked={currentlyWorking}
        onChange={(e) => setCurrentlyWorking(e.target.checked)}
      />
      Currently Working Here
    </label>
    {!currentlyWorking && (
  <>
    <label className="text-sm font-medium">End Date</label>
    <input
      type="date"
      className="w-full p-2 mb-3 border rounded"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </>
)}

    <button
      type="submit"
      className="w-full bg-black text-white p-2 rounded"
    >
      Update Experience
    </button>
  </form>
)}

{!editing && contacts.length > 0 && (
  <div className="mt-6 bg-white p-6 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">
      Your Contacts
    </h2>

    <div className="grid md:grid-cols-2 gap-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="border p-3 rounded">

          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>LinkedIn:</strong> {contact.linkedin}</p>
          <p><strong>GitHub:</strong> {contact.github}</p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => handleEditContact(contact)}
              className="bg-yellow-400 px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteContact(contact.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  </div>
)}

{editingContact && (
  <form
    onSubmit={handleUpdateContact}
    className="mt-6 bg-white p-6 rounded shadow w-96"
  >
    <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>

    <input
      type="text"
      placeholder="Phone"
      className="w-full p-2 mb-3 border rounded"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <input
      type="email"
      placeholder="Email"
      className="w-full p-2 mb-3 border rounded"
      value={contactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
    />

    <input
      type="text"
      placeholder="LinkedIn"
      className="w-full p-2 mb-3 border rounded"
      value={linkedin}
      onChange={(e) => setLinkedin(e.target.value)}
    />

    <input
      type="text"
      placeholder="GitHub"
      className="w-full p-2 mb-3 border rounded"
      value={githubContact}
      onChange={(e) => setGithubContact(e.target.value)}
    />

    <button className="w-full bg-black text-white p-2 rounded">
      Update Contact
    </button>
  </form>
)}

  {!editing && (
  <div className="mt-6 bg-white p-4 rounded shadow w-96">
    <h3 className="font-semibold mb-2">Your Portfolio Link</h3>

    <div className="flex items-center gap-2">
      <input
        type="text"
        value={portfolioURL}
        readOnly
        className="flex-1 border p-2 rounded text-sm"
      />

      <button
        onClick={copyLink}
        className="bg-black text-white px-3 py-2 rounded"
      >
        Copy
      </button>
    </div>
  </div> 
)} 
      {!editing && (
        <a
          href={`/portfolio/${user?.uid}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
        View Portfolio
      </a>
     )}
     {!editing && (
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded"
      >
        Logout
      </button>
      )}
    </div>
  );
}

export default Dashboard;