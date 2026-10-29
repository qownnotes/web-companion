# Store publishing

Every push to the `release` branch runs `.github/workflows/build-release.yml`, which:

1. creates a GitHub release with the text of the `## <version>` section from `CHANGELOG.md`
2. builds the Chrome and Firefox packages with `./build.sh` and attaches them to the release
3. uploads the Chrome package to the [Chrome Web Store](https://chrome.google.com/webstore/detail/qownnotes-web-companion/pkgkfnampapjbopomdpnkckbjdnpkbkp) and submits it for review (job `publish-chrome`)
4. uploads the Firefox package to [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/qownnotes-web-companion) and submits it for review (job `publish-firefox`)

Both stores still review the new version before it goes live. They send an email when the review is done.

## Doing a release

1. Bump `version` in `package.json` (for example `2026.10.0`).
   Both stores reject a version they already have.
2. Rename `## Unreleased` in `CHANGELOG.md` to `## <version>`.
   The release text and the Firefox release notes come from that section.
3. Push to the `release` branch.
4. Check the jobs **🌐 Publish to Chrome Web Store** and **🦊 Publish to Firefox Add-ons** in the Actions run.
   If one store job fails, you can re-run just that job.

## Required GitHub secrets

| Secret                 | Store   | Where it comes from                            |
| ---------------------- | ------- | ---------------------------------------------- |
| `AMO_JWT_ISSUER`       | Firefox | AMO API key page: "JWT issuer"                 |
| `AMO_JWT_SECRET`       | Firefox | AMO API key page: "JWT secret"                 |
| `CHROME_CLIENT_ID`     | Chrome  | Google Cloud OAuth client (Desktop app)        |
| `CHROME_CLIENT_SECRET` | Chrome  | Google Cloud OAuth client (Desktop app)        |
| `CHROME_REFRESH_TOKEN` | Chrome  | `npx chrome-webstore-upload-keys`              |
| `CHROME_PUBLISHER_ID`  | Chrome  | Chrome Web Store Developer Dashboard → Account |

If a store's secrets are missing, its job prints a warning and skips the upload instead of failing.
The Chrome extension ID `pkgkfnampapjbopomdpnkckbjdnpkbkp` isn't secret and is set in the workflow file.
The Firefox add-on ID `WebCompanion@qownnotes.org` comes from `src-bex/manifest.firefox.json`.

Set a secret with the GitHub CLI (it asks for the value):

```bash
gh secret set AMO_JWT_ISSUER
```

## Setting up Firefox Add-ons

1. Sign in at <https://addons.mozilla.org/developers/addon/api/key/> with the account that owns the add-on.
2. Generate new credentials.
3. Store them:

   ```bash
   gh secret set AMO_JWT_ISSUER   # "JWT issuer", e.g. user:12345:678
   gh secret set AMO_JWT_SECRET   # "JWT secret"
   ```

The workflow uses `web-ext sign --channel=listed` and also uploads:

- the source code of the released commit (`git archive`), which Mozilla's reviewers require
- the release notes from `CHANGELOG.md`
- a note for the reviewers with the build instructions (`npm install && ./build.sh`)

## Setting up the Chrome Web Store

The Google account that owns the extension needs 2-step verification enabled.

All of this happens in the Google Cloud project `qownnotes-web-companion` (organization `bekerle.com`).
Google changes these screens often, so names may differ slightly.

### 1. Enable the Chrome Web Store API

Open <https://console.cloud.google.com/apis/library/chromewebstore.googleapis.com?project=qownnotes-web-companion> and click **Enable**.

### 2. Check the OAuth consent screen

Open **Google Auth Platform** (<https://console.cloud.google.com/auth/overview?project=qownnotes-web-companion>).

- If there's a **Get started** button, click it and enter an app name (for example `QOwnNotes CI`) and your email.
- Under **Audience** it must show:
  - **Publishing status: In production.**
    If it says "Testing", click **Publish app**. In testing mode the refresh token expires after 7 days.
  - **User type: External.**
    This allows any Google account to sign in, including the one that owns the store listing.
    You can ignore warnings about app verification, because only you will sign in.

### 3. Create an OAuth client

Open **Clients** (<https://console.cloud.google.com/auth/clients?project=qownnotes-web-companion>):

1. Click **Create client**.
2. **Application type: Desktop app**.
   Don't choose "Chrome Extension": that type is for extensions that sign their users in to Google.
   Here the client is used by the upload tool acting for you, the publisher.
3. **Name**: anything, for example `Chrome Webstore Upload (GitHub CI)`.
4. Click **Create** and copy the **Client ID** and **Client secret**.
   The secret is also shown when you open the client and click the **Info** button (top right).

### 4. Get a refresh token

Run this once on your own computer:

```bash
npx chrome-webstore-upload-keys
```

1. Paste the client ID and client secret.
2. Sign in, in the browser window that opens, with the Google account that **owns the extension in the Chrome Web Store**.
3. If Google says "Google hasn't verified this app", click **Advanced** → **Go to … (unsafe)**.
   That's expected for your own unverified app.
4. The tool prints the refresh token.

This step needs a person to sign in and click "Allow", so it can't run in CI.
The refresh token then lets CI get new access tokens on its own.

### 5. Get the publisher ID

Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and copy the **Publisher ID** from **Account**.
It also appears in the address bar after `/devconsole/`.

This is the ID of the developer account, not of the extension.

### 6. Store the secrets

```bash
gh secret set CHROME_CLIENT_ID
gh secret set CHROME_CLIENT_SECRET
gh secret set CHROME_REFRESH_TOKEN
gh secret set CHROME_PUBLISHER_ID
```

### 7. Test the credentials (optional)

This only reads the extension's store status and doesn't upload anything.

In bash:

```bash
read -rp "Client ID: " CLIENT_ID; read -rsp "Client secret: " CLIENT_SECRET; echo
read -rsp "Refresh token: " REFRESH_TOKEN; echo; read -rp "Publisher ID: " PUBLISHER_ID

TOKEN=$(curl -s https://oauth2.googleapis.com/token \
  -d client_id="$CLIENT_ID" -d client_secret="$CLIENT_SECRET" \
  -d refresh_token="$REFRESH_TOKEN" -d grant_type=refresh_token | jq -r .access_token)

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://chromewebstore.googleapis.com/v2/publishers/$PUBLISHER_ID/items/pkgkfnampapjbopomdpnkckbjdnpkbkp:fetchStatus" | jq
```

In fish:

```fish
read -P "Client ID: " CLIENT_ID
read -s -P "Client secret: " CLIENT_SECRET
read -s -P "Refresh token: " REFRESH_TOKEN
read -P "Publisher ID: " PUBLISHER_ID

set TOKEN (curl -s https://oauth2.googleapis.com/token \
  -d client_id="$CLIENT_ID" -d client_secret="$CLIENT_SECRET" \
  -d refresh_token="$REFRESH_TOKEN" -d grant_type=refresh_token | jq -r .access_token)

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://chromewebstore.googleapis.com/v2/publishers/$PUBLISHER_ID/items/pkgkfnampapjbopomdpnkckbjdnpkbkp:fetchStatus" | jq
```

- **The store status is returned** (with `"itemId": "pkgkfnampapjbopomdpnkckbjdnpkbkp"`): everything works.
- **`TOKEN` is `null`**: the client ID, client secret or refresh token is wrong.
- **403 or 404**: the publisher ID is wrong, or you signed in with an account that doesn't own the extension.

## Troubleshooting

- **Chrome upload fails with an authentication error**:
  the refresh token was probably revoked or expired.
  Google expires refresh tokens that go unused for 6 months, so this can happen after a long time without releases.
  Repeat steps 4 and 6 of the Chrome setup.
- **Version already exists**: bump `version` in `package.json`.
- **Chrome refuses to publish after a visibility change**:
  if the extension's visibility was changed in the Developer Dashboard, publish once manually there before the API works again.
- **Empty release notes**: `CHANGELOG.md` has no `## <version>` heading matching `package.json`.

## Background

- Chrome uses [`chrome-webstore-upload-cli`](https://github.com/fregante/chrome-webstore-upload-cli) v4,
  which talks to the [Chrome Web Store API v2](https://developer.chrome.com/docs/webstore/api).
  The old API v1.1 stopped working on 15 October 2026.
- Firefox uses [`web-ext sign`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign).
- Automatic Chrome publishing was tried in 2020/2021 with the `trmcnvn/chrome-addon` action,
  but disabled in June 2021 because of "error 400" responses.
  The OAuth client from back then was replaced in October 2026.
