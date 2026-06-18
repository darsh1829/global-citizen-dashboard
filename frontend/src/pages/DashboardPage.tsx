// import { useEffect, useState } from "react";
// import { getNews, getCryptos, getRates } from "@/services/api";
// import NewsCard from "@/components/NewsCard";
// import CryptoHeatmap from "@/components/CryptoHeatmap"; // Import the new component

// // --- TypeScript Interfaces ---

// // This interface is correct for the News API
// interface NewsArticle {
//   id: string;
//   title: string;
//   description: string;
//   url: string;
//   image: string;
//   published: string;
//   author: string;
// }

// interface NewsApiResponse {
//   status: string;
//   news: NewsArticle[];
// }

// // FIX: This new interface matches the richer data from our upgraded backend crypto route
// interface CryptoData {
//   id: string;
//   symbol: string;
//   name: string;
//   image: string;
//   current_price: number;
//   price_change_percentage_24h: number;
// }

// // This interface is correct for the Rates API
// interface RatesApiResponse {
//   result: string;
//   base_code: string;
//   conversion_rates: {
//     [currencyCode: string]: number;
//   };
// }

// function DashboardPage() {
//   // --- State Management ---
//   const [news, setNews] = useState<NewsArticle[]>([]);
//   // FIX: The crypto state now expects an array of CryptoData objects
//   const [crypto, setCrypto] = useState<CryptoData[]>([]);
//   const [rates, setRates] = useState<RatesApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // --- Data Fetching ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [newsData, cryptoData, ratesData] = await Promise.all([
//           getNews() as unknown as NewsApiResponse,
//           // FIX: The type assertion now uses the new CryptoData array type
//           getCryptos() as unknown as CryptoData[],
//           getRates() as unknown as RatesApiResponse,
//         ]);

//         setNews(newsData.news);
//         // FIX: cryptoData is now the array itself
//         setCrypto(cryptoData);
//         setRates(ratesData);

//       } catch (err) {
//         setError("Failed to fetch data. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // --- Conditional Rendering for Loading and Error States ---
//   if (loading) {
//     // You can replace this with a nice spinner component later
//     return <div className="flex justify-center items-center h-screen"><p>Loading your dashboard...</p></div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
//   }

//   // --- Main Render ---
//   return (
//     <div className="container mx-auto p-4 md:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-6">Home Dashboard</h1>

//       {/* --- News Section --- */}
//       <section className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Top Stories</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {news.slice(0, 3).map(article => (
//             <NewsCard key={article.id} article={article} />
//           ))}
//         </div>
//       </section>

//       {/* --- Financial Data Section --- */}
//       <section className="grid md:grid-cols-2 gap-8">
        
//         {/* FIX: Render the new CryptoHeatmap component */}
//         {crypto.length > 0 && <CryptoHeatmap data={crypto.slice(0, 6)} />}

//         {/* Exchange Rates */}
//         {rates && (
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Exchange Rates (Base: {rates.base_code})</h2>
//             <div className="space-y-2">
//               {Object.entries(rates.conversion_rates).slice(0, 5).map(([currencyCode, rate]) => (
//                 <div key={currencyCode} className="flex justify-between p-3 bg-muted rounded-lg">
//                   <span className="font-medium">{currencyCode}</span>
//                   <span>{rate.toFixed(4)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// export default DashboardPage;



///////TEst

import { useEffect, useState } from "react";
import { getNews, getCryptos, getRates } from "@/services/api";
import NewsCard from "@/components/NewsCard";
import CryptoHeatmap from "@/components/CryptoHeatmap";

// --- TypeScript Interfaces ---

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

// FIX: This now matches the /coins/markets response from the updated backend
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface RatesApiResponse {
  result: string;
  base_code: string;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}

// Key currencies to show on the dashboard summary (instead of all 160+)
const FEATURED_CURRENCIES = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CNY', 'CHF'];

function DashboardPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [crypto, setCrypto] = useState<CryptoData[]>([]);
  const [rates, setRates] = useState<RatesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, cryptoData, ratesData] = await Promise.all([
          getNews() as unknown as NewsApiResponse,
          getCryptos() as unknown as CryptoData[],
          getRates() as unknown as RatesApiResponse,
        ]);

        setNews(newsData.news);
        setCrypto(cryptoData); // Now correctly an array from /coins/markets
        setRates(ratesData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Home Dashboard</h1>

      {/* --- News Section --- */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Stories</h2>
        {news.length === 0 ? (
          <p className="text-muted-foreground">No news available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* --- Financial Data Section --- */}
      <section className="grid md:grid-cols-2 gap-8">

        {/* Crypto Heatmap */}
        {crypto.length > 0 && <CryptoHeatmap data={crypto.slice(0, 6)} />}

        {/* Exchange Rates — show only featured currencies */}
        {rates && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Exchange Rates <span className="text-muted-foreground text-base font-normal">(Base: {rates.base_code})</span>
            </h2>
            <div className="space-y-2">
              {FEATURED_CURRENCIES
                .filter(code => rates.conversion_rates[code])
                .map(code => (
                  <div key={code} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{code}</span>
                    <span>{rates.conversion_rates[code].toFixed(4)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
