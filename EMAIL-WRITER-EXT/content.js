console.log("Content script loaded");

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote', // Fixed: added missing dot
        '[role="presentation"]',
        'ZyRVue',
        'Am aiL Al editable LW-avf tS-tW',
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return ''; // Fixed: moved return outside the loop
}

function findCompsodeToolbar() {
    const selectors = [
        '.aDh', // Gmail compose toolbar
        '.btC', // Google Chat compose toolbar  
        '[role="toolbar"]',
        '.gU.Up', // Gmail dialog toolbar
        '[role="dialog"] .btC', // Compose dialog toolbar
        '.Ar.Au' // Another possible compose toolbar selector
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log("Found toolbar with selector:", selector); // Add this for debugging
            return toolbar;
        }
    }
    return null;
}

function createAiButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji T-I-KE L3 ai-reply-button aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.display = 'inline-block'; // Add this line
    button.style.verticalAlign = 'middle';  // Add this line
    button.innerHTML = 'AI Reply';
    button.style.borderRadius = '20px';
    button.style.padding = '3px 12px';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button'); // Fixed: typo exstionButton
    if (existingButton) {
        existingButton.remove();
    }

    const toolbar = findCompsodeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Injecting button into toolbar");
    const button = createAiButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();

            // Fixed: Change to your actual backend URL
            // In your content script
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: 'professional'
                })
                // Remove mode: 'cors' and credentials
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const generatedReply = await response.text(); // Changed: parse as text instead of JSON
            // Fixed: corrected selector attribute name
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]'); // Changed geditable to g_editable
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box not found');
            }
        } catch (error) {
            console.error('Error generating reply:', error);
            // More specific error message
            if (error.message.includes('Failed to fetch')) {
                alert('Failed to connect to the AI service. Make sure the backend is running and accessible.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    // Find the existing buttons container within the toolbar and insert there
const buttonsContainer = toolbar.querySelector('.btC, .gU.Up') || toolbar;
buttonsContainer.appendChild(button);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElement = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh,.btC,[role="dialog"]') ||
                node.querySelector('.aDh,.btC,[role="dialog"]')));

        if (hasComposedElement) {
            console.log("Composed element detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});