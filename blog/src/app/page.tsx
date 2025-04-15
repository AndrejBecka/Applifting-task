// app/page.tsx
import { api, HydrateClient } from "~/trpc/server";
import { LatestPostClient } from "~/components/articles/latest-post";

export default async function Home() {
  const articles = await api.article.getArticle({});

  return (
    <HydrateClient>
      <LatestPostClient articles={articles.items} />
    </HydrateClient>
  );
}
