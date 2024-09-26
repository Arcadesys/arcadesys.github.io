
// Wait for the DOM to be fully loaded before initializing EasyMDE
document.addEventListener('DOMContentLoaded', function() {
  // Check if EasyMDE is available
  if (typeof EasyMDE === 'undefined') {
    console.error('EasyMDE is not loaded. Make sure the script is included correctly.');
    return;
  }

// Initialize EasyMDE without toolbar and status bar
const easyMDE = new EasyMDE({
    element: document.getElementById('editor'),
    placeholder: 'Start writing here...',
    spellChecker: false,
    toolbar: false,
    status: false,
    autoDownloadFontAwesome: false,
    shortcuts: {},
    indentWithTabs: false,
    tabSize: 2,
    lineWrapping: true,
  });
  
  // Adjust the font size and colors
  easyMDE.codemirror.getWrapperElement().style.fontSize = '14pt';
  easyMDE.codemirror.getWrapperElement().style.backgroundColor = '#000';
  easyMDE.codemirror.getWrapperElement().style.color = '#fff';
  easyMDE.codemirror.getWrapperElement().style.fontFamily = '"Courier New", monospace';
  
  // Word goal
  const wordGoal = 1000;
  
  // AI buttons
  const whatNowButton = document.getElementById('whatNowButton');
  const eightySixButton = document.getElementById('eightySixButton');
  

  /*saving the document*/

  // Auto-save document to localStorage
  function autoSaveDocument() {
    const content = easyMDE.value();
    localStorage.setItem('currentDocument', content);
  }
  
  // Load document from localStorage
  function loadDocument() {
    const savedDoc = localStorage.getItem('currentDocument');
    if (savedDoc) {
      easyMDE.value(savedDoc);
      updateWordGoal();
    } else {
      updateWordGoal();
    }
  }
  
  // Function to update word goal
  function updateWordGoal() {
    const content = easyMDE.value();
    const currentWordCount = countWords(content);
    const wordsLeft = wordGoal - currentWordCount;
  
    const wordGoalDisplay = document.getElementById('wordGoal');
  
    if (wordsLeft > 0) {
      wordGoalDisplay.textContent = `Words left: ${wordsLeft}`;
    } else {
      wordGoalDisplay.textContent = `Goal reached! Total words: ${currentWordCount}`;
    }
  }
  
  // Helper function to count words
  function countWords(str) {
    str = str.trim();
    if (str === '') return 0;
    return str.split(/\s+/).length;
  }
  
  // Load the current document on startup
  loadDocument();
  
  // Auto-save on every change
  easyMDE.codemirror.on('change', function() {
    updateWordGoal();
    autoSaveDocument();
  });
  
//what now button
  whatNowButton.addEventListener('click', function() {
    const content = easyMDE.value().trim();
    if (!content) {
      alert('There is no content to analyze.');
      return;
    }
  
    const suggestions = generateStorySuggestions(content);
  
    // Prepare the suggestions text
    const suggestionsText = `\n\n--- Suggestions ---\n1. ${suggestions[0]}\n2. ${suggestions[1]}\n3. ${suggestions[2]}\n\n`;
  
    // Get current cursor position
    const doc = easyMDE.codemirror.getDoc();
    const cursor = doc.getCursor(); // Get the current cursor position
  
    // Insert the suggestions at the cursor position
    doc.replaceRange(suggestionsText, cursor);
  });
  
  // OpenAI fetch for the 86 button
  eightySixButton.addEventListener('click', async function() {
    const content = easyMDE.value().trim();
    if (!content) {
      alert('There is no content to process.');
      return;
    }
  
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Improve the following text by removing unnecessary words and enhancing clarity:\n\n${content}`
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to process content with AI');
      }
  
      const data = await response.json();
      const updatedContent = data.response;
  
      easyMDE.value(updatedContent);
      alert('Content processed and updated.');
      updateWordGoal();
    } catch (error) {
      console.error('Error processing content:', error);
      alert('An error occurred while processing the content.');
    }
  });
  
  // Simulate processing content with AI (86 This)
  function processContentWithAI(content) {
    
    let updatedContent = content.replace(/\b\w+ly\b/g, '[REMOVED]'); // Remove adverbs
    updatedContent += '\n\n[AI: This content has been enhanced.]';
    return updatedContent;
  }
  
  // (What Now?) button
  async function generateStorySuggestions(content) {
    console.log("generateStorySuggestions called")
    //ask chatgpt for suggestions
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate an array of three new directions to take this scene:\n\n${content}`
      })
    });
    console.log("generateStorySuggestions response", response)
  }
});
