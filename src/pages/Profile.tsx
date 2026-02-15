import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Wheat, LogOut, Crown, Settings, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import SecondaryNav from "@/components/SecondaryNav";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, subscription, isPremium, isAuthenticated, loading, signOut, updateProfile } = useAuth();
  const { isHindi } = useLanguage();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    village: "",
    district: "",
    state: "",
    primary_crops: "",
    total_land_bigha: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=/profile", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        village: profile.village || "",
        district: profile.district || "",
        state: profile.state || "",
        primary_crops: profile.primary_crops?.join(", ") || "",
        total_land_bigha: profile.total_land_bigha?.toString() || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const crops = form.primary_crops
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const { error } = await updateProfile({
      display_name: form.display_name || null,
      phone: form.phone || null,
      village: form.village || null,
      district: form.district || null,
      state: form.state || null,
      primary_crops: crops.length > 0 ? crops : null,
      total_land_bigha: form.total_land_bigha ? parseFloat(form.total_land_bigha) : null,
    });

    if (error) {
      toast({ title: isHindi ? "त्रुटि" : "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: isHindi ? "सहेजा गया ✓" : "Saved ✓" });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={isHindi ? "प्रोफ़ाइल" : "Profile"} />

      <main className="p-4 max-w-lg mx-auto space-y-6 mt-4">
        {/* User info card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`font-semibold text-foreground truncate ${isHindi ? "font-hindi" : ""}`}>
                {profile?.display_name || user?.email?.split("@")[0] || (isHindi ? "किसान" : "Farmer")}
              </h2>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            {isPremium && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
          </div>
        </div>

        {/* Subscription section */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className={`font-semibold text-foreground mb-3 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "सदस्यता" : "Subscription"}
          </h3>
          {isPremium && subscription ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "प्लान" : "Plan"}
                </span>
                <span className="font-medium text-foreground">{subscription.plan_type}</span>
              </div>
              {subscription.expires_at && (
                <div className="flex justify-between text-sm">
                  <span className={`text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                    {isHindi ? "समाप्ति" : "Expires"}
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date(subscription.expires_at).toLocaleDateString("hi-IN")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className={`text-sm text-muted-foreground mb-3 ${isHindi ? "font-hindi" : ""}`}>
                {isHindi ? "अभी कोई सक्रिय प्लान नहीं है" : "No active plan"}
              </p>
              <Button
                onClick={() => navigate("/pricing")}
                variant="outline"
                className={`w-full ${isHindi ? "font-hindi" : ""}`}
              >
                <Crown className="w-4 h-4 mr-2" />
                {isHindi ? "अपग्रेड करें" : "Upgrade"}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          )}
        </div>

        {/* Farming profile */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-foreground ${isHindi ? "font-hindi" : ""}`}>
              {isHindi ? "खेती की जानकारी" : "Farm Details"}
            </h3>
            {!editing && (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Settings className="w-4 h-4 mr-1" />
                {isHindi ? "बदलें" : "Edit"}
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "नाम" : "Name"}
                </label>
                <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "फ़ोन" : "Phone"}
                </label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} maxLength={10} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                    {isHindi ? "गांव" : "Village"}
                  </label>
                  <Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                    {isHindi ? "जिला" : "District"}
                  </label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "राज्य" : "State"}
                </label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "मुख्य फसलें (कॉमा से अलग करें)" : "Primary Crops (comma-separated)"}
                </label>
                <Input
                  value={form.primary_crops}
                  onChange={(e) => setForm({ ...form, primary_crops: e.target.value })}
                  placeholder={isHindi ? "गेहूं, चावल, कपास" : "wheat, rice, cotton"}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "कुल ज़मीन (बीघा)" : "Total Land (bigha)"}
                </label>
                <Input
                  type="number"
                  value={form.total_land_bigha}
                  onChange={(e) => setForm({ ...form, total_land_bigha: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className={`flex-1 ${isHindi ? "font-hindi" : ""}`}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  {isHindi ? "सहेजें" : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "रद्द करें" : "Cancel"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {profile?.village && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{[profile.village, profile.district, profile.state].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {profile?.primary_crops && profile.primary_crops.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wheat className="w-4 h-4" />
                  <span>{profile.primary_crops.join(", ")}</span>
                </div>
              )}
              {profile?.total_land_bigha && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-4 h-4 text-center text-xs">📐</span>
                  <span>{profile.total_land_bigha} {isHindi ? "बीघा" : "bigha"}</span>
                </div>
              )}
              {!profile?.village && !profile?.primary_crops?.length && (
                <p className={`text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
                  {isHindi ? "अपनी खेती की जानकारी जोड़ें" : "Add your farm details"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sign out */}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className={`w-full text-destructive border-destructive/30 hover:bg-destructive/10 ${isHindi ? "font-hindi" : ""}`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isHindi ? "लॉग आउट करें" : "Sign Out"}
        </Button>
      </main>
    </div>
  );
};

export default Profile;
