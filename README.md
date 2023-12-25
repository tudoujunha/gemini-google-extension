# Gemini for Google

A browser extension to display Gemini (Google's AI model, currently free) response alongside Google and other search engines results.

Before running this browser extension, you need to obtain the API key from Google. **API key is currently free.** 

You can register the API key at https://makersuite.google.com/app/apikey.

## Supported Search Engines

Google, Baidu, Bing, DuckDuckGo, Brave, Yahoo, Naver, Yandex, Kagi, Searx

## Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## Installation

### Install from Chrome Web Store

Chrome is reviewing, please wait. You can try installing the extension locally first.

### Local Install

1. Download `chromium.zip` from [Releases](https://github.com/tudoujunha/gemini-google-extension/releases).
2. Unzip the file.
3. In Chrome/Edge go to the extensions page (`chrome://extensions` or `edge://extensions`).
4. Enable Developer Mode.
5. Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterwards).

## Features

- Supports all popular search engines
- Supports Gemini Pro
- Supports the official OpenAI API
- Markdown rendering
- Code highlights
- Dark mode
- Provide feedback to improve Gemini
- Copy to clipboard
- Custom trigger mode
- Switch languages

## Troubleshooting

### How to make it work in Brave

![Screenshot](screenshots/brave.png?raw=true)

Disable "Prevent sites from fingerprinting me based on my language preferences" in `brave://settings/shields`

## Build from source

1. Clone the repo
2. Install dependencies with `npm`
3. `npm run build`
4. Load `build/chromium/` or `build/firefox/` directory to your browser

## Credit

This project is inspired by and based on the following open-source project:

- [chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension) - For the foundational codebase and features.

## License

[GPL-3.0 license](LICENSE)