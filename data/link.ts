export interface Link {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: string;
}

export const DUMMY_LINKS: Link[] = [
  {
    id: "link-1",
    title: "인스타그램",
    url: "https://instagram.com/example",
    favicon: "https://www.instagram.com/favicon.ico",
    createdAt: new Date("2024-03-01").toISOString(),
  },
  {
    id: "link-2",
    title: "유튜브",
    url: "https://youtube.com/@example",
    favicon: "https://www.youtube.com/favicon.ico",
    createdAt: new Date("2024-03-05").toISOString(),
  },
  {
    id: "link-3",
    title: "블로그",
    url: "https://maedyoung.tistory.com/",
    favicon: "https://blog.example.com/favicon.ico",
    createdAt: new Date("2024-03-10").toISOString(),
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com/HolicKW",
    favicon: "https://github.com/favicon.ico",
    createdAt: new Date("2024-03-15").toISOString(),
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://portfolio.example.com",
    favicon: "https://portfolio.example.com/favicon.ico",
    createdAt: new Date("2024-03-20").toISOString(),
  },
];
