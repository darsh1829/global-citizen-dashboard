import { useState, useEffect } from "react";
import { getNews } from "@/services/api"; // Using the correct path alias
import NewsCard from "@/components/NewsCard";

// Define a type for a single news article
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  author: string;
}

// Define a type for the entire API response object
interface NewsApiResponse {
  status: string;
  news: NewsArticle[];
}
function NewsPage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
      
        const data = await getNews() as NewsApiResponse;
        
        setNews(data.news); 

      } catch (err) {
        setError("Failed to fetch news. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  
    return(
        <>
        <div>Welcome to News Page</div>
            {loading && <p>Loading News...</p>}
      {error && <p className="text-red-500">Null</p>}

      {!loading && !error && (


    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {news.map(article => (
    <NewsCard key={article.id} article={article} />
  ))}
</div>

)}
</>
    );
}

export default NewsPage;