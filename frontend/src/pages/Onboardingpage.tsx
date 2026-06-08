import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { updateUserPreferences } from "@/services/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// TODO: We will need to import a function to save preferences
// import { updateUserPreferences } from "@/services/api"; 

// --- Data for our dropdowns ---
const countries = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
];

export const cryptocurrencies = [
  { value: "bitcoin", label: "Bitcoin (BTC)" },
  { value: "ethereum", label: "Ethereum (ETH)" },
  { value: "tether", label: "Tether (USDT)" },
  { value: "binancecoin", label: "BNB" },
  { value: "solana", label: "Solana (SOL)" },
  { value: "ripple", label: "XRP" },
  { value: "dogecoin", label: "Dogecoin (DOGE)" },
  { value: "cardano", label: "Cardano (ADA)" },
  { value: "avalanche-2", label: "Avalanche (AVAX)" },
  { value: "chainlink", label: "Chainlink (LINK)" },
];

function OnboardingPage() {
  // --- State Management ---
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  // FIX: Each popover needs its own open/closed state
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [cryptosOpen, setCryptosOpen] = useState(false);
  const navigate = useNavigate();

  // --- Form Submission Handler ---
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: Step 1: Save the user's preferences (we'll build this next)
       await updateUserPreferences({  tracked_countries: selectedCountries, tracked_cryptos: selectedCryptos });
      console.log("Selected countries:", selectedCountries);
      console.log("Selected cryptos:", selectedCryptos);
        
      // Step 2: Redirect to the dashboard
      navigate('/');
    } catch (err) {
      console.error("Failed to save onboarding data:", err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome! Let's Set Up Your Dashboard</CardTitle>
          <CardDescription>Personalize your experience by selecting your preferences.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="grid gap-6">
            {/* --- Country Combobox --- */}
            <div className="grid gap-2">
              <Label>Countries</Label>
              <Popover open={countriesOpen} onOpenChange={setCountriesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countriesOpen}
                    className="w-full justify-between"
                  >
                    {selectedCountries.length > 0
                      ? `${selectedCountries.length} countries selected`
                      : "Select countries..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.value}
                            onSelect={(currentValue) => {
                              setSelectedCountries((prev) =>
                                prev.includes(currentValue)
                                  ? prev.filter((item) => item !== currentValue)
                                  : [...prev, currentValue]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountries.includes(country.value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* --- Cryptocurrency Combobox --- */}
            <div className="grid gap-2">
              <Label>Cryptocurrencies</Label>
              <Popover open={cryptosOpen} onOpenChange={setCryptosOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cryptosOpen}
                    className="w-full justify-between"
                  >
                    {selectedCryptos.length > 0
                      ? `${selectedCryptos.length} cryptos selected`
                      : "Select cryptocurrencies..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search cryptocurrency..." />
                    <CommandList>
                      <CommandEmpty>No crypto found.</CommandEmpty>
                      <CommandGroup>
                        {cryptocurrencies.map((crypto) => (
                          <CommandItem
                            key={crypto.value}
                            value={crypto.value}
                            onSelect={(currentValue) => {
                              setSelectedCryptos((prev) =>
                                prev.includes(currentValue)
                                  ? prev.filter((item) => item !== currentValue)
                                  : [...prev, currentValue]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                // FIX: Checkmark logic now correctly uses 'selectedCryptos'
                                selectedCryptos.includes(crypto.value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {crypto.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Save and Continue</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default OnboardingPage;
