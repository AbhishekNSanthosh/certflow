# 🎓 CertFlow - Smart Certificate Generator

**CertFlow** is a powerful Figma plugin that automates the creation of certificates. It takes your design template and fills it with data from CSV or Excel files, arranging the results in a smart, responsive grid.

![Grid Layout Example](https://via.placeholder.com/800x400?text=CertFlow+Smart+Grid+Layout)

## ✨ Key Features

- **📊 Excel & CSV Support**: Native support for `.xlsx`, `.xls`, and `.csv`. No manual conversion needed.
- **🧠 Smart Grid Layout**: Automatically calculates the perfect grid arrangement (rows/cols) based on your certificate's aspect ratio (Portrait vs Landscape).
- **🎨 Template Preservation**: Your original design stays untouched at the top. Generated certificates appear neatly below.
- **🔗 Google Sheets Integration**: Directly load data from public Google Sheets export URLs.
- **⚡ Auto-Mapping**: Intelligently matches CSV headers (e.g., "Full Name") to your text layers (e.g., `{{name}}`).

---

## 🚀 Getting Started

### 1. Installation

1.  **Clone** this repository.
2.  Run `npm install` to load dependencies.
3.  Run `npm run build` to compile the TypeScript.
4.  Open **Figma Desktop App**.
5.  Go to **Plugins > Development > Import plugin from manifest...**
6.  Select the `manifest.json` file in this folder.

### 2. Design Your Template

Create your certificate in Figma using a **Frame**. Add text layers with placeholders in double curly braces:

- `{{name}}`
- `{{date}}`
- `{{course}}`
- `{{id}}`

> **Tip:** Use a Frame, Component, or Instance. Do not use a Group.

### 3. Prepare Your Data

Create an Excel or CSV file. The first row must contain headers that match your placeholders (fuzzy matching is supported).

| Full Name     | Course Title    | Date       |
| :------------ | :-------------- | :--------- |
| Alice Johnson | UX Design Basic | 2024-01-15 |
| Bob Smith     | Figma Mastery   | 2024-01-16 |

### 4. Running the Plugin

1.  Select your certificate frame in Figma.
2.  Run **CertFlow**.
3.  Upload your `.xlsx` or `.csv` file.
4.  Verify the field mappings.
5.  Click **Generate Certificates**.

---

## 📐 Smart Grid Layout

CertFlow doesn't just stack certificates; it organizes them.

- **Logic**: `columns = ⌈√(total * aspect_ratio)⌉`
- **Portrait**: Generates a taller grid (fewer columns).
- **Landscape**: Generates a wider grid (more columns).
- **Spacing**:
  - Horizontal: **10%** of certificate width (min 100px).
  - Vertical: **10%** of certificate height (min 100px).
  - Top Gap: Lefts a clean separate space below your original template.

---

## 🔧 Troubleshooting

### Common Issues

| Issue                  | Solution                                                                                                       |
| :--------------------- | :------------------------------------------------------------------------------------------------------------- |
| **"No data found"**    | Ensure your file has headers in Row 1 and isn't empty.                                                         |
| **Text not replacing** | Check for typos in `{{placeholders}}`. Ensure text layers aren't locked.                                       |
| **Plugin won't load**  | Run `npm run build`. Check if `manifest.json` is selected correctly.                                           |
| **Wrong Grid Spacing** | The plugin auto-calculates this based on your frame size. Ensure your frame size is standard (e.g. 1920x1080). |

### Excel Files

- **Supported**: `.xlsx`, `.xls`.
- **Note**: The plugin reads the **first sheet** only. Ensure your data is on Sheet 1.
- **Formulas**: Values are extracted, but complex formatting might be lost. Keep data simple.

---

## 📦 For Developers

### Building

```bash
npm run build       # One-time build
npm run watch       # Development mode (auto-rebuild)
```

### Publishing to Community

1.  **Prepare Assets**:
    - **Icon**: 128x128 px PNG.
    - **Cover Art**: 1920x960 px PNG (safe zone center 1600x960).
2.  **Verify Manifest**: Ensure `manifest.json` has the correct ID and a descriptive name.
3.  **Build**: Run `npm run build`.
4.  **Submit**:
    - In Figma Desktop: **Plugins > Development > CertFlow > Publish**.
    - Fill in details:
      - **Name**: CertFlow - Smart Certificate Generator
      - **Category**: Design tools
      - **Tags**: `certificate`, `generator`, `automation`, `csv`, `bulk`
5.  **Review**: Wait for Figma approval (1-5 days).

---

_Built with ❤️ for the Figma Community._
