// import { useState, useEffect } from "react";
// import { getNews } from "@/services/api"; // Using the correct path alias
// import NewsCard from "@/components/NewsCard";

// // Define a type for a single news article
// interface NewsArticle {
//   id: string;
//   title: string;
//   description: string;
//   url: string;
//   image: string;
//   published: string;
//   author: string;
// }

// // Define a type for the entire API response object
// interface NewsApiResponse {
//   status: string;
//   news: NewsArticle[];
// }
// function NewsPage() {
//     const [news, setNews] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
      
//         const data = await getNews() as NewsApiResponse;
        
//         setNews(data.news); 

//       } catch (err) {
//         setError("Failed to fetch news. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);
  
//     return(
//         <>
//         <div>Welcome to News Page</div>
//             {loading && <p>Loading News...</p>}
//       {error && <p className="text-red-500">Null</p>}

//       {!loading && !error && (


//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//   {news.map(article => (
//     <NewsCard key={article.id} article={article} />
//   ))}
// </div>

// )}
// </>
//     );
// }

// export default NewsPage;



//////Test

import { useState, useEffect } from "react";
import { getNews } from "@/services/api";
import NewsCard from "@/components/NewsCard";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  author: string;
}

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
        // FIX: Was showing literal "Null" string instead of the actual error
        setError("Failed to fetch news. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>

      {loading && <p className="text-muted-foreground">Loading news...</p>}

      {/* FIX: Now shows the actual error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="text-muted-foreground">No articles found.</p>
      )}

      {!loading && !error && news.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsPage;