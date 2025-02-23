# My XPath Recorder Chrome Extension

## Overview
My XPath Recorder is a Chrome extension that records user interactions on any website and captures element details such as XPath, ID, and input values. The recorded steps can be exported in JSON, CSV, and Robot Framework formats.

## Features
- Record user interactions on any website.
- Capture element attributes such as XPath, ID, and input values.
- Display recorded steps in a structured table.
- Export recorded data in JSON, CSV, and Robot Framework formats.

## Installation
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer Mode" (toggle in the top right corner).
4. Click "Load unpacked" and select the project folder.
5. The extension should now be available in your Chrome toolbar.

## Usage
1. Click on the extension icon to open the popup.
2. Press the **Start Recording** button and interact with the website.
3. Click **Stop Recording** to end the session.
4. Review recorded steps in the popup interface.
5. Export recorded data using the available format buttons.

## File Structure
```
├── manifest.json         # Chrome Extension configuration
├── popup.html           # UI for the extension
├── popup.js             # Logic for the popup
├── content.js           # Handles event recording
├── export_json.js       # Exports recorded steps as JSON
├── export_csv.js        # Exports recorded steps as CSV
├── export_robot.js      # Converts steps into Robot Framework format
├── README.md            # Documentation
```

## License
This project is licensed under the MIT License. Feel free to modify and distribute it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.

## Contact
For any questions or feedback, reach out via GitHub issues.
