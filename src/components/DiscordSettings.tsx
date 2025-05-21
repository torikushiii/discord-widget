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
  const [copied, setCopied] = useState(false)
  const [avatarSize, setAvatarSize] = useState("128")
  const [bannerExtension, setBannerExtension] = useState("auto")
  const [isLoading, setIsLoading] = useState(false)

  const isValidId = userId.trim().length >= 17 && /^\d+$/.test(userId.trim())
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    if (isValidId) {
      setIsLoading(true);
    }
  }, [userId, darkTheme, showAvatar, showBanner, showNameplate, animateNameplate, showClanBadge, showAvatarDecoration, avatarSize, bannerExtension]);

  const widgetUrl = isValidId
    ? `${baseUrl}/user?id=${encodeURIComponent(userId.trim())}` +
      `&theme=${darkTheme ? 'dark' : 'light'}` +
      `&avatar=${showAvatar ? 'true' : 'false'}` +
      `&banner=${showBanner ? 'true' : 'false'}` +
      `&nameplate=${showNameplate ? 'true' : 'false'}` +
      `&nameplate_animated=${animateNameplate ? 'true' : 'false'}` +
      `&clan=${showClanBadge ? 'true' : 'false'}` +
      `&decoration=${showAvatarDecoration ? 'true' : 'false'}` +
      `&size=${avatarSize}` +
      `&ext=${bannerExtension}`
    : "";

  const widgetWidth = 288;
  const widgetHeight = showBanner ? 160 : 64;

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
      if (navigator.clipboard) {
        navigator.clipboard.writeText(embedCode)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
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
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback: Could not copy text: ', err);
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

          <div className="grid grid-cols-2 gap-y-4">
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
              />
              <Label
                htmlFor="show-avatar-decoration"
                className="cursor-pointer"
              >
                Avatar Decoration
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="animate-nameplate"
                checked={animateNameplate}
                disabled={!showNameplate}
                onCheckedChange={(checked: CheckedState) => setAnimateNameplate(checked === true)}
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

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="avatar-size">Avatar Size</Label>
              <Select value={avatarSize} onValueChange={setAvatarSize}>
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
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
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
