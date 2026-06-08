import { useState, useEffect } from "react";
import { getRates } from "@/services/api";

// Define the shape of the rates API response
interface RatesApiResponse {
  result: string;
  base_code: string;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}

function CurrencyPage() {
  // 1. Correctly type the state for the rates data
  const [rates, setRates] = useState<RatesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await getRates();
        // 2. Set the state with the data object directly
        setRates(data);
      } catch (err) {
        setError("Failed to fetch exchange rates. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Currency Exchange Rates</h1>
      {loading && <p>Loading rates...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* 3. Correctly render the rates data */}
      {!loading && !error && rates && (
        <div>
          <h3 className="text-lg font-medium mb-2">Base Currency: {rates.base_code}</h3>
          <div className="space-y-2">
            {/* Access the 'conversion_rates' property of the rates object */}
            {Object.entries(rates.conversion_rates).map(([currencyCode, rate]) => (
              <div key={currencyCode} className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{currencyCode}</span>
                <span>{rate.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrencyPage;
