import { api, HydrateClient } from "~/trpc/server";
import { LatestPost } from "~/components/articles/latest-post";

export default async function Home() {
  const { items: articles } = await api.article.getArticle({});

  return (
    <HydrateClient>
      <LatestPost articles={articles} />
    </HydrateClient>
  );
}
