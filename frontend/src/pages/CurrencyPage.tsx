// import { useState, useEffect } from "react";
// import { getRates } from "@/services/api";

// // Define the shape of the rates API response
// interface RatesApiResponse {
//   result: string;
//   base_code: string;
//   conversion_rates: {
//     [currencyCode: string]: number;
//   };
// }

// function CurrencyPage() {
//   // 1. Correctly type the state for the rates data
//   const [rates, setRates] = useState<RatesApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         const data = await getRates();
//         // 2. Set the state with the data object directly
//         setRates(data);
//       } catch (err) {
//         setError("Failed to fetch exchange rates. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRates();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Currency Exchange Rates</h1>
//       {loading && <p>Loading rates...</p>}
//       {error && <p className="text-red-500">{error}</p>}
      
//       {/* 3. Correctly render the rates data */}
//       {!loading && !error && rates && (
//         <div>
//           <h3 className="text-lg font-medium mb-2">Base Currency: {rates.base_code}</h3>
//           <div className="space-y-2">
//             {/* Access the 'conversion_rates' property of the rates object */}
//             {Object.entries(rates.conversion_rates).map(([currencyCode, rate]) => (
//               <div key={currencyCode} className="flex justify-between p-3 bg-muted rounded-lg">
//                 <span className="font-medium">{currencyCode}</span>
//                 <span>{rate.toFixed(4)}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CurrencyPage;



/////Test

import { useState, useEffect, useMemo } from "react";
import { getRates } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatesApiResponse {
  result: string;
  base_code: string;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}

function CurrencyPage() {
  const [rates, setRates] = useState<RatesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search/filter state
  const [search, setSearch] = useState("");

  // Converter state
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await getRates();
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

  // Filtered currency list based on search input
  const filteredRates = useMemo(() => {
    if (!rates) return [];
    return Object.entries(rates.conversion_rates).filter(([code]) =>
      code.toLowerCase().includes(search.toLowerCase())
    );
  }, [rates, search]);

  // Conversion calculation
  const convertedAmount = useMemo(() => {
    if (!rates || !amount || isNaN(parseFloat(amount))) return null;
    const fromRate = rates.conversion_rates[fromCurrency];
    const toRate = rates.conversion_rates[toCurrency];
    if (!fromRate || !toRate) return null;
    // Convert: amount in fromCurrency → USD → toCurrency
    const inUSD = parseFloat(amount) / fromRate;
    return (inUSD * toRate).toFixed(4);
  }, [rates, amount, fromCurrency, toCurrency]);

  const currencyCodes = rates ? Object.keys(rates.conversion_rates) : [];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Currency Exchange Rates</h1>

      {loading && <p className="text-muted-foreground">Loading rates...</p>}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && rates && (
        <div className="space-y-8">

          {/* --- Currency Converter --- */}
          <div className="p-5 border rounded-xl bg-card space-y-4">
            <h2 className="text-xl font-semibold">Currency Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="from">From</Label>
                <select
                  id="from"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {currencyCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="to">To</Label>
                <select
                  id="to"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {currencyCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>
            {convertedAmount !== null && (
              <div className="mt-2 p-3 bg-muted rounded-lg text-center">
                <span className="text-2xl font-bold">
                  {parseFloat(amount).toLocaleString()} {fromCurrency} = {parseFloat(convertedAmount).toLocaleString()} {toCurrency}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  1 {fromCurrency} = {(parseFloat(convertedAmount) / parseFloat(amount || "1")).toFixed(6)} {toCurrency}
                </p>
              </div>
            )}
          </div>

          {/* --- All Rates with Search --- */}
          <div>
            <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
              <h2 className="text-xl font-semibold">
                All Rates <span className="text-muted-foreground text-base font-normal">(Base: {rates.base_code})</span>
              </h2>
              <Input
                placeholder="Search currency (e.g. EUR, GBP)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>

            {filteredRates.length === 0 ? (
              <p className="text-muted-foreground">No currencies match "{search}".</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredRates.map(([code, rate]) => (
                  <div key={code} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{code}</span>
                    <span className="text-muted-foreground">{rate.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default CurrencyPage;