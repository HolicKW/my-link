export interface Link {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export const DUMMY_LINKS: Link[] = [
  {
    id: "link-1",
    title: "인스타그램",
    url: "https://instagram.com/example",
    createdAt: new Date("2024-03-01").toISOString(),
  },
  {
    id: "link-2",
    title: "유튜브",
    url: "https://youtube.com/@example",
    createdAt: new Date("2024-03-05").toISOString(),
  },
  {
    id: "link-3",
    title: "블로그",
    url: "https://example.tistory.com",
    createdAt: new Date("2024-03-10").toISOString(),
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com/example",
    createdAt: new Date("2024-03-15").toISOString(),
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://portfolio.example.com",
    createdAt: new Date("2024-03-20").toISOString(),
  },
];
