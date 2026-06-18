import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getUserProfile, getUserPreferences, updateUserPreferences, updateUserName } from "@/services/api";

import { cryptocurrencies } from "./Onboardingpage";

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
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "za", label: "South Africa" },
  { value: "sg", label: "Singapore" },
  { value: "ae", label: "UAE" },
  { value: "kr", label: "South Korea" },
];

function SettingsPage() {
  const [name, setName] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [cryptosOpen, setCryptosOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileData, preferencesData] = await Promise.all([
          getUserProfile(),
          getUserPreferences()
        ]);
        setName(profileData.name || '');
        setSelectedCountries(preferencesData.tracked_countries || []);
        setSelectedCryptos(preferencesData.tracked_cryptos || []);
      } catch (err) {
        setError("Failed to load your settings. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setSaving(true);
    try {
      await Promise.all([
        updateUserName(name),
        updateUserPreferences({
          tracked_countries: selectedCountries,
          tracked_cryptos: selectedCryptos,
        })
      ]);
      setSuccessMessage("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account & Preferences</CardTitle>
          <CardDescription>Update your display name and dashboard preferences.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="grid gap-6">

            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Tracked Countries</Label>
              <Popover open={countriesOpen} onOpenChange={setCountriesOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedCountries.length > 0
                      ? `${selectedCountries.length} ${selectedCountries.length === 1 ? 'country' : 'countries'} selected`
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
                            <Check className={cn("mr-2 h-4 w-4", selectedCountries.includes(country.value) ? "opacity-100" : "opacity-0")} />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Tracked Cryptocurrencies</Label>
              <Popover open={cryptosOpen} onOpenChange={setCryptosOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedCryptos.length > 0
                      ? `${selectedCryptos.length} ${selectedCryptos.length === 1 ? 'crypto' : 'cryptos'} selected`
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
                            <Check className={cn("mr-2 h-4 w-4", selectedCryptos.includes(crypto.value) ? "opacity-100" : "opacity-0")} />
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
          <CardFooter className="border-t px-6 py-4 flex items-center gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {successMessage && (
              <p className="text-sm text-green-600 font-medium">{successMessage}</p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;