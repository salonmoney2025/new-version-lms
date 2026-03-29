const fs = require('fs');

const pagesToFix = [
  {
    path: 'app/(operations)/batch-transfer/page.tsx',
    buttonText: 'Upload File'
  },
  {
    path: 'app/(operations)/files-management/page.tsx',
    buttonText: 'Select Files'
  },
  {
    path: 'app/(administrative)/hr-management/page.tsx',
    buttonText: 'Upload'
  }
];

function fixUploadButton(filePath, buttonText) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Add useState for file if not present
    if (!content.includes('const [selectedFile')) {
      const useStateMatch = content.match(/const \[[\w\s,]+\] = useState/);
      if (useStateMatch) {
        const insertIndex = content.indexOf(useStateMatch[0]);
        const lineEnd = content.indexOf('\n', insertIndex) + 1;
        content = content.slice(0, lineEnd) + '  const [selectedFile, setSelectedFile] = useState<File | null>(null);\n' + content.slice(lineEnd);
      }
    }

    // Add file input handler
    const handleFileChange = `

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Add upload logic here
    }
  };
`;

    // Find the component function and add handlers
    const componentMatch = content.match(/export default function \w+\(\) \{/);
    if (componentMatch) {
      const insertIndex = content.indexOf(componentMatch[0]) + componentMatch[0].length;
      if (!content.includes('handleFileChange')) {
        content = content.slice(0, insertIndex) + handleFileChange + content.slice(insertIndex);
      }
    }

    // Replace the upload button with functional version
    const buttonRegex = new RegExp(`<button[^>]*>${buttonText}</button>`, 'g');
    const match = content.match(buttonRegex);

    if (match && match.length > 0) {
      const functionalButton = `<div>
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileUpload"
                  className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors cursor-pointer inline-block text-center"
                >
                  ${buttonText}
                </label>
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                )}
              </div>`;

      content = content.replace(match[0], functionalButton);

      fs.writeFileSync(filePath, content);
      console.log('FIXED:', filePath);
      return true;
    } else {
      console.log('WARN:', filePath, '- could not find button');
      return false;
    }
  } catch (error) {
    console.log('ERROR:', filePath, '-', error.message);
    return false;
  }
}

console.log('Fixing upload buttons...\n');

let fixed = 0;
pagesToFix.forEach(page => {
  if (fixUploadButton(page.path, page.buttonText)) {
    fixed++;
  }
});

console.log('\nFixed', fixed, 'upload buttons');
