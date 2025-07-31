#!/bin/bash

# CPrA QuantumInsights - Automated Content Management Demo
# This script demonstrates how the JSON-based content system works

echo "🚀 CPrA QuantumInsights - Dynamic Content System"
echo "=============================================="
echo ""

echo "📁 Current folder structure:"
find . -name "*.json" -o -name "*.html" | head -10
echo ""

echo "📊 Content Summary:"
echo "├── Concepts JSON files: $(find concepts -name "*.json" | wc -l)"
echo "├── Research JSON files: $(find research -name "*.json" | wc -l)"
echo "├── HTML pages: $(find . -maxdepth 1 -name "*.html" | wc -l)"
echo ""

echo "🔧 How to add new content:"
echo "1. Edit JSON files in concepts/ or research/ folders"
echo "2. Add new subsections by creating folders with meta.json"
echo "3. Pages automatically update when JSON files change"
echo ""

echo "📚 Example JSON structure for concepts:"
echo '{
  "title": "New Concept Section",
  "description": "Description here",
  "concepts": [
    {
      "title": "Concept Name",
      "description": "Concept description"
    }
  ]
}'
echo ""

echo "🔬 Example JSON structure for research:"
echo '{
  "title": "Research Section",
  "papers": [
    {
      "title": "Paper Title",
      "authors": "Author Names",
      "venue": "Publication Venue",
      "code": {
        "language": "Python/Qiskit",
        "snippet": "code here"
      }
    }
  ]
}'
echo ""

echo "✅ System is ready! Open concepts.html or research.html to see dynamic content."
