import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the "shape" of a single crypto object for TypeScript
// This matches the data coming from the backend's /coins/markets endpoint
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// The component receives an array of 'CryptoData' objects as a prop
function CryptoHeatmap({ data }: { data: CryptoData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Market Movers (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* We map over the data array to create a tile for each crypto */}
          {data.map((crypto) => (
            <div
              key={crypto.id}
              // This is the "heatmap" logic. The background color changes based
              // on whether the 24h price change is positive or negative.
              // It also includes classes for dark mode (dark:bg-...).
              className={`p-4 rounded-lg text-center transition-transform hover:scale-105 ${
                crypto.price_change_percentage_24h >= 0
                  ? "bg-green-100 dark:bg-green-900/50"
                  : "bg-red-100 dark:bg-red-900/50"
              }`}
            >
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 mx-auto mb-2" // Center the image
              />
              <h3 className="font-bold text-lg">
                {crypto.symbol.toUpperCase()}
              </h3>
              <p
                className={`font-semibold ${
                  crypto.price_change_percentage_24h >= 0
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {/* We use toFixed(2) to limit the number to two decimal places */}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CryptoHeatmap;
