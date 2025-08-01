// Template Generator JavaScript
class TemplateGenerator {
    constructor() {
        this.selectedTemplate = null;
        this.selectedSections = [];
        this.formData = {};
        this.sectionContents = {}; // Store custom content for each section
        this.featuredElements = []; // New array for featured elements
        this.currentEditingSection = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateAvailableSections();
        this.updateFeaturedElementsList();
    }

    setupEventListeners() {
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Form inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFormData();
            });
        });

        // Custom path change handler
        document.getElementById('customPath').addEventListener('input', () => {
            this.updatePathPreview();
        });
    }

    selectTemplate(templateType) {
        this.selectedTemplate = templateType;
        
        // Update UI
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`[data-template="${templateType}"]`).classList.add('selected');
        
        // Show appropriate form fields
        const conceptsFields = document.getElementById('conceptsFields');
        const researchFields = document.getElementById('researchFields');
        
        if (templateType === 'concepts') {
            conceptsFields.style.display = 'block';
            researchFields.style.display = 'none';
        } else if (templateType === 'research') {
            researchFields.style.display = 'block';
            conceptsFields.style.display = 'none';
        }
        
        // Show basic info form
        document.getElementById('basicInfoForm').classList.add('active');
        this.updateProgress(2);
        this.showNotification('Template selected! Fill in the basic information.', 'success');
    }

    populateAvailableSections() {
        const conceptSections = [
            { id: 'introduction', name: 'Introduction', icon: '🎯', description: 'Overview and key insights' },
            { id: 'text', name: 'Text Section', icon: '📝', description: 'Basic text content' },
            { id: 'mathematical', name: 'Mathematical Foundation', icon: '📐', description: 'Equations and mathematical concepts' },
            { id: 'implementation', name: 'Implementation Examples', icon: '💻', description: 'Code examples and circuits' },
            { id: 'concepts-grid', name: 'Key Concepts Grid', icon: '🧩', description: 'Concept cards layout' },
            { id: 'interactive-demo', name: 'Interactive Demo', icon: '🎮', description: 'Interactive elements' },
            { id: 'video', name: 'Video Explanation', icon: '🎬', description: 'YouTube video embed' },
            { id: 'applications', name: 'Real-World Applications', icon: '🚀', description: 'Practical applications' },
            { id: 'pitfalls', name: 'Common Pitfalls', icon: '⚠️', description: 'Mistakes to avoid' },
            { id: 'references', name: 'References & Further Reading', icon: '📚', description: 'Bibliography and sources' }
        ];

        const researchSections = [
            { id: 'problem-statement', name: 'Problem Statement', icon: '🎯', description: 'Research problem definition' },
            { id: 'text', name: 'Text Section', icon: '📝', description: 'Basic text content' },
            { id: 'methodology', name: 'Methodology & Approach', icon: '🔬', description: 'Research methods' },
            { id: 'implementation', name: 'Implementation Details', icon: '💻', description: 'Code and algorithms' },
            { id: 'results', name: 'Results & Analysis', icon: '📊', description: 'Performance metrics' },
            { id: 'code-variations', name: 'Alternative Implementations', icon: '🔧', description: 'Different frameworks' },
            { id: 'discussion', name: 'Discussion & Implications', icon: '💭', description: 'Broader implications' },
            { id: 'limitations', name: 'Limitations & Challenges', icon: '⚠️', description: 'Current limitations' },
            { id: 'references', name: 'References & Further Reading', icon: '📚', description: 'Bibliography and sources' }
        ];

        // Store sections for later use
        this.availableSections = {
            concepts: conceptSections,
            research: researchSections
        };
    }

    proceedToSections() {
        if (!this.validateBasicInfo()) {
            this.showNotification('Please fill in all required fields.', 'warning');
            return;
        }

        this.updateFormData();
        
        // Populate sections based on selected template
        const sections = this.availableSections[this.selectedTemplate];
        const container = document.getElementById('availableSections');
        container.innerHTML = '';

        sections.forEach(section => {
            const sectionCard = document.createElement('div');
            sectionCard.className = 'section-card';
            sectionCard.dataset.sectionId = section.id;
            sectionCard.innerHTML = `
                <h4>${section.icon} ${section.name}</h4>
                <p>${section.description}</p>
            `;
            sectionCard.addEventListener('click', () => this.addSection(section));
            container.appendChild(sectionCard);
        });

        // Show section manager
        document.getElementById('basicInfoForm').style.display = 'none';
        document.getElementById('sectionManager').style.display = 'block';
        this.updateProgress(3);
    }

    addSection(section) {
        // Only allow one instance of introduction and references
        if ((section.id === 'introduction' || section.id === 'references') && 
            this.selectedSections.find(s => s.id === section.id)) {
            this.showNotification(`Only one ${section.name} section is allowed!`, 'warning');
            return;
        }

        // For other sections, allow multiple instances with unique IDs
        let newSection = { ...section };
        if (section.id !== 'introduction' && section.id !== 'references') {
            // Count existing sections of this type
            const existingCount = this.selectedSections.filter(s => s.id === section.id).length;
            if (existingCount > 0) {
                // Create a unique ID for multiple instances
                newSection.uniqueId = `${section.id}_${existingCount + 1}`;
                newSection.name = `${section.name} ${existingCount + 1}`;
            } else {
                newSection.uniqueId = section.id;
            }
        } else {
            newSection.uniqueId = section.id;
        }

        this.selectedSections.push(newSection);
        this.updateSelectedSectionsUI();
    }

    removeSection(uniqueId) {
        this.selectedSections = this.selectedSections.filter(s => (s.uniqueId || s.id) !== uniqueId);
        this.updateSelectedSectionsUI();
    }

    updateSelectedSectionsUI() {
        const container = document.getElementById('selectedSections');
        
        if (this.selectedSections.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--light-grey); margin: 2rem 0;">
                    Click on sections above to add them to your document
                </p>
            `;
            return;
        }

        container.innerHTML = this.selectedSections.map((section, index) => {
            const uniqueId = section.uniqueId || section.id;
            const isEdited = this.sectionContents[uniqueId] ? ' ✓' : '';
            const editedClass = this.sectionContents[uniqueId] ? ' edited' : '';
            return `
            <div class="selected-section-item${editedClass}">
                <span>${section.icon} ${section.name}${isEdited}</span>
                <div>
                    <button class="btn btn-small btn-secondary" onclick="generator.editSection(${index})">✏️ Edit</button>
                    <button class="btn btn-small btn-secondary" onclick="generator.moveSectionUp(${index})">↑</button>
                    <button class="btn btn-small btn-secondary" onclick="generator.moveSectionDown(${index})">↓</button>
                    <button class="btn btn-small btn-danger" onclick="generator.removeSection('${uniqueId}')">✕</button>
                </div>
            </div>
        `}).join('');
    }

    moveSectionUp(index) {
        if (index > 0) {
            [this.selectedSections[index], this.selectedSections[index - 1]] = 
            [this.selectedSections[index - 1], this.selectedSections[index]];
            this.updateSelectedSectionsUI();
        }
    }

    moveSectionDown(index) {
        if (index < this.selectedSections.length - 1) {
            [this.selectedSections[index], this.selectedSections[index + 1]] = 
            [this.selectedSections[index + 1], this.selectedSections[index]];
            this.updateSelectedSectionsUI();
        }
    }

    generatePreview() {
        if (this.selectedSections.length === 0) {
            this.showNotification('Please add at least one section.', 'warning');
            return;
        }

        const html = this.generateHTML();
        const formattedHtml = this.formatHTML(html);
        document.getElementById('codePreview').textContent = formattedHtml;
        
        // Update form data before generating meta updates
        this.updateFormData();
        
        // Generate meta.json updates and file location instructions
        this.generateMetaUpdates();
        this.generateEnhancedFileInstructions();
        
        // Show preview
        document.getElementById('sectionManager').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
        this.updateProgress(4);
    }

    formatHTML(html) {
        // Simple HTML formatter
        let formatted = html;
        let indent = 0;
        const indentSize = 4;
        
        // Split by tags
        const tokens = formatted.split(/(<[^>]*>)/);
        let result = '';
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i].trim();
            if (!token) continue;
            
            if (token.startsWith('</')) {
                // Closing tag
                indent -= indentSize;
                result += ' '.repeat(Math.max(0, indent)) + token + '\n';
            } else if (token.startsWith('<') && !token.endsWith('/>') && !token.includes('</')) {
                // Opening tag
                result += ' '.repeat(indent) + token + '\n';
                if (!['br', 'img', 'input', 'meta', 'link', 'hr', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].includes(token.match(/<(\w+)/)?.[1])) {
                    indent += indentSize;
                }
            } else if (token.startsWith('<')) {
                // Self-closing tag
                result += ' '.repeat(indent) + token + '\n';
            } else {
                // Text content
                if (token.length > 0) {
                    result += ' '.repeat(indent) + token + '\n';
                }
            }
        }
        
        return result;
    }

    getCSSPath() {
        const customPath = document.getElementById('customPath').value;
        
        if (!customPath) {
            return { cssPath: '', faviconPath: '' };
        }
        
        // Count directory levels based on path
        const pathSegments = customPath.split('/');
        // Remove the filename (last segment)
        const directorySegments = pathSegments.slice(0, -1);
        const depth = directorySegments.length;
        
        let cssPath = '';
        let faviconPath = '';
        
        if (customPath.startsWith('concepts/')) {
            if (depth === 1) {
                // In main concepts folder (concepts/file.html)
                cssPath = 'concepts-template.css';
                faviconPath = '../_img/favicon.svg';
            } else {
                // In a subcategory folder (concepts/algorithms/file.html)
                cssPath = '../concepts-template.css';
                faviconPath = '../../_img/favicon.svg';
            }
        } else if (customPath.startsWith('research/')) {
            if (depth === 1) {
                // In main research folder (research/file.html)
                cssPath = 'research-template.css';
                faviconPath = '../_img/favicon.svg';
            } else {
                // In a subcategory folder (research/papers/file.html)
                cssPath = '../research-template.css';
                faviconPath = '../../_img/favicon.svg';
            }
        } else {
            // Default paths for other locations
            const backLevels = '../'.repeat(depth);
            cssPath = backLevels + 'style.css'; // Generic fallback
            faviconPath = backLevels + '_img/favicon.svg';
        }
        
        return { cssPath, faviconPath };
    }

    editSection(sectionIndex) {
        const section = this.selectedSections[sectionIndex];
        this.currentEditingSection = sectionIndex;
        
        // Get existing content or create default using uniqueId
        const uniqueId = section.uniqueId || section.id;
        const existingContent = this.sectionContents[uniqueId] || {};
        
        // Show the modal and populate with existing content
        const modal = document.getElementById('contentEditor');
        const editorTitle = document.getElementById('editorTitle');
        const dynamicContent = document.getElementById('dynamicContent');
        
        editorTitle.textContent = `Edit ${section.name}`;
        
        // Populate basic fields
        document.getElementById('sectionTitle').value = existingContent.title || section.name;
        document.getElementById('sectionIcon').value = existingContent.icon || section.icon;
        
        // Generate section-specific fields using base section ID for field generation
        dynamicContent.innerHTML = this.generateSectionSpecificFields(section.id, existingContent);
        
        // Show modal
        modal.classList.add('show');
    }

    generateSectionSpecificFields(sectionId, existingContent) {
        switch (sectionId) {
            case 'text':
                return this.generateTextFields(existingContent);
            case 'mathematical':
                return this.generateMathematicalFields(existingContent);
            case 'concepts-grid':
                return this.generateConceptsGridFields(existingContent);
            case 'implementation':
                return this.generateImplementationFields(existingContent);
            case 'video':
                return this.generateVideoFields(existingContent);
            case 'interactive-demo':
                return this.generateInteractiveDemoFields(existingContent);
            case 'applications':
                return this.generateApplicationsFields(existingContent);
            case 'results':
                return this.generateResultsFields(existingContent);
            case 'references':
                return this.generateReferencesFields(existingContent);
            default:
                return this.generateDefaultFields(existingContent);
        }
    }


    generateTextFields(content) {
        return `
            <div class="content-editor">
                <label for="textContent">Main Content</label>
                <textarea id="textContent" rows="8" placeholder="Write your text content here...">${content.textContent || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="hasInfoBox">Include Info Box?</label>
                <select id="hasInfoBox" onchange="toggleInfoBox()">
                    <option value="no" ${!content.infoBoxContent ? 'selected' : ''}>No</option>
                    <option value="yes" ${content.infoBoxContent ? 'selected' : ''}>Yes</option>
                </select>
            </div>
            <div id="infoBoxFields" style="display: ${content.infoBoxContent ? 'block' : 'none'};">
                <div class="content-editor">
                    <label for="infoBoxType">Info Box Type</label>
                    <select id="infoBoxType">
                        <option value="note" ${content.infoBoxType === 'note' ? 'selected' : ''}>💡 Note</option>
                        <option value="tip" ${content.infoBoxType === 'tip' ? 'selected' : ''}>🎯 Tip</option>
                        <option value="warning" ${content.infoBoxType === 'warning' ? 'selected' : ''}>⚠️ Warning</option>
                        <option value="insight" ${content.infoBoxType === 'insight' ? 'selected' : ''}>🔍 Insight</option>
                    </select>
                </div>
                <div class="content-editor">
                    <label for="infoBoxContent">Info Box Content</label>
                    <textarea id="infoBoxContent" rows="3" placeholder="Info box content...">${content.infoBoxContent || ''}</textarea>
                </div>
            </div>
        `;
    }

    generateMathematicalFields(content) {
        return `
            <div class="content-editor">
                <label for="mathDescription">Mathematical Description</label>
                <textarea id="mathDescription" rows="4" placeholder="Explain the mathematical concepts...">${content.mathDescription || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="latexEquations">LaTeX Equations (one per line)</label>
                <textarea id="latexEquations" rows="6" placeholder="\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle&#10;|\\alpha|^2 + |\\beta|^2 = 1" class="equation-editor">${content.latexEquations || ''}</textarea>
                <small>Use LaTeX syntax. Each equation on a new line.</small>
            </div>
            <div class="content-editor">
                <label for="mathExplanation">Equation Explanations</label>
                <textarea id="mathExplanation" rows="4" placeholder="Explain what each symbol means and the intuition behind the equations...">${content.mathExplanation || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="mathKeyPoints">Key Mathematical Points</label>
                <textarea id="mathKeyPoints" rows="4" placeholder="• Key principle 1&#10;• Key principle 2">${content.mathKeyPoints || ''}</textarea>
            </div>
        `;
    }

    generateConceptsGridFields(content) {
        // Initialize concepts for this session
        this.currentConcepts = content.concepts || [{ title: '', description: '' }];
        
        let conceptsHTML = '';
        this.currentConcepts.forEach((concept, index) => {
            conceptsHTML += `
                <div class="concept-item" id="concept-${index}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4>Concept ${index + 1}</h4>
                        ${index > 0 ? `<button type="button" class="remove-concept-btn" onclick="removeConcept(${index})">Remove</button>` : ''}
                    </div>
                    <input type="text" placeholder="Concept title" value="${concept.title}" 
                           onchange="updateConcept(${index}, 'title', this.value)" style="width: 100%; margin-bottom: 0.5rem; padding: 0.5rem;">
                    <textarea placeholder="Concept description" rows="3" 
                              onchange="updateConcept(${index}, 'description', this.value)" 
                              style="width: 100%; padding: 0.5rem;">${concept.description}</textarea>
                </div>
            `;
        });

        return `
            <div class="content-editor">
                <label>Concept Cards</label>
                <div class="concept-controls">
                    <span>Configure your concept cards:</span>
                    <button type="button" class="add-concept-btn" onclick="addConcept()">+ Add Concept</button>
                </div>
                <div id="conceptsList">
                    ${conceptsHTML}
                </div>
            </div>
            <div class="content-editor">
                <label for="conceptsIntro">Introduction Text</label>
                <textarea id="conceptsIntro" rows="3" placeholder="Brief introduction to the concepts...">${content.conceptsIntro || ''}</textarea>
            </div>
        `;
    }

    generateImplementationFields(content) {
        return `
            <div class="content-editor">
                <label for="implDescription">Implementation Description</label>
                <textarea id="implDescription" rows="4" placeholder="Describe the implementation approach...">${content.implDescription || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="codeLanguage">Programming Language/Framework</label>
                <input type="text" id="codeLanguage" placeholder="Qiskit, PennyLane, Cirq, etc." value="${content.codeLanguage || ''}">
            </div>
            <div class="content-editor">
                <label for="codeContent">Code Implementation</label>
                <textarea id="codeContent" rows="10" placeholder="# Your code implementation here&#10;from qiskit import QuantumCircuit&#10;&#10;circuit = QuantumCircuit(2, 2)" class="equation-editor">${content.codeContent || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="codeExplanation">Code Explanation</label>
                <textarea id="codeExplanation" rows="4" placeholder="Explain what the code does step by step...">${content.codeExplanation || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="keySteps">Key Implementation Steps</label>
                <textarea id="keySteps" rows="4" placeholder="• Step 1: Description&#10;• Step 2: Description">${content.keySteps || ''}</textarea>
            </div>
        `;
    }

    generateVideoFields(content) {
        return `
            <div class="content-editor">
                <label for="videoTitle">Video Title</label>
                <input type="text" id="videoTitle" placeholder="Enter video title" value="${content.videoTitle || ''}">
            </div>
            <div class="content-editor">
                <label for="videoId">YouTube Video ID</label>
                <input type="text" id="videoId" placeholder="dQw4w9WgXcQ" value="${content.videoId || ''}">
                <small>Get this from the YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong></small>
            </div>
            <div class="content-editor">
                <label for="videoDescription">Video Description</label>
                <textarea id="videoDescription" rows="4" placeholder="Describe what this video covers and why it's helpful...">${content.videoDescription || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="videoIntro">Introduction Text</label>
                <textarea id="videoIntro" rows="3" placeholder="Text that appears before the video...">${content.videoIntro || ''}</textarea>
            </div>
        `;
    }

    generateInteractiveDemoFields(content) {
        return `
            <div class="content-editor">
                <label for="demoTitle">Demo Title</label>
                <input type="text" id="demoTitle" placeholder="Try It Yourself!" value="${content.demoTitle || ''}">
            </div>
            <div class="content-editor">
                <label for="demoDescription">Demo Description</label>
                <textarea id="demoDescription" rows="4" placeholder="Describe what users can do with this interactive demo...">${content.demoDescription || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="demoButton">Button Text</label>
                <input type="text" id="demoButton" placeholder="Run Quantum Circuit" value="${content.demoButton || ''}">
            </div>
            <div class="content-editor">
                <label for="demoCode">Demo Code/Setup</label>
                <textarea id="demoCode" rows="6" placeholder="// Code for the interactive demo&#10;function runDemo() {&#10;    // Implementation here&#10;}" class="equation-editor">${content.demoCode || ''}</textarea>
            </div>
        `;
    }

    generateApplicationsFields(content) {
        // Initialize applications for this session
        this.currentApplications = content.applications || [{ title: '', description: '' }];
        
        let applicationsHTML = '';
        this.currentApplications.forEach((app, index) => {
            applicationsHTML += `
                <div class="concept-item" id="application-${index}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4>Application ${index + 1}</h4>
                        ${index > 0 ? `<button type="button" class="remove-concept-btn" onclick="removeApplication(${index})">Remove</button>` : ''}
                    </div>
                    <input type="text" placeholder="Application title" value="${app.title}" 
                           onchange="updateApplication(${index}, 'title', this.value)" style="width: 100%; margin-bottom: 0.5rem; padding: 0.5rem;">
                    <textarea placeholder="Application description" rows="3" 
                              onchange="updateApplication(${index}, 'description', this.value)" 
                              style="width: 100%; padding: 0.5rem;">${app.description}</textarea>
                </div>
            `;
        });

        return `
            <div class="content-editor">
                <label for="applicationsIntro">Introduction</label>
                <textarea id="applicationsIntro" rows="3" placeholder="Introduce the real-world applications...">${content.applicationsIntro || ''}</textarea>
            </div>
            <div class="content-editor">
                <label>Real-World Applications</label>
                <div class="concept-controls">
                    <span>Configure applications:</span>
                    <button type="button" class="add-concept-btn" onclick="addApplication()">+ Add Application</button>
                </div>
                <div id="applicationsList">
                    ${applicationsHTML}
                </div>
            </div>
        `;
    }

    generateResultsFields(content) {
        return `
            <div class="content-editor">
                <label for="resultsIntro">Results Introduction</label>
                <textarea id="resultsIntro" rows="4" placeholder="Introduce your research results...">${content.resultsIntro || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="keyFindings">Key Findings</label>
                <textarea id="keyFindings" rows="6" placeholder="• Finding 1: Description&#10;• Finding 2: Description">${content.keyFindings || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="performanceMetrics">Performance Metrics</label>
                <textarea id="performanceMetrics" rows="4" placeholder="Describe performance metrics, benchmarks, accuracy, etc.">${content.performanceMetrics || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="dataVisualization">Data/Charts Description</label>
                <textarea id="dataVisualization" rows="3" placeholder="Describe charts, graphs, or data tables that would be included...">${content.dataVisualization || ''}</textarea>
            </div>
        `;
    }

    generateDefaultFields(content) {
        return `
            <div class="content-editor">
                <label for="mainContent">Main Content</label>
                <textarea id="mainContent" rows="8" placeholder="Write the main content for this section...">${content.mainContent || ''}</textarea>
            </div>
            <div class="content-editor">
                <label for="keyPoints">Key Points</label>
                <textarea id="keyPoints" rows="4" placeholder="• Point 1&#10;• Point 2">${content.keyPoints || ''}</textarea>
            </div>
        `;
    }

    generateReferencesFields(content) {
        return `
            <div class="content-editor">
                <label for="bibliography">Bibliography & References</label>
                <textarea id="bibliography" rows="8" placeholder="Enter references, one per line:&#10;[1] Author, A. (Year). Title. Journal/Publisher.&#10;[2] Author, B. (Year). Title. Journal/Publisher.&#10;...">${content.bibliography || ''}</textarea>
                <small>Enter each reference on a new line. Numbering will be added automatically.</small>
            </div>
        `;
    }


    saveSection() {
        const section = this.selectedSections[this.currentEditingSection];
        const uniqueId = section.uniqueId || section.id;
        
        // Collect basic data
        const sectionContent = {
            title: document.getElementById('sectionTitle').value,
            icon: document.getElementById('sectionIcon').value,
            sectionType: section.id
        };
        
        // Collect section-specific data
        this.collectSectionSpecificData(section.id, sectionContent);
        
        // Save the content using uniqueId
        this.sectionContents[uniqueId] = sectionContent;
        
        // Update the section name in the UI if it was changed
        if (sectionContent.title !== section.name) {
            this.selectedSections[this.currentEditingSection].name = sectionContent.title;
        }
        if (sectionContent.icon !== section.icon) {
            this.selectedSections[this.currentEditingSection].icon = sectionContent.icon;
        }
        
        // Update the UI to show the section has been edited
        this.updateSelectedSectionsUI();
        
        // Close modal
        this.closeEditor();
        
        this.showNotification('Section content saved successfully!', 'success');
    }

    collectSectionSpecificData(sectionId, sectionContent) {
        switch (sectionId) {
            case 'text':
                sectionContent.textContent = document.getElementById('textContent')?.value || '';
                sectionContent.infoBoxContent = document.getElementById('infoBoxContent')?.value || '';
                sectionContent.infoBoxType = document.getElementById('infoBoxType')?.value || 'note';
                break;
                
            case 'mathematical':
                sectionContent.mathDescription = document.getElementById('mathDescription')?.value || '';
                sectionContent.latexEquations = document.getElementById('latexEquations')?.value || '';
                sectionContent.mathExplanation = document.getElementById('mathExplanation')?.value || '';
                sectionContent.mathKeyPoints = document.getElementById('mathKeyPoints')?.value || '';
                break;
                
            case 'concepts-grid':
                sectionContent.concepts = this.currentConcepts || [];
                sectionContent.conceptsIntro = document.getElementById('conceptsIntro')?.value || '';
                break;
                
            case 'implementation':
                sectionContent.implDescription = document.getElementById('implDescription')?.value || '';
                sectionContent.codeLanguage = document.getElementById('codeLanguage')?.value || '';
                sectionContent.codeContent = document.getElementById('codeContent')?.value || '';
                sectionContent.codeExplanation = document.getElementById('codeExplanation')?.value || '';
                sectionContent.keySteps = document.getElementById('keySteps')?.value || '';
                break;
                
            case 'video':
                sectionContent.videoTitle = document.getElementById('videoTitle')?.value || '';
                sectionContent.videoId = document.getElementById('videoId')?.value || '';
                sectionContent.videoDescription = document.getElementById('videoDescription')?.value || '';
                sectionContent.videoIntro = document.getElementById('videoIntro')?.value || '';
                break;
                
            case 'interactive-demo':
                sectionContent.demoTitle = document.getElementById('demoTitle')?.value || '';
                sectionContent.demoDescription = document.getElementById('demoDescription')?.value || '';
                sectionContent.demoButton = document.getElementById('demoButton')?.value || '';
                sectionContent.demoCode = document.getElementById('demoCode')?.value || '';
                break;
                
            case 'applications':
                sectionContent.applicationsIntro = document.getElementById('applicationsIntro')?.value || '';
                sectionContent.applications = this.currentApplications || [];
                break;
                
            case 'results':
                sectionContent.resultsIntro = document.getElementById('resultsIntro')?.value || '';
                sectionContent.keyFindings = document.getElementById('keyFindings')?.value || '';
                sectionContent.performanceMetrics = document.getElementById('performanceMetrics')?.value || '';
                sectionContent.dataVisualization = document.getElementById('dataVisualization')?.value || '';
                break;
                
            case 'references':
                sectionContent.bibliography = document.getElementById('bibliography')?.value || '';
                break;
                
            default:
                sectionContent.mainContent = document.getElementById('mainContent')?.value || '';
                sectionContent.keyPoints = document.getElementById('keyPoints')?.value || '';
                break;
        }
    }

    closeEditor() {
        const modal = document.getElementById('contentEditor');
        modal.classList.remove('show');
        this.currentEditingSection = null;
        // Reset dynamic arrays
        this.currentConcepts = null;
        this.currentApplications = null;
    }

    // Dynamic concept management
    initializeConcepts(concepts) {
        this.currentConcepts = concepts || [{ title: '', description: '' }];
    }

    addConcept() {
        if (!this.currentConcepts) this.currentConcepts = [];
        this.currentConcepts.push({ title: '', description: '' });
        this.refreshConceptsList();
    }

    removeConcept(index) {
        if (this.currentConcepts && this.currentConcepts.length > 1) {
            this.currentConcepts.splice(index, 1);
            this.refreshConceptsList();
        }
    }

    updateConcept(index, field, value) {
        if (this.currentConcepts && this.currentConcepts[index]) {
            this.currentConcepts[index][field] = value;
        }
    }

    refreshConceptsList() {
        const container = document.getElementById('conceptsList');
        if (!container) return;
        
        let conceptsHTML = '';
        this.currentConcepts.forEach((concept, index) => {
            conceptsHTML += `
                <div class="concept-item" id="concept-${index}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4>Concept ${index + 1}</h4>
                        ${index > 0 ? `<button type="button" class="remove-concept-btn" onclick="generator.removeConcept(${index})">Remove</button>` : ''}
                    </div>
                    <input type="text" placeholder="Concept title" value="${concept.title}" 
                           onchange="generator.updateConcept(${index}, 'title', this.value)" style="width: 100%; margin-bottom: 0.5rem; padding: 0.5rem;">
                    <textarea placeholder="Concept description" rows="3" 
                              onchange="generator.updateConcept(${index}, 'description', this.value)" 
                              style="width: 100%; padding: 0.5rem;">${concept.description}</textarea>
                </div>
            `;
        });
        container.innerHTML = conceptsHTML;
    }

    // Dynamic applications management
    initializeApplications(applications) {
        this.currentApplications = applications || [{ title: '', description: '' }];
    }

    addApplication() {
        if (!this.currentApplications) this.currentApplications = [];
        this.currentApplications.push({ title: '', description: '' });
        this.refreshApplicationsList();
    }

    removeApplication(index) {
        if (this.currentApplications && this.currentApplications.length > 1) {
            this.currentApplications.splice(index, 1);
            this.refreshApplicationsList();
        }
    }

    updateApplication(index, field, value) {
        if (this.currentApplications && this.currentApplications[index]) {
            this.currentApplications[index][field] = value;
        }
    }

    refreshApplicationsList() {
        const container = document.getElementById('applicationsList');
        if (!container) return;
        
        let applicationsHTML = '';
        this.currentApplications.forEach((app, index) => {
            applicationsHTML += `
                <div class="concept-item" id="application-${index}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4>Application ${index + 1}</h4>
                        ${index > 0 ? `<button type="button" class="remove-concept-btn" onclick="generator.removeApplication(${index})">Remove</button>` : ''}
                    </div>
                    <input type="text" placeholder="Application title" value="${app.title}" 
                           onchange="generator.updateApplication(${index}, 'title', this.value)" style="width: 100%; margin-bottom: 0.5rem; padding: 0.5rem;">
                    <textarea placeholder="Application description" rows="3" 
                              onchange="generator.updateApplication(${index}, 'description', this.value)" 
                              style="width: 100%; padding: 0.5rem;">${app.description}</textarea>
                </div>
            `;
        });
        container.innerHTML = applicationsHTML;
    }

    getSectionIcon(sectionId) {
        const icons = {
            'introduction': '🎯',
            'mathematical': '📐',
            'mathematical-foundation': '📐',
            'implementation': '💻',
            'concepts-grid': '🧩',
            'interactive-demo': '🎮',
            'video': '🎬',
            'applications': '🚀',
            'pitfalls': '⚠️',
            'problem-statement': '🎯',
            'methodology': '🔬',
            'results': '📊',
            'discussion': '💭',
            'conclusion': '🎯',
            'literature-review': '📚',
            'code-implementation': '💻',
            'performance-analysis': '⚡',
            'examples': '📝'
        };
        
        return icons[sectionId] || '📄';
    }

    // Utility functions for content formatting
    formatTextContent(text) {
        if (!text) return '';
        
        // Convert newlines to paragraphs and handle bullet points
        const paragraphs = text.split('\n\n');
        
        return paragraphs.map(paragraph => {
            if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                // Handle bullet points
                const lines = paragraph.split('\n').filter(line => line.trim());
                return '<ul>' + lines.map(line => `<li>${line.replace(/^[•\-]\s*/, '').trim()}</li>`).join('') + '</ul>';
            } else if (paragraph.trim()) {
                // Regular paragraph
                return `<p>${paragraph.trim()}</p>`;
            }
            return '';
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getInfoBoxIcon(type) {
        const icons = {
            'note': '💡',
            'tip': '🎯',
            'warning': '⚠️',
            'insight': '🔍',
            'challenge': '🎯',
            'future': '🔮'
        };
        return icons[type] || '💡';
    }

    getInfoBoxTitle(type) {
        const titles = {
            'note': 'Note',
            'tip': 'Tip',
            'warning': 'Warning',
            'insight': 'Key Insight',
            'challenge': 'Challenge',
            'future': 'Future Directions'
        };
        return titles[type] || 'Note';
    }

    generateHTML() {
        const template = this.selectedTemplate;
        const data = this.formData;
        
        let html = '';
        
        if (template === 'concepts') {
            html = this.generateConceptsHTML(data);
        } else {
            html = this.generateResearchHTML(data);
        }
        
        return html;
    }

    generateConceptsHTML(data) {
        const title = data.documentTitle || '[Your Concept Title Here]';
        const description = data.documentDescription || 'A comprehensive guide to understanding [concept name] in quantum computing';
        const conceptName = data.conceptName || '[concept name]';
        const level = data.documentLevel || 'Beginner';
        const readingTime = data.readingTime || 'X';
        const { cssPath, faviconPath } = this.getCSSPath();

        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - CPrA QuantumInsights</title>
    <link rel="icon" type="image/svg+xml" href="${faviconPath}">
    <link rel="stylesheet" href="${cssPath}">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <img src="${faviconPath}" alt="CPrA Logo" class="nav-logo-icon">
                <div class="logo-text">
                    <span class="logo-title">Quantum Insights</span>
                    <span class="logo-subtitle">By CPrA</span>
                </div>
            </a>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../concepts.html">QC Concepts</a></li>
                <li><a href="../research.html">Research & Code</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </div>
    </nav>

    <div class="article-container">
        <nav class="breadcrumb">
            <a href="../concepts.html">Concepts</a>
            <span class="breadcrumb-separator">></span>
            <a href="../concepts.html#section-name">[Section Name]</a>
            <span class="breadcrumb-separator">></span>
            <span>${title}</span>
        </nav>

        <header class="article-header">
            <h1 class="article-title">${title}</h1>
            <p class="article-subtitle">${description}</p>
            <div class="article-meta">
                <div class="meta-item">
                    <span>📅</span>
                    <span>Updated: ${new Date().toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                    <span>⏱️</span>
                    <span>Reading time: ${readingTime} min</span>
                </div>
                <div class="meta-item">
                    <span>🎯</span>
                    <span>Level: ${level}</span>
                </div>
            </div>
        </header>

        <main>`;

        // Add selected sections
        this.selectedSections.forEach(section => {
            html += this.generateConceptSection(section);
        });

        html += `
        </main>

        <nav class="article-navigation">
            <a href="#" class="nav-link prev">Previous Concept</a>
            <a href="../concepts.html" class="nav-link">Back to Concepts</a>
            <a href="#" class="nav-link next">Next Concept</a>
        </nav>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 CPrA QuantumInsights. Advancing quantum education and research.</p>
            <span class="by-text">by</span>
            <img src="${faviconPath}" alt="CPrA Logo" class="cpra-logo-small">
        </div>
    </footer>

    <script>
        // Add your JavaScript functionality here
        function runDemo() {
            alert('Implement your interactive demo here!');
        }
    </script>
</body>
</html>`;

        return html;
    }

    generateResearchHTML(data) {
        const title = data.documentTitle || '[Your Research Paper Title Here]';
        const authors = data.authors || '[Author Names, Affiliations]';
        const venue = data.venue || '[Conference/Journal Name Year]';
        const category = data.category || 'Algorithm';
        const framework = data.framework || '[Framework Used]';
        const { cssPath, faviconPath } = this.getCSSPath();

        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - CPrA QuantumInsights</title>
    <link rel="icon" type="image/svg+xml" href="${faviconPath}">
    <link rel="stylesheet" href="${cssPath}">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <img src="${faviconPath}" alt="CPrA Logo" class="nav-logo-icon">
                <div class="logo-text">
                    <span class="logo-title">Quantum Insights</span>
                    <span class="logo-subtitle">By CPrA</span>
                </div>
            </a>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../concepts.html">QC Concepts</a></li>
                <li><a href="../research.html">Research & Code</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </div>
    </nav>

    <div class="article-container">
        <nav class="breadcrumb">
            <a href="../research.html">Research</a>
            <span class="breadcrumb-separator">></span>
            <a href="../research.html#section-name">[Research Category]</a>
            <span class="breadcrumb-separator">></span>
            <span>${title}</span>
        </nav>

        <header class="paper-header">
            <h1 class="paper-title">${title}</h1>
            <div class="paper-authors">${authors}</div>
            <div class="paper-venue">${venue}</div>
            <div class="paper-meta">
                <div class="meta-item">
                    <span>📅</span>
                    <span>Published: ${new Date().toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                    <span>🏷️</span>
                    <span>Category: ${category}</span>
                </div>
                <div class="meta-item">
                    <span>⏱️</span>
                    <span>Reading time: 15 min</span>
                </div>
                <div class="meta-item">
                    <span>💾</span>
                    <span>Implementation: ${framework}</span>
                </div>
            </div>
        </header>

        <section class="abstract">
            <h3>📄 Abstract</h3>
            <p>
                [Add your abstract here. This should be a concise summary of the research problem, 
                methodology, key findings, and implications.]
            </p>
        </section>

        <main>`;

        // Add selected sections
        this.selectedSections.forEach(section => {
            html += this.generateResearchSection(section);
        });

        html += `
            <section class="citation-box">
                <h4>📝 How to Cite This Work</h4>
                <div>
                    ${authors} (${new Date().getFullYear()}). ${title}. ${venue}.
                </div>
            </section>
        </main>

        <nav class="paper-navigation">
            <a href="#" class="nav-link prev">Previous Paper</a>
            <a href="../research.html" class="nav-link">Back to Research</a>
            <a href="#" class="nav-link next">Next Paper</a>
        </nav>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 CPrA QuantumInsights. Advancing quantum education and research.</p>
            <span class="by-text">by</span>
            <img src="${faviconPath}" alt="CPrA Logo" class="cpra-logo-small">
        </div>
    </footer>
</body>
</html>`;

        return html;
    }

    generateConceptSection(section) {
        const uniqueId = section.uniqueId || section.id;
        const content = this.sectionContents[uniqueId];
        if (!content) return `<section class="content-section"><h2>${section.name}</h2><p>Please edit this section to add content.</p></section>`;
        
        let html = `
        <section class="content-section">
            <div class="section-header">
                <span class="section-icon">${content.icon}</span>
                <h2 class="section-title">${content.title}</h2>
            </div>`;
        
        switch (section.id) {
            case 'text':
                html += this.generateTextSectionHTML(content);
                break;
            case 'mathematical':
                html += this.generateMathematicalSectionHTML(content);
                break;
            case 'concepts-grid':
                html += this.generateConceptsGridSectionHTML(content);
                break;
            case 'implementation':
                html += this.generateImplementationSectionHTML(content);
                break;
            case 'video':
                html += this.generateVideoSectionHTML(content);
                break;
            case 'interactive-demo':
                html += this.generateInteractiveDemoSectionHTML(content);
                break;
            case 'applications':
                html += this.generateApplicationsSectionHTML(content);
                break;
            case 'references':
                html += this.generateReferencesSectionHTML(content);
                break;
            default:
                html += this.generateDefaultSectionHTML(content);
                break;
        }
        
        html += `</section>`;
        return html;
    }

    generateResearchSection(section) {
        const uniqueId = section.uniqueId || section.id;
        const content = this.sectionContents[uniqueId];
        if (!content) return `<section class="content-section"><h2>${section.name}</h2><p>Please edit this section to add content.</p></section>`;
        
        let html = `
        <section class="content-section">
            <div class="section-header">
                <span class="section-icon">${content.icon}</span>
                <h2 class="section-title">${content.title}</h2>
            </div>`;
        
        switch (section.id) {
            case 'text':
                html += this.generateTextSectionHTML(content);
                break;
            case 'implementation':
                html += this.generateImplementationSectionHTML(content);
                break;
            case 'results':
                html += this.generateResultsSectionHTML(content);
                break;
            case 'applications':
                html += this.generateApplicationsSectionHTML(content);
                break;
            case 'references':
                html += this.generateReferencesSectionHTML(content);
                break;
            default:
                html += this.generateDefaultSectionHTML(content);
                break;
        }
        
        html += `</section>`;
        return html;
    }

    generateTextSectionHTML(content) {
        let html = '';
        
        if (content.textContent) {
            html += `<div class="main-content">${this.formatTextContent(content.textContent)}</div>`;
        }
        
        if (content.infoBoxContent) {
            html += `
            <div class="info-box ${content.infoBoxType}">
                <div class="info-box-title">${this.getInfoBoxIcon(content.infoBoxType)} ${this.getInfoBoxTitle(content.infoBoxType)}</div>
                <p>${content.infoBoxContent}</p>
            </div>`;
        }
        
        return html;
    }

    generateMathematicalSectionHTML(content) {
        let html = '';
        
        if (content.mathDescription) {
            html += `<div class="main-content">${this.formatTextContent(content.mathDescription)}</div>`;
        }
        
        if (content.latexEquations) {
            const equations = content.latexEquations.split('\n').filter(eq => eq.trim());
            equations.forEach(equation => {
                html += `
                <div class="equation-block">
                    ${equation.trim()}
                </div>`;
            });
        }
        
        if (content.mathExplanation) {
            html += `<div class="math-explanation">${this.formatTextContent(content.mathExplanation)}</div>`;
        }
        
        if (content.mathKeyPoints) {
            html += `
            <div class="key-points">
                <h4>Key Mathematical Points:</h4>
                ${this.formatTextContent(content.mathKeyPoints)}
            </div>`;
        }
        
        return html;
    }

    generateConceptsGridSectionHTML(content) {
        let html = '';
        
        if (content.conceptsIntro) {
            html += `<div class="main-content">${this.formatTextContent(content.conceptsIntro)}</div>`;
        }
        
        if (content.concepts && content.concepts.length > 0) {
            html += `<div class="concept-grid">`;
            content.concepts.forEach(concept => {
                if (concept.title || concept.description) {
                    html += `
                    <div class="concept-card">
                        <h3>${concept.title || 'Concept'}</h3>
                        <p>${concept.description || 'Description not provided'}</p>
                    </div>`;
                }
            });
            html += `</div>`;
        }
        
        return html;
    }

    generateImplementationSectionHTML(content) {
        let html = '';
        
        if (content.implDescription) {
            html += `<div class="main-content">${this.formatTextContent(content.implDescription)}</div>`;
        }
        
        if (content.codeContent) {
            html += `
            <div class="code-block">
                <div class="code-header">
                    <span>Implementation Code</span>
                    <span class="code-language">${content.codeLanguage || 'Code'}</span>
                </div>
                <pre><code>${this.escapeHtml(content.codeContent)}</code></pre>
            </div>`;
        }
        
        if (content.codeExplanation) {
            html += `<div class="code-explanation">${this.formatTextContent(content.codeExplanation)}</div>`;
        }
        
        if (content.keySteps) {
            html += `
            <div class="key-points">
                <h4>Implementation Steps:</h4>
                ${this.formatTextContent(content.keySteps)}
            </div>`;
        }
        
        return html;
    }

    generateVideoSectionHTML(content) {
        let html = '';
        
        if (content.videoIntro) {
            html += `<div class="main-content">${this.formatTextContent(content.videoIntro)}</div>`;
        }
        
        if (content.videoId) {
            html += `
            <div class="video-container">
                <h3 class="video-title">${content.videoTitle || 'Video Explanation'}</h3>
                ${content.videoDescription ? `<p class="video-description">${content.videoDescription}</p>` : ''}
                
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${content.videoId}" 
                        title="${content.videoTitle || 'Video Explanation'}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>`;
        }
        
        return html;
    }

    generateInteractiveDemoSectionHTML(content) {
        let html = '';
        
        if (content.demoDescription) {
            html += `<div class="main-content">${this.formatTextContent(content.demoDescription)}</div>`;
        }
        
        html += `
        <div class="interactive-demo">
            <h3>${content.demoTitle || 'Try It Yourself!'}</h3>
            <button class="demo-button" onclick="runDemo()">${content.demoButton || 'Run Demo'}</button>
        </div>`;
        
        if (content.demoCode) {
            html += `
            <script>
                function runDemo() {
                    ${content.demoCode}
                }
            </script>`;
        }
        
        return html;
    }

    generateApplicationsSectionHTML(content) {
        let html = '';
        
        if (content.applicationsIntro) {
            html += `<div class="main-content">${this.formatTextContent(content.applicationsIntro)}</div>`;
        }
        
        if (content.applications && content.applications.length > 0) {
            html += `<div class="applications-list">`;
            content.applications.forEach((app, index) => {
                if (app.title || app.description) {
                    html += `
                    <div class="application-item">
                        <h4>${app.title || `Application ${index + 1}`}</h4>
                        <p>${app.description || 'Description not provided'}</p>
                    </div>`;
                }
            });
            html += `</div>`;
        }
        
        return html;
    }

    generateResultsSectionHTML(content) {
        let html = '';
        
        if (content.resultsIntro) {
            html += `<div class="main-content">${this.formatTextContent(content.resultsIntro)}</div>`;
        }
        
        if (content.keyFindings) {
            html += `
            <div class="key-points">
                <h4>Key Findings:</h4>
                ${this.formatTextContent(content.keyFindings)}
            </div>`;
        }
        
        if (content.performanceMetrics) {
            html += `
            <div class="performance-section">
                <h4>Performance Metrics:</h4>
                ${this.formatTextContent(content.performanceMetrics)}
            </div>`;
        }
        
        if (content.dataVisualization) {
            html += `
            <div class="data-visualization">
                <h4>Data Analysis:</h4>
                ${this.formatTextContent(content.dataVisualization)}
            </div>`;
        }
        
        return html;
    }

    generateDefaultSectionHTML(content) {
        let html = '';
        
        if (content.mainContent) {
            html += `<div class="main-content">${this.formatTextContent(content.mainContent)}</div>`;
        }
        
        if (content.keyPoints) {
            html += `
            <div class="key-points">
                <h4>Key Points:</h4>
                ${this.formatTextContent(content.keyPoints)}
            </div>`;
        }
        
        return html;
    }

    generateReferencesSectionHTML(content) {
        let html = '';
        
        if (content.bibliography) {
            const references = content.bibliography.split('\n').filter(ref => ref.trim());
            html += '<div class="bibliography">';
            references.forEach((ref, index) => {
                html += `<div class="reference-item"><strong>[${index + 1}]</strong> ${ref.trim()}</div>`;
            });
            html += '</div>';
        } else {
            html += `<div class="bibliography">
                <div class="reference-item"><strong>[1]</strong> Add your references here.</div>
            </div>`;
        }
        
        return html;
    }

    validateBasicInfo() {
        const title = document.getElementById('documentTitle').value.trim();
        return title.length > 0;
    }

    updateFormData() {
        this.formData = {
            documentTitle: document.getElementById('documentTitle').value,
            documentDescription: document.getElementById('documentDescription').value,
            documentLevel: document.getElementById('documentLevel').value,
            featuredElements: this.featuredElements,
            customPath: document.getElementById('customPath').value,
            conceptName: document.getElementById('conceptName')?.value || '',
            readingTime: document.getElementById('readingTime')?.value || '',
            authors: document.getElementById('authors')?.value || '',
            venue: document.getElementById('venue')?.value || '',
            category: document.getElementById('category')?.value || '',
            framework: document.getElementById('framework')?.value || ''
        };
    }

    updateProgress(step) {
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`step${i}`);
            const numberElement = stepElement.querySelector('.step-number');
            
            if (i < step) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
                numberElement.classList.remove('active');
                numberElement.classList.add('completed');
                numberElement.textContent = '✓';
            } else if (i === step) {
                stepElement.classList.remove('completed');
                stepElement.classList.add('active');
                numberElement.classList.remove('completed');
                numberElement.classList.add('active');
                numberElement.textContent = i;
            } else {
                stepElement.classList.remove('active', 'completed');
                numberElement.classList.remove('active', 'completed');
                numberElement.textContent = i;
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    downloadHTML() {
        const html = document.getElementById('codePreview').textContent;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.formData.documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('HTML file downloaded successfully!', 'success');
    }

    copyToClipboard() {
        const html = document.getElementById('codePreview').textContent;
        navigator.clipboard.writeText(html).then(() => {
            this.showNotification('HTML copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy to clipboard', 'warning');
        });
    }

    async generateMetaUpdates() {
        const customPath = this.formData.customPath || '';
        const pathParts = customPath.split('/');
        
        if (pathParts.length < 2) {
            document.getElementById('metaPreview').innerHTML = '<p style="color: #ef4444;">Please enter a valid path (e.g., concepts/algorithms/file.html)</p>';
            return;
        }

        const mainCategory = pathParts[0]; // concepts or research
        const subcategory = pathParts.length > 2 ? pathParts[1] : null; // algorithms, fundamentals, etc.
        
        // Show loading state
        document.getElementById('metaPreview').innerHTML = '<p style="color: #666;">🔍 Checking GitHub folder structure and generating meta.json updates...</p>';
        
        try {
            let metaUpdatesHTML = '';
            
            if (mainCategory === 'concepts') {
                metaUpdatesHTML = await this.generateEnhancedConceptsMetaUpdates(subcategory);
            } else if (mainCategory === 'research') {
                metaUpdatesHTML = await this.generateEnhancedResearchMetaUpdates(subcategory);
            } else {
                metaUpdatesHTML = '<p style="color: #ef4444;">Path must start with "concepts/" or "research/"</p>';
            }
            
            document.getElementById('metaPreview').innerHTML = metaUpdatesHTML;
        } catch (error) {
            console.error('Error generating meta updates:', error);
            document.getElementById('metaPreview').innerHTML = `
                <p style="color: #ef4444;">Error checking GitHub structure: ${error.message}</p>
                <p style="color: #666; font-size: 0.9rem;">Generating basic meta.json updates without folder verification...</p>
                ${this.generateBasicMetaUpdates(mainCategory, subcategory)}
            `;
        }
    }

    async checkGitHubFolderExists(folderPath) {
        try {
            // Check if folder exists on GitHub
            const response = await fetch(`https://api.github.com/repos/UAM-CPrA/QuantumInsights/contents/${folderPath}`);
            return response.ok;
        } catch (error) {
            console.warn('GitHub API check failed:', error);
            return false; // Assume folder doesn't exist if API fails
        }
    }

    async checkGitHubFileExists(filePath) {
        try {
            // Check if file exists on GitHub
            const response = await fetch(`https://api.github.com/repos/UAM-CPrA/QuantumInsights/contents/${filePath}`);
            return response.ok;
        } catch (error) {
            console.warn('GitHub API check failed:', error);
            return false; // Assume file doesn't exist if API fails
        }
    }

    async generateEnhancedConceptsMetaUpdates(subcategory) {
        const title = this.formData.documentTitle || '[Your Title]';
        const description = this.formData.documentDescription || '[Your Description]';
        const level = this.formData.documentLevel || 'Beginner';
        const featuredElements = this.featuredElements || [];
        const readingTime = parseInt(this.formData.readingTime) || 10;
        
        // Generate the meta entry for this specific article
        const metaEntry = {
            id: this.generateIdFromTitle(title),
            title: title,
            type: "page",
            path: this.formData.customPath,
            url: this.formData.customPath,
            description: description,
            level: level,
            readingTime: readingTime,
            tags: this.generateTags(),
            featured: featuredElements.length > 0 ? featuredElements : ["basic"],
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        let html = '<div style="margin-bottom: 2rem;">';
        html += '<h4 style="color: var(--blue); margin-bottom: 1rem;">📋 Required Meta.json Updates</h4>';

        if (subcategory) {
            // Check if subcategory folder exists
            const subcategoryPath = `concepts/${subcategory}`;
            const subcategoryExists = await this.checkGitHubFolderExists(subcategoryPath);
            const subcategoryMetaExists = await this.checkGitHubFileExists(`${subcategoryPath}/meta.json`);
            
            if (!subcategoryExists) {
                // Need to create the entire folder structure
                html += this.generateFolderCreationInstructions(subcategoryPath, subcategory);
                
                // FIRST: Add the new section to parent meta.json
                html += this.generateNewSectionForParentMeta(subcategory);
                
                // SECOND: Add the article to parent meta.json section
                html += await this.generateMainConceptsMetaUpdate(subcategory);
                
                // THIRD: Create the subcategory meta.json
                html += this.generateSubcategoryMetaJson(subcategory, metaEntry);
            } else if (!subcategoryMetaExists) {
                // Folder exists but no meta.json - create meta.json and update parent
                html += await this.generateMainConceptsMetaUpdate(subcategory);
                html += this.generateSubcategoryMetaJson(subcategory, metaEntry);
            } else {
                // Both exist - just add to existing files
                html += await this.generateMainConceptsMetaUpdate(subcategory);
                html += this.generateSubcategoryMetaUpdate(subcategory, metaEntry);
            }
            
        } else {
            // Direct in concepts folder - just update main meta.json
            html += this.generateMainConceptsDirectUpdate(metaEntry);
        }

        html += '</div>';
        return html;
    }

    async generateEnhancedResearchMetaUpdates(subcategory) {
        const title = this.formData.documentTitle || '[Your Title]';
        const description = this.formData.documentDescription || '[Your Description]';
        const authors = this.formData.authors || '[Authors]';
        const venue = this.formData.venue || '[Venue]';
        const category = this.formData.category || 'Research';
        const framework = this.formData.framework || '[Framework]';
        const featuredElements = this.featuredElements || [];
        
        // Generate the meta entry for this research article
        const metaEntry = {
            id: this.generateIdFromTitle(title),
            title: title,
            type: "page",
            path: this.formData.customPath,
            url: this.formData.customPath,
            description: description,
            authors: authors.split(',').map(a => a.trim()),
            venue: venue,
            category: category,
            framework: framework,
            tags: this.generateTags(),
            featured: featuredElements.length > 0 ? featuredElements : ["research"],
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        let html = '<div style="margin-bottom: 2rem;">';
        html += '<h4 style="color: var(--blue); margin-bottom: 1rem;">📋 Required Meta.json Updates</h4>';

        if (subcategory) {
            // Check if subcategory folder exists
            const subcategoryPath = `research/${subcategory}`;
            const subcategoryExists = await this.checkGitHubFolderExists(subcategoryPath);
            const subcategoryMetaExists = await this.checkGitHubFileExists(`${subcategoryPath}/meta.json`);
            
            if (!subcategoryExists) {
                // Need to create the entire folder structure
                html += this.generateFolderCreationInstructions(subcategoryPath, subcategory);
                
                // FIRST: Add the new section to parent meta.json
                html += this.generateNewResearchSectionForParentMeta(subcategory);
                
                // SECOND: Add the article to parent meta.json section
                html += await this.generateMainResearchMetaUpdate(subcategory);
                
                // THIRD: Create the subcategory meta.json
                html += this.generateResearchSubcategoryMetaJson(subcategory, metaEntry);
            } else if (!subcategoryMetaExists) {
                // Folder exists but no meta.json - create meta.json and update parent
                html += await this.generateMainResearchMetaUpdate(subcategory);
                html += this.generateResearchSubcategoryMetaJson(subcategory, metaEntry);
            } else {
                // Both exist - just add to existing files
                html += await this.generateMainResearchMetaUpdate(subcategory);
                html += this.generateResearchSubcategoryMetaUpdate(subcategory, metaEntry);
            }
            
        } else {
            // Direct in research folder - just update main meta.json
            html += this.generateMainResearchDirectUpdate(metaEntry);
        }

        html += '</div>';
        return html;
    }

    generateFolderCreationInstructions(folderPath, folderName) {
        return `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h5 style="color: #856404; margin-bottom: 0.5rem;">🗂️ Folder Creation Required</h5>
                <p style="color: #856404; margin-bottom: 1rem;">
                    The folder <strong>${folderPath}</strong> doesn't exist yet. You need to create it first.
                </p>
                <p style="color: #856404; font-size: 0.9rem;">
                    Create the following folders: <strong>${folderPath}</strong>
                </p>
            </div>
        `;
    }

    generateSubcategoryMetaJson(subcategory, articleEntry) {
        const subcategoryMeta = {
            title: this.capitalizeName(subcategory),
            description: `Comprehensive collection of ${subcategory} content.`,
            type: "folder",
            parentPath: "concepts",
            items: [articleEntry],
            metadata: {
                lastUpdated: new Date().toISOString().split('T')[0],
                version: "1.0",
                totalArticles: 1,
                structure: "folder"
            }
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">3️⃣ Create New File: concepts/${subcategory}/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>Finally</strong>, create this entire meta.json file for the new subcategory:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 300px; overflow-y: auto;">
${JSON.stringify(subcategoryMeta, null, 2)}
                </div>
            </div>
        `;
    }

    generateResearchSubcategoryMetaJson(subcategory, articleEntry) {
        const subcategoryMeta = {
            title: this.capitalizeName(subcategory) + " Research",
            description: `Research papers and implementations for ${subcategory}.`,
            type: "folder",
            parentPath: "research",
            items: [articleEntry],
            metadata: {
                lastUpdated: new Date().toISOString().split('T')[0],
                version: "1.0",
                totalArticles: 1,
                structure: "folder"
            }
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">3️⃣ Create New File: research/${subcategory}/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>Finally</strong>, create this entire meta.json file for the new research subcategory:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 300px; overflow-y: auto;">
${JSON.stringify(subcategoryMeta, null, 2)}
                </div>
            </div>
        `;
    }

    generateSubcategoryMetaUpdate(subcategory, articleEntry) {
        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">✏️ Update File: concepts/${subcategory}/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    Add this entry to the "items" array in the existing meta.json file:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 200px; overflow-y: auto;">
${JSON.stringify(articleEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Add a comma after the previous entry if it's not the last item in the array.
                </p>
            </div>
        `;
    }

    generateResearchSubcategoryMetaUpdate(subcategory, articleEntry) {
        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">✏️ Update File: research/${subcategory}/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    Add this entry to the "items" array in the existing meta.json file:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 200px; overflow-y: auto;">
${JSON.stringify(articleEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Add a comma after the previous entry if it's not the last item in the array.
                </p>
            </div>
        `;
    }

    generateNewSectionForParentMeta(subcategory) {
        const subcategorySection = {
            id: subcategory,
            title: this.capitalizeName(subcategory),
            icon: this.getIconForSubcategory(subcategory),
            type: "folder",
            path: `concepts/${subcategory}`,
            url: `concepts/${subcategory}.html`,
            description: `Explore ${subcategory} concepts and implementations.`,
            children: []
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">1️⃣ Update File: concepts/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>First</strong>, add this new section to the main "sections" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(subcategorySection, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Add this to the "sections" array in concepts/meta.json (after the last existing section)
                </p>
            </div>
        `;
    }

    async generateMainConceptsMetaUpdate(subcategory) {
        // Check if this subcategory exists in main concepts meta.json
        const conceptsMetaExists = await this.checkGitHubFileExists('concepts/meta.json');
        
        if (!conceptsMetaExists) {
            return `
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h5 style="color: #721c24; margin-bottom: 0.5rem;">⚠️ Warning: Main concepts/meta.json not found</h5>
                    <p style="color: #721c24;">
                        The main concepts/meta.json file doesn't exist. This is unusual and may require manual setup.
                    </p>
                </div>
            `;
        }

        // Generate the article entry that should be added to the parent meta.json
        const title = this.formData.documentTitle || '[Your Title]';
        const description = this.formData.documentDescription || '[Your Description]';
        const level = this.formData.documentLevel || 'Beginner';
        const readingTime = parseInt(this.formData.readingTime) || 10;
        const featuredElements = this.featuredElements || [];
        
        const parentMetaEntry = {
            id: this.generateIdFromTitle(title),
            title: title,
            type: "page",
            path: this.formData.customPath,
            url: this.formData.customPath,
            description: description,
            level: level,
            readingTime: readingTime,
            tags: this.generateTags(),
            featured: featuredElements.length > 0 ? featuredElements : ["basic"],
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">2️⃣ Update File: concepts/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>Second</strong>, add this entry to the <strong>"${subcategory}"</strong> section's "children" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(parentMetaEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Find the section with id "${subcategory}" and add this to its "children" array. Add a comma after the previous entry if it's not the last item.
                </p>
            </div>
        `;
    }

    generateNewResearchSectionForParentMeta(subcategory) {
        const subcategorySection = {
            id: subcategory,
            title: this.capitalizeName(subcategory) + " Research",
            icon: this.getIconForSubcategory(subcategory),
            type: "section",
            description: `Research papers and implementations for ${subcategory}.`,
            children: []
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">1️⃣ Update File: research/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>First</strong>, add this new section to the main "sections" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(subcategorySection, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Add this to the "sections" array in research/meta.json (after the last existing section)
                </p>
            </div>
        `;
    }

    async generateMainResearchMetaUpdate(subcategory) {
        // Generate the article entry that should be added to the parent meta.json
        const title = this.formData.documentTitle || '[Your Title]';
        const description = this.formData.documentDescription || '[Your Description]';
        const authors = this.formData.authors || '[Authors]';
        const venue = this.formData.venue || '[Venue]';
        const category = this.formData.category || 'Research';
        const framework = this.formData.framework || '[Framework]';
        const featuredElements = this.featuredElements || [];
        
        const parentMetaEntry = {
            id: this.generateIdFromTitle(title),
            title: title,
            type: "page",
            path: this.formData.customPath,
            url: this.formData.customPath,
            description: description,
            authors: authors.split(',').map(a => a.trim()),
            venue: venue,
            category: category,
            framework: framework,
            tags: this.generateTags(),
            featured: featuredElements.length > 0 ? featuredElements : ["research"],
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">2️⃣ Update File: research/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    <strong>Second</strong>, add this entry to the <strong>"${subcategory}"</strong> section's "children" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 250px; overflow-y: auto;">
${JSON.stringify(parentMetaEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Find the section with id "${subcategory}" and add this to its "children" array. Add a comma after the previous entry if it's not the last item.
                </p>
            </div>
        `;
    }

    generateMainConceptsDirectUpdate(articleEntry) {
        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">✏️ Update File: concepts/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    Add this entry to the appropriate section's "children" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(articleEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Find the most appropriate section (fundamentals, algorithms, etc.) and add to its "children" array.
                </p>
            </div>
        `;
    }

    generateMainResearchDirectUpdate(articleEntry) {
        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">✏️ Update File: research/meta.json</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    Add this entry to the appropriate section's "children" array:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(articleEntry, null, 2)}
                </div>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #888;">
                    ⚠️ Find the most appropriate section and add to its "children" array.
                </p>
            </div>
        `;
    }

    getIconForSubcategory(subcategory) {
        const icons = {
            'algorithms': '⚡',
            'fundamentals': '🧠',
            'quantum-gates': '🚪',
            'applications': '🚀',
            'hardware': '🔧',
            'theory': '📚',
            'cryptography': '🔐',
            'optimization': '📊',
            'machine-learning': '🤖',
            'simulation': '💻'
        };
        return icons[subcategory] || '📄';
    }

    generateBasicMetaUpdates(mainCategory, subcategory) {
        // Fallback for when GitHub API is not available
        const title = this.formData.documentTitle || '[Your Title]';
        const description = this.formData.documentDescription || '[Your Description]';
        
        const basicEntry = {
            id: this.generateIdFromTitle(title),
            title: title,
            type: "page",
            path: this.formData.customPath,
            url: this.formData.customPath,
            description: description,
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        return `
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: var(--blue); margin-bottom: 0.5rem;">📝 Basic Meta.json Update</h5>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">
                    Add this entry to ${mainCategory}${subcategory ? `/${subcategory}` : ''}/meta.json:
                </p>
                <div style="background: var(--dark-text); color: var(--white); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
${JSON.stringify(basicEntry, null, 2)}
                </div>
            </div>
        `;
    }

    capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    }

    generateIdFromTitle(title) {
        return title.toLowerCase()
                   .replace(/[^a-z0-9\s-]/g, '')
                   .replace(/\s+/g, '-')
                   .replace(/-+/g, '-')
                   .trim();
    }

    generateFilename() {
        const title = this.formData.documentTitle || 'document';
        return title.toLowerCase()
                   .replace(/[^a-z0-9\s-]/g, '')
                   .replace(/\s+/g, '-')
                   .replace(/-+/g, '-')
                   .trim() + '.html';
    }

    generateTags() {
        const tags = [];
        
        // Add tags based on selected sections
        this.selectedSections.forEach(section => {
            switch(section.id) {
                case 'mathematical':
                    tags.push('mathematics', 'theory');
                    break;
                case 'implementation':
                    tags.push('programming', 'implementation');
                    break;
                case 'concepts-grid':
                    tags.push('concepts', 'education');
                    break;
                case 'video':
                    tags.push('video', 'tutorial');
                    break;
                case 'interactive-demo':
                    tags.push('interactive', 'demo');
                    break;
                case 'applications':
                    tags.push('applications', 'practical');
                    break;
                case 'results':
                    tags.push('research', 'results');
                    break;
                case 'methodology':
                    tags.push('methodology', 'research');
                    break;
            }
        });
        
        // Add template-specific tags
        if (this.selectedTemplate === 'concepts') {
            tags.push('quantum-concepts');
        } else if (this.selectedTemplate === 'research') {
            tags.push('research-paper');
        }
        
        // Remove duplicates
        return [...new Set(tags)];
    }

    extractFilenameFromPath(customPath) {
        if (!customPath) return '';
        const segments = customPath.split('/');
        return segments[segments.length - 1]; // Last segment is the filename
    }

    getConceptsMetaPathFromCustomPath(customPath) {
        if (!customPath || !customPath.startsWith('concepts/')) {
            return 'concepts/meta.json'; // Default
        }
        
        const pathSegments = customPath.split('/');
        if (pathSegments.length === 2) {
            // Direct in concepts folder: concepts/file.html
            return 'concepts/meta.json';
        } else if (pathSegments.length >= 3) {
            // In a subcategory: concepts/subcategory/file.html
            const subcategory = pathSegments[1];
            return `concepts/${subcategory}/meta.json`;
        }
        
        return 'concepts/meta.json';
    }

    getResearchMetaPathFromCustomPath(customPath) {
        if (!customPath || !customPath.startsWith('research/')) {
            return 'research/meta.json'; // Default
        }
        
        const pathSegments = customPath.split('/');
        if (pathSegments.length === 2) {
            // Direct in research folder: research/file.html
            return 'research/meta.json';
        } else if (pathSegments.length >= 3) {
            // In a subcategory: research/subcategory/file.html
            const subcategory = pathSegments[1];
            return `research/${subcategory}/meta.json`;
        }
        
        return 'research/meta.json';
    }

    updatePathPreview() {
        const customPath = document.getElementById('customPath').value;
        const pathPreviewText = document.getElementById('pathPreviewText');
        
        if (!pathPreviewText) return;
        
        if (customPath) {
            pathPreviewText.textContent = customPath;
        } else {
            pathPreviewText.textContent = 'Enter a custom path';
        }
    }

    generateFileInstructions() {
        const customPath = this.formData.customPath;
        const pathParts = customPath.split('/');
        const filename = this.extractFilenameFromPath(customPath) || this.generateFilename();
        
        let htmlFilePath = customPath || `${this.selectedTemplate}/${filename}`;
        
        const mainCategory = pathParts[0]; // concepts or research
        const subcategory = pathParts.length > 2 ? pathParts[1] : null; // algorithms, fundamentals, etc.
        
        let metaInstructions = '';
        
        if (subcategory) {
            // Multiple meta.json files need updating
            metaInstructions = `
                <h5 style="color: var(--blue); margin-bottom: 1rem;">2. 📋 Meta.json Updates (Multiple Files):</h5>
                <div style="margin-bottom: 1rem;">
                    <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; margin-bottom: 0.5rem;">
                        File 1: /home/eanguiano/QuantumInsights/${mainCategory}/${subcategory}/meta.json
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">
                        Add the specific item entry to the "items" array in this subcategory's meta.json file.
                    </p>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; margin-bottom: 0.5rem;">
                        File 2: /home/eanguiano/QuantumInsights/${mainCategory}/meta.json
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">
                        Only if "${subcategory}" section doesn't exist: Add the section entry to the "sections" array.
                    </p>
                </div>`;
        } else {
            // Single meta.json file
            metaInstructions = `
                <h5 style="color: var(--blue); margin-bottom: 1rem;">2. � Meta.json Update (Single File):</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace;">
                    /home/eanguiano/QuantumInsights/${mainCategory}/meta.json
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    Add the item entry to the "items" array in this meta.json file.
                </p>`;
        }

        const instructions = `
            <h4>📋 Pull Request Checklist</h4>
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">1. � HTML File Location:</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace;">
                    /home/eanguiano/QuantumInsights/${htmlFilePath}
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    Save your generated HTML file at this exact location.
                </p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                ${metaInstructions}
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">3. 🔄 How to Update meta.json:</h5>
                <ol style="margin-left: 1rem; line-height: 1.6;">
                    <li>Open each meta.json file listed above</li>
                    <li>For subcategory meta.json: Add the item entry to the "items" array</li>
                    ${subcategory ? '<li>For main category meta.json: Add section entry to "sections" array (only if section doesn\'t exist)</li>' : ''}
                    <li>Make sure the JSON syntax is correct (commas, brackets)</li>
                    <li>Verify that the "featured" field contains your featured elements</li>
                    <li>Save the file(s)</li>
                </ol>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">4. 🚀 Git Commands for Pull Request:</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; line-height: 1.4;">
                    git add ${htmlFilePath}<br>
                    ${subcategory ? 
                        `git add ${mainCategory}/${subcategory}/meta.json<br>
                        git add ${mainCategory}/meta.json<br>` :
                        `git add ${mainCategory}/meta.json<br>`
                    }
                    git commit -m "Add new ${this.selectedTemplate}: ${this.formData.documentTitle}"<br>
                    git push origin your-branch-name
                </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: #856404; margin-bottom: 0.5rem;">⚠️ Important Notes:</h5>
                <ul style="margin-left: 1rem; color: #856404;">
                    <li>Make sure all files are in the same commit</li>
                    <li>Test your HTML file locally before submitting</li>
                    <li>Verify that all meta.json syntax is valid</li>
                    <li>Check that all links and paths work correctly</li>
                    <li>Featured elements: ${this.formData.featuredElements.length > 0 ? this.formData.featuredElements.join(', ') : 'None specified'}</li>
                    <li>Custom path: <strong>${htmlFilePath}</strong></li>
                    ${subcategory ? '<li><strong>Multiple meta.json files required</strong> - don\'t forget both!</li>' : ''}
                </ul>
            </div>
        `;
        
        document.getElementById('fileInstructions').innerHTML = instructions;
    }

    getMetaStructureInfo(metaFilePath) {
        if (metaFilePath.includes('quantum-gates')) {
            return 'This file contains quantum gate information with sections array. Add your entry to the appropriate section or create a new one.';
        } else if (metaFilePath.includes('algorithms')) {
            return 'This file contains algorithm-related content. Add your entry to the main items array.';
        } else if (metaFilePath.includes('fundamentals')) {
            return 'This file contains fundamental concepts. Add your entry to the main items array.';
        } else if (metaFilePath.includes('research')) {
            return 'This file contains research papers and publications. Add your entry to the main items array.';
        } else {
            return 'Open this meta.json file and add the JSON entry shown above to the appropriate array.';
        }
    }

    copyMetaJSON() {
        const metaText = document.getElementById('metaPreview').textContent;
        navigator.clipboard.writeText(metaText).then(() => {
            this.showNotification('Meta JSON copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy meta JSON to clipboard', 'warning');
        });
    }

    // Featured elements management
    addFeaturedElement() {
        const input = document.getElementById('newFeaturedElement');
        const value = input.value.trim();
        
        if (value && !this.featuredElements.includes(value)) {
            this.featuredElements.push(value);
            input.value = '';
            this.updateFeaturedElementsList();
        }
    }

    removeFeaturedElement(index) {
        this.featuredElements.splice(index, 1);
        this.updateFeaturedElementsList();
    }

    updateFeaturedElementsList() {
        const container = document.getElementById('featuredElementsList');
        if (!container) return;

        if (this.featuredElements.length === 0) {
            container.innerHTML = `
                <div class="featured-elements-container">
                    <div class="no-featured-elements">No featured elements added yet. Add elements that make your content special.</div>
                </div>
            `;
        } else {
            const elementsHTML = this.featuredElements.map((element, index) => `
                <div class="featured-element">
                    <span>${element}</span>
                    <button class="featured-element-remove" onclick="generator.removeFeaturedElement(${index})">×</button>
                </div>
            `).join('');
            
            container.innerHTML = `
                <div class="featured-elements-container has-elements">
                    ${elementsHTML}
                </div>
            `;
        }
    }

    // Navigation methods
    goBackToBasicInfo() {
        document.getElementById('sectionManager').style.display = 'none';
        document.getElementById('basicInfoForm').style.display = 'block';
        this.updateProgress(2);
    }

    goBackToSections() {
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('sectionManager').style.display = 'block';
        this.updateProgress(3);
    }
}

// Global functions for button clicks
function proceedToSections() {
    generator.proceedToSections();
}

function goBackToBasicInfo() {
    generator.goBackToBasicInfo();
}

function generatePreview() {
    generator.generatePreview();
}

function goBackToSections() {
    generator.goBackToSections();
}

function downloadHTML() {
    generator.downloadHTML();
}

function copyToClipboard() {
    generator.copyToClipboard();
}

function copyMetaJSON() {
    generator.copyMetaJSON();
}

// Featured elements functions
function addFeaturedElement() {
    generator.addFeaturedElement();
}

function removeFeaturedElement(index) {
    generator.removeFeaturedElement(index);
}

// Path preview function
function updatePathPreview() {
    generator.updatePathPreview();
}

// Modal editor functions
function closeEditor() {
    generator.closeEditor();
}

function saveSection() {
    generator.saveSection();
}

// Dynamic content functions
function addConcept() {
    generator.addConcept();
}

function removeConcept(index) {
    generator.removeConcept(index);
}

function updateConcept(index, field, value) {
    generator.updateConcept(index, field, value);
}

function addApplication() {
    generator.addApplication();
}

function removeApplication(index) {
    generator.removeApplication(index);
}

function updateApplication(index, field, value) {
    generator.updateApplication(index, field, value);
}

function toggleInfoBox() {
    const hasInfoBox = document.getElementById('hasInfoBox').value;
    const infoBoxFields = document.getElementById('infoBoxFields');
    infoBoxFields.style.display = hasInfoBox === 'yes' ? 'block' : 'none';
}

// GitHub verification and enhanced meta.json management methods
TemplateGenerator.prototype.checkGitHubDirectoryEnhanced = async function(customPath) {
    // Check against known directory patterns from the UAM-CPrA/QuantumInsights repository
    const knownDirectories = [
        'concepts/fundamentals',
        'concepts/quantum-gates', 
        'concepts/algorithms',
        'concepts/advanced-topics',
        'research/algorithm-papers',
        'research/code-implementations',
        'research/hardware-research',
        'research/benchmarks'
    ];
    
    const pathWithoutFile = customPath.replace(/\/[^\/]*\.html$/, '');
    const directoryPath = pathWithoutFile.replace(/^\/+/, ''); // Remove leading slashes
    
    return knownDirectories.includes(directoryPath);
};

TemplateGenerator.prototype.generateNewDirectoryTemplatesEnhanced = function(mainCategory, subcategory) {
    const subcategoryName = this.capitalizeName(subcategory);
    
    let parentTemplate, subcategoryTemplate;
    
    if (mainCategory === 'concepts') {
        parentTemplate = this.generateConceptsMetaUpdates(subcategory, subcategoryName);
        subcategoryTemplate = `
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #fbbf24;">
                <h5 style="color: #856404; margin-bottom: 1rem;">🆕 New Subcategory Meta.json Template:</h5>
                <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">Create: <strong>${mainCategory}/${subcategory}/meta.json</strong></p>
                <pre style="background: #f8f9fa; padding: 1rem; border-radius: 5px; overflow-x: auto; font-size: 0.8rem;"><code>{
  "title": "${subcategoryName}",
  "description": "Detailed exploration of ${subcategory.replace('-', ' ')} in quantum computing",
  "items": [
    {
      "id": "${this.formData.documentId || 'new-concept'}",
      "title": "${this.formData.documentTitle}",
      "description": "${this.formData.description || 'Description here'}",
      "concepts": [
        {
          "title": "Key Concept",
          "description": "Brief explanation of the concept"
        }
      ]
    }
  ]
}</code></pre>
            </div>`;
    } else {
        parentTemplate = this.generateResearchMetaUpdates(subcategory, subcategoryName);
        subcategoryTemplate = `
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #fbbf24;">
                <h5 style="color: #856404; margin-bottom: 1rem;">🆕 New Subcategory Meta.json Template:</h5>
                <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">Create: <strong>${mainCategory}/${subcategory}/meta.json</strong></p>
                <pre style="background: #f8f9fa; padding: 1rem; border-radius: 5px; overflow-x: auto; font-size: 0.8rem;"><code>{
  "title": "${subcategoryName}",
  "description": "Research papers and implementations for ${subcategory.replace('-', ' ')}",
  "papers": [
    {
      "title": "${this.formData.documentTitle}",
      "authors": "${this.formData.authors || 'Author Names'}",
      "venue": "${this.formData.venue || 'Publication Venue'}",
      "description": "${this.formData.description || 'Paper description'}",
      "code": {
        "language": "Qiskit",
        "title": "Implementation Title",
        "snippet": "# Python code here"
      },
      "github_link": "https://github.com/UAM-CPrA/QuantumInsights"
    }
  ]
}</code></pre>
            </div>`;
    }
    
    return parentTemplate + subcategoryTemplate;
};

TemplateGenerator.prototype.generateEnhancedFileInstructions = async function() {
    const customPath = this.formData.customPath;
    const pathParts = customPath.split('/');
    const filename = this.extractFilenameFromPath(customPath) || this.generateFilename();
    
    let htmlFilePath = customPath || `${this.selectedTemplate}/${filename}`;
    
    const mainCategory = pathParts[0]; // concepts or research
    const subcategory = pathParts.length > 2 ? pathParts[1] : null; // algorithms, fundamentals, etc.
    
    // Show loading state
    const instructionsContainer = document.getElementById('fileInstructions');
    instructionsContainer.innerHTML = '🔍 Checking GitHub repository structure...';
    
    try {
        // Check if directory exists in GitHub repository
        const directoryExists = await this.checkGitHubDirectoryEnhanced(customPath);
        
        let metaInstructions = '';
        
        if (subcategory) {
            // Multiple meta.json files need updating
            metaInstructions = `
                <h5 style="color: var(--blue); margin-bottom: 1rem;">2. 📋 Meta.json Updates (Multiple Files):</h5>
                <div style="margin-bottom: 1rem;">
                    <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; margin-bottom: 0.5rem;">
                        File 1: ${mainCategory}/${subcategory}/meta.json
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">
                        ${directoryExists ? 
                            '✅ Directory exists: Update the "items" array in this subcategory\'s meta.json file.' : 
                            '🆕 New directory: Create this meta.json file with the template below.'}
                    </p>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; margin-bottom: 0.5rem;">
                        File 2: ${mainCategory}/meta.json
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">
                        ${directoryExists ? 
                            '✅ Only update if "${subcategory}" section doesn\'t exist in the "sections" array.' : 
                            '🆕 Add the "${subcategory}" section entry to the "sections" array.'}
                    </p>
                </div>
                
                ${!directoryExists ? this.generateNewDirectoryTemplatesEnhanced(mainCategory, subcategory) : ''}`;
        } else {
            // Single meta.json file
            metaInstructions = `
                <h5 style="color: var(--blue); margin-bottom: 1rem;">2. 📋 Meta.json Update (Single File):</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace;">
                    ${mainCategory}/meta.json
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    ✅ Add the item entry to the "items" array in this meta.json file.
                </p>`;
        }

        const instructions = `
            <h4>📋 GitHub-Verified Pull Request Checklist</h4>
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">1. 📄 HTML File Location:</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace;">
                    ${htmlFilePath}
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    Save your generated HTML file at this exact location in the UAM-CPrA/QuantumInsights repository.
                </p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                ${metaInstructions}
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">3. 🔄 How to Update meta.json:</h5>
                <ol style="margin-left: 1rem; line-height: 1.6;">
                    <li>Open each meta.json file listed above</li>
                    <li>For subcategory meta.json: Add the item entry to the "items" array</li>
                    ${subcategory ? '<li>For main category meta.json: Add section entry to "sections" array (only if section doesn\'t exist)</li>' : ''}
                    <li>Make sure the JSON syntax is correct (commas, brackets)</li>
                    <li>Verify that the "featured" field contains your featured elements</li>
                    <li>Save the file(s)</li>
                </ol>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: var(--blue); margin-bottom: 1rem;">4. 🚀 Git Commands for Pull Request:</h5>
                <div style="background: var(--dark-text); color: white; padding: 0.8rem; border-radius: 5px; font-family: monospace; line-height: 1.4;">
                    git add ${htmlFilePath}<br>
                    ${subcategory ? 
                        `git add ${mainCategory}/${subcategory}/meta.json<br>
                        git add ${mainCategory}/meta.json<br>` :
                        `git add ${mainCategory}/meta.json<br>`
                    }
                    git commit -m "Add new ${this.selectedTemplate}: ${this.formData.documentTitle}"<br>
                    git push origin your-branch-name
                </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h5 style="color: #856404; margin-bottom: 0.5rem;">⚠️ Important Notes:</h5>
                <ul style="margin-left: 1rem; color: #856404;">
                    <li>Repository: <strong>UAM-CPrA/QuantumInsights</strong></li>
                    <li>Directory verification: ${directoryExists ? '✅ Exists' : '🆕 New directory'}</li>
                    <li>Featured elements: ${this.formData.featuredElements.length > 0 ? this.formData.featuredElements.join(', ') : 'None specified'}</li>
                    <li>Custom path: <strong>${htmlFilePath}</strong></li>
                    ${subcategory ? '<li><strong>Multiple meta.json files required</strong> - don\'t forget both!</li>' : ''}
                    ${!directoryExists ? '<li><strong>🆕 New directory detected: Follow the meta.json templates provided above</strong></li>' : ''}
                    <li>All PRs must be reviewed before merging</li>
                </ul>
            </div>
        `;

        instructionsContainer.innerHTML = instructions;
    } catch (error) {
        console.error('Error checking GitHub repository:', error);
        instructionsContainer.innerHTML = '❌ Error checking repository. Using fallback instructions...';
        // Fallback to the original method
        this.generateFileInstructions();
    }
};

// Initialize the generator when the page loads
const generator = new TemplateGenerator();
