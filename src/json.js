/**
 * Load a JSON file from a File object asynchronously
 * @param {File} file - The File object to load (from input or drag & drop)
 * @returns {Promise<object>} - Promise resolving to parsed JSON data as an object
 */
function loadJsonFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                resolve(jsonData);
            } catch (error) {
                reject(new Error(i18n.getMessage('invalidJson', { filename: file.name })));
            }
        };

        reader.onerror = function () {
            reject(new Error(i18n.getMessage('failedToRead', { filename: file.name })));
        };

        // Start reading the file as text
        reader.readAsText(file);
    });
}

/**
 * Load a JSON file from an HTML file input element asynchronously
 * @param {HTMLInputElement} inputElement - The file input element
 * @returns {Promise<object>} - Promise resolving to parsed JSON data as an object
 */
function loadJsonFromInput(inputElement) {
    console.log("load called");
    return new Promise((resolve, reject) => {
        if (!inputElement.files || inputElement.files.length === 0) {
            reject(new Error(i18n.getMessage('noFileSelected')));
            return;
        }

        const file = inputElement.files[0];
        return loadJsonFromFile(file)
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Helper function to handle drag and drop events for JSON files
 * @param {HTMLElement} dropZone - Element that will act as a drop zone
 * @param {Function} onLoadCallback - Callback function that receives the parsed JSON data
 * @param {Function} onErrorCallback - Callback function that receives any error message
 * @param {object} options - Optional configuration for the drop zone
 */
function setupDropZone(dropZone, onLoadCallback, onErrorCallback, options = {}) {
    const dragOverClass = options.dragOverClass || 'drag-over';

    dropZone.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.add(dragOverClass);
    });

    dropZone.addEventListener('dragleave', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.remove(dragOverClass);
    });

    dropZone.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.remove(dragOverClass);

        const file = event.dataTransfer.files[0];
        if (!file) {
            if (onErrorCallback) onErrorCallback(i18n.getMessage('noFileDropped'));
            return;
        }

        loadJsonFromFile(file)
            .then(data => {
                if (onLoadCallback) onLoadCallback(data);
            })
            .catch(error => {
                if (onErrorCallback) onErrorCallback(error.message);
            });
    });
}