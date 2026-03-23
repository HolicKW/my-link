export interface Link {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  category?: "Social" | "Project" | "Blog" | "Contact";
  createdAt: string;
}

export const DUMMY_LINKS: Link[] = [
  {
    id: "link-1",
    title: "GitHub Profile",
    url: "https://github.com/example-dev",
    favicon: "https://github.com/favicon.ico",
    category: "Social",
    createdAt: new Date("2024-03-01").toISOString(),
  },
  {
    id: "link-2",
    title: "Personal Tech Blog",
    url: "https://blog.example.com",
    favicon: "https://blog.example.com/favicon.ico",
    category: "Blog",
    createdAt: new Date("2024-03-05").toISOString(),
  },
  {
    id: "link-3",
    title: "My Portfolio Website",
    url: "https://portfolio.example.com",
    favicon: "https://portfolio.example.com/favicon.ico",
    category: "Project",
    createdAt: new Date("2024-03-10").toISOString(),
  },
  {
    id: "link-4",
    title: "LinkedIn Profile",
    url: "https://linkedin.com/in/example-dev",
    favicon: "https://linkedin.com/favicon.ico",
    category: "Social",
    createdAt: new Date("2024-03-15").toISOString(),
  },
  {
    id: "link-5",
    title: "YouTube Channel - Coding Tutorials",
    url: "https://youtube.com/@example-dev",
    favicon: "https://youtube.com/favicon.ico",
    category: "Social",
    createdAt: new Date("2024-03-20").toISOString(),
  },
];
