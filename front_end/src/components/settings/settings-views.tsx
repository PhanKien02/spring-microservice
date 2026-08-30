"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Camera, ShieldCheck, Laptop, Volume2 } from "lucide-react";

// Type definitions
type NotificationKey = "messageNotifications" | "groupNotifications" | "callNotifications" | "notificationSound" | "desktopNotifications";
type PrivacyKey = "whoCanMessageMe" | "whoCanCallMe" | "lastSeen" | "onlineStatus";
type PrivacyValue = "everyone" | "contacts" | "nobody";
type ThemeType = "light" | "dark" | "system";

// Constants
const NOTIFICATION_KEYS: NotificationKey[] = [
  "messageNotifications",
  "groupNotifications",
  "callNotifications",
  "notificationSound",
  "desktopNotifications",
];

const PRIVACY_SETTINGS: Array<{ key: PrivacyKey }> = [
  { key: "whoCanMessageMe" },
  { key: "whoCanCallMe" },
  { key: "lastSeen" },
  { key: "onlineStatus" },
];

const THEME_OPTIONS: ThemeType[] = ["light", "dark", "system"];

const MICROPHONE_OPTIONS = [
  { value: "default", label: "Default Input Mic" },
  { value: "ext", label: "External Microphone (USB)" },
];

const CAMERA_OPTIONS = [
  { value: "default", label: "Integrated FaceTime Camera" },
  { value: "web", label: "USB Webcam HD" },
];

const SPEAKER_OPTIONS = [
  { value: "default", label: "Built-in Speakers" },
  { value: "ext", label: "Stereo Headphones (Bluetooth)" },
];

// Reusable Components
interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface NotificationToggleProps {
  notificationKey: NotificationKey;
  label: string;
  defaultChecked?: boolean;
}

