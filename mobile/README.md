# QMuraajah for Android and iOS

This folder holds the phone apps. They are a [Capacitor](https://capacitorjs.com) shell: a native app with its own icon and splash screen that opens the live site, https://dawr.hifzapp.link, full screen.

The screens come from the server, so **every `deploy/push.sh` updates the apps too**. You only build and resubmit an app to change something native: the icon, the splash, the name, or a Capacitor upgrade.

| Path | What it is |
|---|---|
| `capacitor.config.json` | App id `link.hifzapp.qmuraajah`, name, the site it opens, splash and system-bar settings |
| `www/offline.html` | Shown when the phone has no connection, with a Try again button |
| `assets/` | Source icon and splash PNGs, and `draw-icons.mjs`, which draws them |
| `android/` | Android Studio project |
| `ios/` | Xcode project (needs a Mac to build) |

## What you need

| | Android (Google Play) | iOS (App Store) |
|---|---|---|
| Account | [Google Play Console](https://play.google.com/console), $25 once | [Apple Developer Program](https://developer.apple.com/programs/), $99 a year |
| Computer | This PC, with [Android Studio](https://developer.android.com/studio) | A Mac with Xcode, or a cloud build service such as Ionic Appflow or Codemagic |
| Review | Usually a few days | Usually 1 to 3 days |

## Everyday commands

Run these from this folder:

```bash
npm install
```

```bash
npx cap sync
```

`npx cap sync` copies the config and the offline page into both native projects. Run it after changing anything in this folder.

```bash
npx cap open android
```

That opens the Android project in Android Studio.

## Build a test app on this PC

Java 21 and the Android SDK are installed in your user folder (`%LOCALAPPDATA%\Programs\jdk-21.0.13+9` and `%LOCALAPPDATA%\Android\Sdk`), so this works without Android Studio. In Git Bash, from `mobile/android`:

```bash
JAVA_HOME="$LOCALAPPDATA/Programs/jdk-21.0.13+9" ./gradlew.bat assembleDebug
```

The app lands in `android/app/build/outputs/apk/debug/app-debug.apk`. To try it, copy it to an Android phone and open it. The phone will ask you to allow installs from that source. A debug build is for testing only; the stores need the signed release build below.

## Release on Google Play

1. Install Android Studio and open the project with `npx cap open android`. Let it finish the Gradle sync.
2. Try it: pick a phone or emulator at the top and press Run.
3. Make a signing key once: **Build > Generate Signed App Bundle or APK > Android App Bundle > Create new**. Keep the `.jks` file and its passwords safe and backed up, and never commit them. Losing the key means you cannot update the app.
4. Build the release: the same menu, choose your key, pick **release**. It writes `android/app/release/app-release.aab`.
5. In Play Console, create the app named QMuraajah and fill in the store listing:
   - **Privacy policy:** https://dawr.hifzapp.link/privacy
   - **Account deletion:** in the app under Settings, Danger zone. Google also asks for a web link; https://dawr.hifzapp.link/settings works once signed in.
   - **Data safety:** the app collects an email address, and revision logs tied to the account. Nothing is shared or used for ads.
   - **Screenshots:** take them from the running app, at least 2 phone screenshots.
6. Upload the `.aab` to a testing track. **New personal developer accounts must run a closed test with at least 12 testers for 14 days** before Google allows a production release. Organisation accounts skip that step.
7. Promote to Production when ready.

For each update, raise `versionCode` (and `versionName`) in `android/app/build.gradle`, then build and upload again.

## Release on the App Store

1. On a Mac: install Xcode, copy this repository over, run `npm install` and `npx cap sync` here, then `npx cap open ios`.
2. In Xcode, select the App target, open **Signing & Capabilities** and choose your team. The bundle id is `link.hifzapp.qmuraajah`.
3. Pick **Any iOS Device**, then **Product > Archive**, then **Distribute App > App Store Connect**.
4. In [App Store Connect](https://appstoreconnect.apple.com), create the app, add screenshots (6.7" and 6.5" iPhone), the privacy policy URL, and the privacy answers (email address and app activity, linked to the user, not used for tracking).
5. Test with TestFlight, then submit for review.

**Review risk:** Apple's guideline 4.2 rejects apps that are "just a website". QMuraajah helps here: it has a real use, accounts, a native icon and splash, and an offline screen. If Apple still rejects it, the usual fix is a native feature, such as a daily reminder notification. That is a good next step anyway.

## Changing the icon or splash

Edit and run `assets/draw-icons.mjs` (instructions at the top of the file), then:

```bash
npm run assets
```

```bash
npx cap sync
```

## Notes

- Sign-in works as on the website. Links in emails (confirm your address, reset code) open in the phone's browser. After confirming, sign in inside the app.
- Links to other websites open in the phone's browser, not inside the app.
- The app adds `QMuraajahApp/1.0` to its browser user agent, so the server can tell app visits apart if that is ever needed.
