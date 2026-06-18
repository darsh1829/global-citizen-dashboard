// import { useState, useEffect } from "react";
// import { getCryptos } from "@/services/api";

// // Define the shape of the crypto API response
// interface CryptoApiResponse {
//   [coinId: string]: {
//     [currency: string]: number;
//   };
// }

// function CryptoPage() {
//   // 1. Correctly type the state for the crypto data
//   const [cryptos, setCryptos] = useState<CryptoApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // 2. Renamed the function for clarity
//     const fetchCryptos = async () => {
//       try {
//         const data = await getCryptos();
//         // 3. Set the state with the data object directly
//         setCryptos(data);
//       } catch (err) {
//         setError("Failed to fetch crypto prices. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCryptos();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Cryptocurrency Prices</h1>
//       {loading && <p>Loading prices...</p>}
//       {error && <p className="text-red-500">{error}</p>}
      
//       {/* 4. Correctly render the crypto data */}
//       {!loading && !error && cryptos && (
//         <div className="space-y-2">
//           {Object.entries(cryptos).map(([coinId, priceData]) => (
//             <div key={coinId} className="flex justify-between p-3 bg-muted rounded-lg">
//               <span className="capitalize font-medium">{coinId}</span>
//               {/* Access the 'usd' property of the priceData object */}
//               <span>${priceData.usd.toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CryptoPage;





///////Test
import { useState, useEffect } from "react";
import { getCryptos } from "@/services/api";

// FIX: Updated to match the new /coins/markets response shape from backend
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

function CryptoPage() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await getCryptos() as CryptoData[];
        setCryptos(data);
      } catch (err) {
        setError("Failed to fetch crypto prices. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h1>

      {loading && <p className="text-muted-foreground">Loading prices...</p>}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptos.map((coin) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            return (
              <div key={coin.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${coin.current_price.toLocaleString()}</p>
                  <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CryptoPage;