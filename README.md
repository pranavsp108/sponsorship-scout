🚀 Sponsorship Scout
Sponsorship Scout is a lightweight Chrome Extension designed to help international students and work-visa seekers navigate job boards more efficiently. It automatically scans job descriptions for sponsorship-related terms and provides an instant visual "Early Warning System" so you don't waste time on roles that don't support your visa status.

💡 The Problem
Most job descriptions hide sponsorship information (or the lack thereof) at the very bottom of long text blocks. International students often spend 5–10 minutes reading a description and researching a company only to find a "Must be a U.S. Citizen" or "No Sponsorship" clause at the end.

✨ Key Features
Smart Highlighting: Uses fuzzy-match logic to find phrases like "No sponsorship provided" or "Does not offer visa support" even if the words are rearranged.

Early Warning Indicator: A pulsing red dot appears in the top-right corner of your browser the moment a restrictive term is detected—saving you from even needing to scroll down.

Dynamic Loading Support: Built using MutationObserver to ensure it works on modern "Single Page Applications" (SPAs) like LinkedIn, Workday, and Indeed that load content as you scroll.

Privacy First: This extension runs entirely locally in your browser. No data is sent to any external servers.

🛠️ Technical Deep Dive
The "Smart Regex" Logic
Rather than looking for exact strings, the extension uses a proximity-based Regular Expression. This allows it to catch variations like:

"No visa sponsorship"

"Sponsorship is not available"

"Does not provide sponsorship"

// Example of the proximity logic used
const regex = /\b(no|not|unable)\s*(?:\w+\s*){0,3}(sponsorship|visa|citizen)/gi;


The Performance Layer
To prevent the browser from slowing down on long pages, the extension uses a recursive tree-walking algorithm that only targets text nodes, ensuring a smooth browsing experience.


📦 Installation (Developer Mode)
Since this project is currently in development and not yet on the Chrome Web Store, you can install it manually:

Download/Clone this repository to your local machine.

Open Google Chrome and navigate to chrome://extensions/.

Toggle "Developer mode" in the top right corner.

Click "Load unpacked".

Select the folder containing the extension files.

Navigate to any job site (e.g., LinkedIn or Workday) to see it in action!

📂 Project Structure
manifest.json: Configuration and permissions (Manifest V3).

content.js: The core logic for DOM scanning and text manipulation.

styles.css: Custom UI for the highlights and the pulsing status indicator.

icons/: Branding assets for the extension.

🤝 Contributing
Suggestions and contributions are welcome! If you find a term that the extension missed, feel free to open an Issue or submit a Pull Request with the updated keyword list.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.