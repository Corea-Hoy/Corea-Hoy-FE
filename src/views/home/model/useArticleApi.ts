import { getArticles } from '../api/articles.api';

export async function getArticlesData() {
  const res = await getArticles();
  return res.data;
}
