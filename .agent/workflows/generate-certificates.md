---
description: How to use the CertFlow plugin to generate certificates
---

# CertFlow Certificate Generation Workflow

## Prerequisites

- Figma Desktop App installed
- CertFlow plugin imported (see QUICKSTART.md)
- Certificate template designed in Figma
- CSV data file or Google Sheets URL ready

## Step-by-Step Workflow

### 1. Design Your Certificate Template

- Create a Frame in Figma (recommended size: 1920x1080 or 1200x900)
- Add design elements (background, borders, logos)
- Add text layers with placeholders like `{{name}}`, `{{course}}`, `{{date}}`
- Save as a Component for reusability (optional but recommended)

### 2. Prepare Your Data

**CSV Format:**

```csv
Full Name,Email Address,Course Name,Completion Date
John Doe,john@example.com,Web Development,January 15 2024
```

**Google Sheets:**

- Share sheet with "Anyone with link can view"
- Use export URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv`

### 3. Open the Plugin

// turbo

- In Figma: Menu → Plugins → Development → CertFlow

### 4. Configure Data Source

- Select "CSV File" and upload your file, OR
- Select "URL/Link" and paste your Google Sheets URL

### 5. Select Template

- Click your certificate frame/component in Figma
- Click "Select Template Layer" in the plugin UI
- Verify the template name appears

### 6. Map Fields

Enter field mappings (one per line):

```
name: Full Name
email: Email Address
course: Course Name
date: Completion Date
```

### 7. Generate Certificates

// turbo

- Click "✨ Generate Certificates"
- Wait for progress to complete
- All certificates will be created and selected

### 8. Export Certificates

- With certificates selected: Right-click → Export
- Choose format (PNG, PDF, JPG)
- Set scale (2x recommended for high quality)
- Export all

## Tips for Best Results

1. **Test First**: Generate 2-3 certificates before running the full batch
2. **Use Components**: Make your template a Component for consistency
3. **Organize Layers**: Name your layers clearly
4. **Check Data**: Verify CSV has no empty rows or columns
5. **Font Loading**: Ensure all fonts are available in Figma

## Common Issues

**Template not selecting:**

- Ensure you're selecting a Frame, Component, or Instance
- Don't select individual text layers

**Text not replacing:**

- Check placeholder format: `{{name}}` not `{name}` or `{{ name }}`
- Verify field mapping matches CSV column names exactly

**Performance:**

- For 100+ certificates, expect 1-2 minutes processing time
- Close other Figma files to improve performance

## Advanced Usage

### Multiple Templates

- Create different templates for different certificate types
- Run the plugin separately for each template

### Grid Layout

- Certificates are automatically arranged in a grid
- Grid dimensions are calculated as √n × √n (rounded up)
- For example: 9 certificates = 3×3 grid, 10 certificates = 4×4 grid
- Spacing is 100px between each certificate

### Batch Export

- Select all generated certificates
- Use Figma's bulk export feature
- Consider using a naming convention in your CSV

---

For detailed documentation, see README.md
For quick setup instructions, see QUICKSTART.md
