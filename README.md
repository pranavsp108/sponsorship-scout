# Sponsorship Scout

**Sponsorship Scout** is a Chrome Extension that automatically scans job descriptions for visa sponsorship and citizenship requirements. It provides an immediate visual indicator and highlights relevant terms to help international applicants navigate job boards more efficiently.

## Core Features

* **Automated Scanning:** Detects phrases related to visa support, citizenship, and work authorization.
* **Sticky Indicator:** A pulsing status dot in the top-right corner alerts users to restrictive terms without requiring them to scroll.
* **Dynamic Content Support:** Uses `MutationObserver` to process content on Single Page Applications like LinkedIn and Workday.
* **Privacy-Focused:** Performs all scanning locally within the browser.

## Technical Implementation

The extension utilizes a proximity-based Regular Expression to identify restrictive language even when terms are non-contiguous. 

```javascript
// Logic for identifying negation near core terms
const regex = /\b(no|not|unable)\s*(?:\w+\s*){0,3}(sponsorship|visa|citizen)/gi;

## Installation

1. Clone this repository.
2. Navigate to `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project directory.

## Project Structure

* `manifest.json`: Extension configuration (Manifest V3).
* `content.js`: Main logic for DOM traversal and term detection.
* `styles.css`: UI styling for highlights and the status indicator.

## License

This project is licensed under the MIT License.