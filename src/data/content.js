// content.js: profile and interests. Project data lives in data/projects.json.

// About me
const fName = "Alec"
const lName = "Rotter"
const fullName = fName + " " + lName

export const profile = {
  name: "Alec Rotter",
  // One short line that says what I do
  tagline: "Systems & DevOps Engineer · Developer · Builder · Problem solver",
  // Bio. Each string in this array becomes its own paragraph.
  bio: [
    `Hey, I'm ${fullName} — an engineer who loves turning ideas into working tech solutions. I started building because I wanted tools that worked well for my usecases.`,
    "I enjoy reading about new tech, tinkering with side projects, and learning how things work",
  ],
  // Links (show up in contact section)
  email: "alec_rotter@outlook.com",
  github: "https://www.github.com/rotteralec",
  linkedin: "https://www.linkedin.com/in/alec-rotter/",
};

// Interests
// Short labels of things I'm into.
export const interests = [
  "Application Development",
  "Open source",
  "Data Analysis",
  "Automation",
  "Sports Statistics",
  "Music",
];