function NotificationToggle({ notificationKey, label, defaultChecked = true }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3.5">
      <div className="space-y-0.5 pr-2">
        <Label className="text-sm font-bold cursor-pointer" htmlFor={notificationKey}>
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">
          Receive push notifications for {notificationKey.replace("Notifications", "")}
        </p>
      </div>
      <Switch id={notificationKey} defaultChecked={defaultChecked} />
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

function SelectSetting({ label, value, onValueChange, options, placeholder = "Select option" }: SelectSettingProps) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ProfileSettings() {
  const t = useTranslations("settings");
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = React.useState(currentUser?.fullName || "");
  const [username, setUsername] = React.useState(currentUser?.userName || "");
  const [bio, setBio] = React.useState(currentUser?.bio || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile({ fullName: name, userName: username, bio });
    setIsSaving(false);
    toast.success(t("saved"));
  };

  return (
    <SettingsSection
      title={t("profile")}
      description="Manage your public profile settings"
    >
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer">
          <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>{currentUser?.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{currentUser?.fullName}</h4>
          <p className="text-xs text-muted-foreground">@{currentUser?.userName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="displayName">{t("displayName")}</Label>
          <Input id="displayName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">{t("bio")}</Label>
          <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : t("save")}
      </Button>
    </SettingsSection>
  );
}

export function AccountSettings() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [email, setEmail] = React.useState(currentUser?.email || "");

  const handleSave = () => {
    toast.success("Account settings updated");
  };

  return (
    <SettingsSection
      title="Account"
      description="Manage your email and sign in configurations"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input id="currentPassword" type="password" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" type="password" />
        </div>
      </div>

      <Button onClick={handleSave}>Save account settings</Button>

      <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4 mt-8">
        <h4 className="text-sm font-bold text-destructive">Danger Zone</h4>
        <p className="text-xs text-muted-foreground mt-1">Permanently delete your account and all metadata.</p>
        <Button variant="destructive" size="sm" className="mt-3">Delete Account</Button>
      </div>
    </SettingsSection>
  );
}

export function AppearanceSettings() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection
      title={t("appearance")}
      description="Customize how the application looks to you"
    >
      <div className="space-y-3.5">
        <Label>{t("theme")}</Label>
        <RadioGroup value={theme || "system"} onValueChange={(val) => setTheme(val)} className="grid grid-cols-3 gap-4">
          {THEME_OPTIONS.map((themeType) => (
            <label
              key={themeType}
              className={`flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary has-data-[state=checked]:border-primary cursor-pointer`}
            >
              <RadioGroupItem value={themeType} className="sr-only" />
              <span className="text-sm font-bold capitalize">{t(themeType)}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </SettingsSection>
  );
}

export function NotificationSettings() {
  const t = useTranslations("settings");

  return (
    <SettingsSection
      title={t("notifications")}
      description="Choose when and how you want to be notified"
    >
      <div className="space-y-4">
        {NOTIFICATION_KEYS.map((notifKey) => (
          <NotificationToggle
            key={notifKey}
            notificationKey={notifKey}
            label={t(notifKey)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}

export function PrivacySettings() {
  const t = useTranslations("settings");
  const [privacyValues, setPrivacyValues] = React.useState<Record<PrivacyKey, PrivacyValue>>({
    whoCanMessageMe: "everyone",
    whoCanCallMe: "everyone",
    lastSeen: "everyone",
    onlineStatus: "everyone",
  });

  const privacyOptions = [
    { value: "everyone" as PrivacyValue, label: t("everyone") },
    { value: "contacts" as PrivacyValue, label: t("contactsOnly") },
    { value: "nobody" as PrivacyValue, label: t("nobody") },
  ];

  return (
    <SettingsSection
      title={t("privacy")}
      description="Control who can access your status and details"
    >
      <div className="space-y-4">
        {PRIVACY_SETTINGS.map((priv) => (
          <SelectSetting
            key={priv.key}
            label={t(priv.key)}
            value={privacyValues[priv.key]}
            onValueChange={(val) => setPrivacyValues(prev => ({ ...prev, [priv.key]: val as PrivacyValue }))}
            options={privacyOptions}
          />
        ))}

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <Label htmlFor="readReceipts" className="font-bold cursor-pointer">{t("readReceipts")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Let others see when you have read their messages</p>
          </div>
          <Switch id="readReceipts" defaultChecked />
        </div>
      </div>
    </SettingsSection>
  );
}

export function SecuritySettings() {
  return (
    <SettingsSection
      title="Security"
      description="Manage password changes and active sessions"
    >
      <div className="border border-border/80 rounded-lg divide-y divide-border bg-card">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h4>
            <p className="text-xs text-muted-foreground">Protect your account with verification codes</p>
          </div>
          <Button size="sm" variant="outline">Enable</Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-foreground">Active Sessions</h4>
        <div className="border border-border/80 rounded-lg p-4 bg-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Laptop className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-semibold">Linux (Chrome) • Current Session</p>
              <p className="text-[10px] text-muted-foreground">Hanoi, Vietnam • 192.168.1.15</p>
            </div>
          </div>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
            <ShieldCheck className="h-3 w-3" />
            Active
          </span>
        </div>
      </div>
    </SettingsSection>
  );
}

export function LanguageSettings() {
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith("/vi") ? "vi" : "en";

  const languageOptions = [
    { value: "en", label: "🌐 English" },
    { value: "vi", label: "🇻🇳 Tiếng Việt" },
  ];

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale: locale });
    toast.success(t("saved"));
  };

  return (
    <SettingsSection
      title={t("language")}
      description="Choose your interface display language"
    >
      <div className="space-y-2.5">
        <SelectSetting
          label={t("language")}
          value={currentLocale}
          onValueChange={handleLanguageChange}
          options={languageOptions}
          placeholder="Select language"
        />
      </div>
    </SettingsSection>
  );
}

export function CallsSettings() {
  const t = useTranslations("settings");
  const [microphoneDevice, setMicrophoneDevice] = React.useState("default");
  const [cameraDevice, setCameraDevice] = React.useState("default");
  const [speakerDevice, setSpeakerDevice] = React.useState("default");
  const [micTestActive, setMicTestActive] = React.useState(false);
  const [cameraTestActive, setCameraTestActive] = React.useState(false);
  const [volumeLevel, setVolumeLevel] = React.useState(0);

  // Mic test volume bars animation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (micTestActive) {
      interval = setInterval(() => {
        setVolumeLevel(Math.floor(Math.random() * 8) + 1);
      }, 100);
    }
    return () => {
      clearInterval(interval);
      if (!micTestActive) {
        setVolumeLevel(0);
      }
    };
  }, [micTestActive]);

  return (
    <SettingsSection
      title={t("calls")}
      description="Select and configure audio & video devices"
    >
      <div className="space-y-4">
        {/* Microphone selection */}
        <div>
          <SelectSetting
            label={t("microphone")}
            value={microphoneDevice}
            onValueChange={setMicrophoneDevice}
            options={MICROPHONE_OPTIONS}
            placeholder="Select microphone"
          />

          <div className="flex items-center gap-3 py-1 mt-2">
            <Button size="sm" variant="outline" onClick={() => setMicTestActive(!micTestActive)}>
              {micTestActive ? "Stop testing" : t("testMicrophone")}
            </Button>

            {/* Mic volume bar visualizer */}
            <div className="flex-1 flex gap-1 h-3 items-center">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full w-2 rounded-full transition-colors duration-150 ${idx < volumeLevel ? "bg-emerald-500" : "bg-muted"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Camera selection */}
        <div>
          <SelectSetting
            label={t("camera")}
            value={cameraDevice}
            onValueChange={setCameraDevice}
            options={CAMERA_OPTIONS}
            placeholder="Select camera"
          />

          <div className="space-y-2 mt-2">
            <Button size="sm" variant="outline" onClick={() => setCameraTestActive(!cameraTestActive)}>
              {cameraTestActive ? "Close Camera Preview" : t("testCamera")}
            </Button>

            {cameraTestActive && (
              <div className="aspect-video w-full rounded-lg border bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
                  alt="Camera Test preview"
                  className="h-full w-full object-cover filter contrast-[1.05]"
                  fill
                />
                <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0">
                  Camera Test OK
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speaker selection */}
        <div>
          <SelectSetting
            label={t("speaker")}
            value={speakerDevice}
            onValueChange={setSpeakerDevice}
            options={SPEAKER_OPTIONS}
            placeholder="Select speaker"
          />

          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 mt-2"
            onClick={() => toast.success("Playing test chime...")}
          >
            <Volume2 className="h-4 w-4" />
            Test audio chimes
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}

