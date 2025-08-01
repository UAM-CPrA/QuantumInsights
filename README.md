# QuantumInsights 🚀

A comprehensive platform for quantum computing education and research, featuring interactive concepts, research papers, and an advanced article generator.

## 📚 Table of Contents

- [Overview](#overview)
- [Publishing Articles](#publishing-articles)
- [Creating Custom Fields](#creating-custom-fields)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QuantumInsights is an educational platform that provides:
- **Quantum Computing Concepts**: Interactive tutorials and explanations
- **Research & Code**: Academic papers with implementations
- **Article Generator**: Advanced tool for creating structured quantum computing content

## 📝 Publishing Articles

### Step 1: Generate Your Article

1. Navigate to the article generator:
   ```
   Open: _article-generator/article-generator.html
   ```

2. Follow the guided process:
   - **Select Template**: Choose between "Concepts" or "Research" template
   - **Fill Basic Information**: 
     - Document title
     - Description
     - Level (Beginner/Intermediate/Advanced)
     - Reading time
     - Custom path (e.g., `concepts/algorithms/grover-algorithm.html`)
   - **Add Sections**: Select and customize sections like:
     - Introduction
     - Mathematical Foundation
     - Implementation Examples
     - Interactive Demos
     - Video Explanations
     - Applications
     - References
   - **Edit Content**: Click "Edit" on each section to add your content
   - **Generate Preview**: Review the final HTML output

3. **Download** the generated HTML file

### Step 2: Place Files Correctly

1. **HTML File**: Place your generated HTML file in the path you specified during creation:
   ```
   For concepts: concepts/[category]/your-article.html
   For research: research/[category]/your-article.html
   ```

2. **Update Navigation**: 
   - Add your article to the appropriate index page (`concepts.html` or `research.html`)
   - Update the `meta.json` files in the relevant directories

3. **Assets**: If you have additional assets (images, data files), place them in appropriate folders:
   ```
   _img/           # For images
   assets/         # For other files
   ```

### Step 3: Submit for Review

1. **Create a Pull Request**:
   ```bash
   git add .
   git commit -m "Add new article: [Your Article Title]"
   git push origin feature/your-article-name
   ```

2. **Pull Request Details**:
   - Title: `Add [Article Type]: [Article Title]`
   - Description: Brief summary of the content and target audience
   - Include screenshots if applicable

3. **Review Process**:
   - Our team will review your content for:
     - Technical accuracy
     - Educational value
     - Code quality (if applicable)
     - Formatting and consistency
   - We may suggest improvements or request changes
   - Once approved, your article will be merged into the main branch

### 📋 Article Guidelines

- **Quality**: Ensure content is accurate and well-researched
- **Code**: All code examples should be tested and functional
- **References**: Include proper citations and references
- **Accessibility**: Use clear language and explain complex concepts
- **Consistency**: Follow the established style and structure

---

## 🛠️ Creating Custom Fields

Want to add a new section type to the article generator? Follow this step-by-step guide:

### Step 1: Add Section to Available Sections

1. **Open**: `_article-generator/article-generator.js`

2. **Locate**: The `populateAvailableSections()` method (around line 60)

3. **Add your section** to the appropriate array (`conceptSections` or `researchSections`):
   ```javascript
   { 
     id: 'your-custom-field', 
     name: 'Your Custom Field Name', 
     icon: '🔧', 
     description: 'Description of what this field does' 
   }
   ```

### Step 2: Create Field Generation Method

1. **Add a new method** in the `generateSectionSpecificFields` switch statement (around line 344):
   ```javascript
   case 'your-custom-field':
       return this.generateYourCustomFieldFields(existingContent);
   ```

2. **Create the field generation method**:
   ```javascript
   generateYourCustomFieldFields(content) {
       return `
           <div class="content-editor">
               <label for="customFieldInput">Your Field Label</label>
               <input type="text" id="customFieldInput" placeholder="Enter your content..." value="${content.customFieldInput || ''}">
           </div>
           <div class="content-editor">
               <label for="customFieldTextarea">Additional Content</label>
               <textarea id="customFieldTextarea" rows="4" placeholder="More details...">${content.customFieldTextarea || ''}</textarea>
           </div>
       `;
   }
   ```

### Step 3: Add Data Collection Logic

1. **In the `collectSectionSpecificData` method** (around line 685), add your case:
   ```javascript
   case 'your-custom-field':
       sectionContent.customFieldInput = document.getElementById('customFieldInput')?.value || '';
       sectionContent.customFieldTextarea = document.getElementById('customFieldTextarea')?.value || '';
       break;
   ```

### Step 4: Create HTML Generation Method

1. **Add to the section generation switch statement** in both `generateConceptSection` and `generateResearchSection`:
   ```javascript
   case 'your-custom-field':
       html += this.generateYourCustomFieldSectionHTML(content);
       break;
   ```

2. **Create the HTML generation method**:
   ```javascript
   generateYourCustomFieldSectionHTML(content) {
       let html = '';
       
       if (content.customFieldInput) {
           html += `<div class="custom-field-content">
               <h4>${content.customFieldInput}</h4>
           </div>`;
       }
       
       if (content.customFieldTextarea) {
           html += `<div class="custom-field-details">
               ${this.formatTextContent(content.customFieldTextarea)}
           </div>`;
       }
       
       return html;
   }
   ```

### Step 5: Add CSS Styling (Optional)

1. **Create styles** for your custom field in the appropriate CSS files:
   ```css
   .custom-field-content {
       background: var(--accent-light);
       padding: 1rem;
       border-radius: 8px;
       margin: 1rem 0;
   }
   
   .custom-field-details {
       font-style: italic;
       color: var(--text-secondary);
   }
   ```

### Step 6: Test Your Custom Field

1. **Open** `article-generator.html`
2. **Create a new article** and verify your custom field appears in the section list
3. **Test the editing interface** to ensure data is saved correctly
4. **Generate preview** and check the HTML output

### 🔧 Advanced Customizations

#### Dynamic Content (like Concepts Grid)

For fields with dynamic content (add/remove items):

1. **Initialize arrays** in your field generation method
2. **Create management functions** (add, remove, update)
3. **Add refresh methods** to update the UI dynamically

Example structure:
```javascript
// In generateYourCustomFieldFields:
this.currentCustomItems = content.customItems || [{ title: '', description: '' }];

// Add management methods:
addCustomItem() { /* implementation */ }
removeCustomItem(index) { /* implementation */ }
updateCustomItem(index, field, value) { /* implementation */ }
refreshCustomItemsList() { /* implementation */ }
```

#### Complex Field Types

For complex fields (file uploads, interactive elements):

1. **Add event listeners** in the field generation
2. **Handle file processing** or data validation
3. **Create specialized HTML output** with interactive elements

### 📝 Field Development Best Practices

- **Consistent Naming**: Use clear, descriptive names for IDs and methods
- **Error Handling**: Add validation for required fields
- **User Experience**: Provide helpful placeholders and instructions
- **Accessibility**: Include proper labels and ARIA attributes
- **Testing**: Test with various content types and edge cases

---

## 📁 Project Structure

```
QuantumInsights/
├── _article-generator/          # Article generation tool
│   ├── article-generator.html   # Main generator interface
│   └── article-generator.js     # Generator logic
├── _img/                        # Images and assets
├── concepts/                    # Quantum concepts articles
│   ├── concepts-template.css    # Styling for concept pages
│   └── [categories]/           # Organized by topic
├── research/                    # Research papers and code
│   ├── research-template.css    # Styling for research pages
│   └── [categories]/           # Organized by topic
├── concepts.html               # Concepts index page
├── research.html               # Research index page
└── index.html                  # Main landing page
```

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** our article guidelines
4. **Test** your changes thoroughly
5. **Submit** a pull request with clear description

## 📧 Contact

For questions or suggestions:
- Create an issue in this repository
- Contact the CPrA team

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

**CPrA QuantumInsights - Made by CPrA - Advancing Quantum Education and Research**
