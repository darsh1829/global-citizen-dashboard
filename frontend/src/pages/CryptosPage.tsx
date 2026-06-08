import { useState, useEffect } from "react";
import { getCryptos } from "@/services/api";

// Define the shape of the crypto API response
interface CryptoApiResponse {
  [coinId: string]: {
    [currency: string]: number;
  };
}

function CryptoPage() {
  // 1. Correctly type the state for the crypto data
  const [cryptos, setCryptos] = useState<CryptoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 2. Renamed the function for clarity
    const fetchCryptos = async () => {
      try {
        const data = await getCryptos();
        // 3. Set the state with the data object directly
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Prices</h1>
      {loading && <p>Loading prices...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* 4. Correctly render the crypto data */}
      {!loading && !error && cryptos && (
        <div className="space-y-2">
          {Object.entries(cryptos).map(([coinId, priceData]) => (
            <div key={coinId} className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="capitalize font-medium">{coinId}</span>
              {/* Access the 'usd' property of the priceData object */}
              <span>${priceData.usd.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CryptoPage;