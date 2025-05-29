"use client"

import { useState, useEffect } from "react"
import { UserIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CheckedState = boolean | "indeterminate"

export function DiscordSettings() {
  const [userId, setUserId] = useState("")
  const [darkTheme, setDarkTheme] = useState(true)
  const [showAvatar, setShowAvatar] = useState(true)
  const [showAvatarDecoration, setShowAvatarDecoration] = useState(true)
  const [showBanner, setShowBanner] = useState(true)
  const [showNameplate, setShowNameplate] = useState(true)
  const [animateNameplate, setAnimateNameplate] = useState(true)
  const [showClanBadge, setShowClanBadge] = useState(true)
  const [showGlobalName, setShowGlobalName] = useState(false)
  const [copied, setCopied] = useState(false)
  const [avatarSize, setAvatarSize] = useState("128")
  const [bannerExtension, setBannerExtension] = useState("auto")
  const [isLoading, setIsLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const [widgetType, setWidgetType] = useState("standard")

  const isValidId = userId.trim().length >= 17 && /^\d+$/.test(userId.trim())
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    if (isValidId) {
      setIsLoading(true);
    }
  }, [userId, darkTheme, showAvatar, showBanner, showNameplate, animateNameplate, showClanBadge, showAvatarDecoration, showGlobalName, avatarSize, bannerExtension]);

  const standardWidgetUrl = isValidId
    ? `${baseUrl}/user?id=${encodeURIComponent(userId.trim())}` +
      `&theme=${darkTheme ? 'dark' : 'light'}` +
      `&avatar=${showAvatar ? 'true' : 'false'}` +
      `&banner=${showBanner ? 'true' : 'false'}` +
      `&nameplate=${showNameplate ? 'true' : 'false'}` +
      `&nameplate_animated=${animateNameplate ? 'true' : 'false'}` +
      `&clan=${showClanBadge ? 'true' : 'false'}` +
      `&decoration=${showAvatarDecoration ? 'true' : 'false'}` +
      `&global_name=${showGlobalName ? 'true' : 'false'}` +
      `&size=${avatarSize}` +
      `&ext=${bannerExtension}`
    : "";

  const compactWidgetUrl = isValidId
    ? `${baseUrl}/compact?id=${encodeURIComponent(userId.trim())}` +
      `&theme=${darkTheme ? 'dark' : 'light'}` +
      `&nameplate=${showNameplate ? 'true' : 'false'}` +
      `&nameplate_animated=${animateNameplate ? 'true' : 'false'}`
    : "";

  const widgetUrl = widgetType === "standard" ? standardWidgetUrl : compactWidgetUrl;

  const widgetWidth = widgetType === "standard" ? 288 : 289;
  const widgetHeight = widgetType === "standard"
    ? (showBanner ? 160 : (showGlobalName ? 80 : 64))
    : 48;

  const embedCode = isValidId
    ? `<iframe
  title="User Widget"
  width="${widgetWidth}"
  height="${widgetHeight}"
  frameborder="0"
  sandbox="allow-scripts"
  src="${widgetUrl}"
></iframe>` : "";

  const copyToClipboard = () => {
    if (embedCode) {
      setCopying(true);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(embedCode)
          .then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              setCopying(false);
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
            setCopying(false);
          });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = embedCode;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setCopying(false);
          }, 2000);
        } catch (err) {
          console.error('Fallback: Could not copy text: ', err);
          setCopying(false);
        }

        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Discord Settings</CardTitle>
        <CardDescription>
          Configure how your Discord profile widget will appear
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="user-id">Discord User ID</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-id"
                className="pl-9"
                placeholder="Enter your Discord User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This is your unique Discord identifier
            </p>
          </div>

          {widgetType === "standard" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dark-theme"
                    checked={darkTheme}
                    onCheckedChange={(checked: CheckedState) => setDarkTheme(checked === true)}
                  />
                  <Label
                    htmlFor="dark-theme"
                    className="cursor-pointer"
                  >
                    Dark Theme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-banner"
                    checked={showBanner}
                    onCheckedChange={(checked: CheckedState) => setShowBanner(checked === true)}
                  />
                  <Label
                    htmlFor="show-banner"
                    className="cursor-pointer"
                  >
                    Show Banner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-avatar"
                    checked={showAvatar}
                    onCheckedChange={(checked: CheckedState) => setShowAvatar(checked === true)}
                  />
                  <Label
                    htmlFor="show-avatar"
                    className="cursor-pointer"
                  >
                    Show Avatar
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-global-name"
                    checked={showGlobalName}
                    onCheckedChange={(checked: CheckedState) => setShowGlobalName(checked === true)}
                  />
                  <Label
                    htmlFor="show-global-name"
                    className="cursor-pointer"
                  >
                    Show Global Name
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-nameplate"
                    checked={showNameplate}
                    onCheckedChange={(checked: CheckedState) => setShowNameplate(checked === true)}
                  />
                  <Label
                    htmlFor="show-nameplate"
                    className="cursor-pointer"
                  >
                    Show Nameplate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-avatar-decoration"
                    checked={showAvatarDecoration}
                    onCheckedChange={(checked: CheckedState) => setShowAvatarDecoration(checked === true)}
                    disabled={!showAvatar}
                  />
                  <Label
                    htmlFor="show-avatar-decoration"
                    className={`cursor-pointer ${!showAvatar ? "opacity-50" : ""}`}
                  >
                    Avatar Decoration
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="animate-nameplate"
                    checked={animateNameplate}
                    onCheckedChange={(checked: CheckedState) => setAnimateNameplate(checked === true)}
                    disabled={!showNameplate}
                  />
                  <Label
                    htmlFor="animate-nameplate"
                    className={`cursor-pointer ${!showNameplate ? "opacity-50" : ""}`}
                  >
                    Animate Nameplate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-clan-badge"
                    checked={showClanBadge}
                    onCheckedChange={(checked: CheckedState) => setShowClanBadge(checked === true)}
                  />
                  <Label
                    htmlFor="show-clan-badge"
                    className="cursor-pointer"
                  >
                    Show Clan Badge
                  </Label>
                </div>
              </div>
            </div>
          )}
          {widgetType === "compact" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dark-theme-compact"
                    checked={darkTheme}
                    onCheckedChange={(checked: CheckedState) => setDarkTheme(checked === true)}
                  />
                  <Label
                    htmlFor="dark-theme-compact"
                    className="cursor-pointer"
                  >
                    Dark Theme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-nameplate-compact"
                    checked={showNameplate}
                    onCheckedChange={(checked: CheckedState) => setShowNameplate(checked === true)}
                  />
                  <Label
                    htmlFor="show-nameplate-compact"
                    className="cursor-pointer"
                  >
                    Show Nameplate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="animate-nameplate-compact"
                    checked={animateNameplate}
                    onCheckedChange={(checked: CheckedState) => setAnimateNameplate(checked === true)}
                    disabled={!showNameplate}
                  />
                  <Label
                    htmlFor="animate-nameplate-compact"
                    className={`cursor-pointer ${!showNameplate ? "opacity-50" : ""}`}
                  >
                    Animate Nameplate
                  </Label>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  The compact widget is a fixed-size (289x48) widget that shows the user profile, decorations, nameplate, username, and global name.
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-type">Widget Type</Label>
              <Select
                value={widgetType}
                onValueChange={setWidgetType}
              >
                <SelectTrigger id="widget-type" className="w-full">
                  <SelectValue placeholder="Select widget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {widgetType === "standard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar-size">Avatar Size</Label>
                  <Select
                    value={avatarSize}
                    onValueChange={setAvatarSize}
                    disabled={!showAvatar}
                  >
                    <SelectTrigger id="avatar-size" className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64">64px</SelectItem>
                      <SelectItem value="128">128px</SelectItem>
                      <SelectItem value="256">256px</SelectItem>
                      <SelectItem value="512">512px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner-extension">Banner Format</Label>
                  <Select
                    value={bannerExtension}
                    onValueChange={setBannerExtension}
                    disabled={!showBanner}
                  >
                    <SelectTrigger id="banner-extension" className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (detect animation)</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="gif">GIF (animated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {isValidId && (
            <div className="space-y-4 mt-6 pt-6 border-t border-border">
              <div>
                <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
                <div className="border border-border rounded-md overflow-hidden bg-muted flex justify-center p-4">
                  <div style={{ width: `${widgetWidth}px`, height: `${widgetHeight}px`, position: 'relative' }}>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Spinner size={16} className="text-primary" />
                      </div>
                    )}
                    <iframe
                      title="Discord user embed preview"
                      width={widgetWidth}
                      height={widgetHeight}
                      frameBorder="0"
                      sandbox="allow-scripts"
                      src={widgetUrl}
                      style={{ maxWidth: '100%', opacity: isLoading ? '0.5' : '1' }}
                      onLoad={() => setIsLoading(false)}
                    ></iframe>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Embed Code</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={copying}
                    className="flex items-center gap-1 relative overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    <div className={`flex items-center gap-1 transition-transform duration-300 ${copied ? 'transform -translate-y-full opacity-0' : ''}`}>
                      <CopyIcon className="h-4 w-4" />
                      <span>Copy</span>
                    </div>
                    <div className={`flex items-center gap-1 absolute inset-0 justify-center transition-transform duration-300 ${copied ? 'transform translate-y-0' : 'transform translate-y-full opacity-0'}`}>
                      <CheckIcon className="h-4 w-4" />
                      <span>Copied</span>
                    </div>
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap break-all">{embedCode}</pre>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can embed this widget on any website by copying and pasting this code.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
