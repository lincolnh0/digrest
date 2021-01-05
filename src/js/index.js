// Helper function to load methods once document is loaded.
function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function add_event_listeners_to_form() {    
    const submitBtn = document.getElementById('btn-submit');
    submitBtn.addEventListener('click', submitForm)

    const protocolBlock = document.getElementById('protocol-switch');
    protocolBlock.addEventListener('click', toggleProtocol);
    protocolBlock.addEventListener('click', updateFullUrl);

    const addRowBtn = document.getElementById('btn-add-row');
    addRowBtn.addEventListener('click', addRowToTable)

    const clearTableBtn = document.getElementById('btn-clear-table');
    clearTableBtn.addEventListener('click', clearTable)

    const urlTextbox = document.getElementById('textbox-url');
    urlTextbox.addEventListener('keyup', updateFullUrl)

    clearTable()
}

// Override default submit button.
function submitForm(event) {
    const selectRequest = document.getElementById('select-request');
    const fullUrlTextbox = document.getElementById('textbox-full-url')
    event.preventDefault();
    http_request(fullUrlTextbox.value, selectRequest.value);
}

// Toggle between http and https
function toggleProtocol() {
    const protocolBlock = document.getElementById('protocol-switch');
    protocolBlock.innerText = protocolBlock.innerText == 'http://' ? 'https://' : 'http://';
    changeFormAction()

}

function clearTable() {
    const parametersTableBody = document.getElementById('table-parameters').getElementsByTagName('tbody')[0];
    
    while (parametersTableBody.childElementCount > 0) {
        parametersTableBody.removeChild(parametersTableBody.lastChild)
    }

    updateFullUrl()
    addRowToTable()
}

function addRowToTable() {
    const parametersTableBody = document.getElementById('table-parameters').getElementsByTagName('tbody')[0];
    const newRowId = parametersTableBody.childElementCount;

    let newRow = document.createElement('tr')
    
    let newCheckboxCell = document.createElement('td')
    let newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.checked = true;
    newCheckbox.classList.add('form-control-sm')
    newCheckbox.id = 'checkbox-active-parameter-' + newRowId;

    newCheckboxCell.appendChild(newCheckbox)
    newRow.appendChild(newCheckboxCell)

    let newKeyCell = document.createElement('td')
    newKeyCell.id = 'parameter-key-' + newRowId;
    newKeyCell.contentEditable = true;
    newKeyCell.addEventListener('keyup', updateFullUrl)

    newRow.appendChild(newKeyCell)

    let newValueCell = document.createElement('td')
    newValueCell.id = 'parameter-value-' + newRowId;
    newValueCell.contentEditable = true;
    newValueCell.addEventListener('keyup', updateFullUrl)

    newRow.appendChild(newValueCell)

    let newDescriptionCell = document.createElement('td')
    newDescriptionCell.id = 'parameter-description-' + newRowId;
    newDescriptionCell.contentEditable = true;

    newRow.appendChild(newDescriptionCell)

    parametersTableBody.appendChild(newRow)
   
}

function updateFullUrl() {
    const urlTextbox = document.getElementById('textbox-url');

    const fullUrlTextbox = document.getElementById('textbox-full-url')
    const parametersTableBody = document.getElementById('table-parameters').getElementsByTagName('tbody')[0];

    const protocolBlock = document.getElementById('protocol-switch');


    fullUrlTextbox.value = protocolBlock.innerText + urlTextbox.value;

    // Build query parameters onto URL.
    if (parametersTableBody.firstChild && document.getElementById('parameter-key-0').innerText != '') {
        fullUrlTextbox.value += '?'
        for (let [index, row] of parametersTableBody.childNodes.entries()) {
            if (document.getElementById('checkbox-active-parameter-' + index).checked) {
                fullUrlTextbox.value += document.getElementById('parameter-key-' + index).innerText

                if (document.getElementById('parameter-value-' + index).innerText != '') {
                    fullUrlTextbox.value += '=' + document.getElementById('parameter-value-' + index).innerText
                }
    
                if (row != parametersTableBody.lastChild) {
                    fullUrlTextbox.value += '&'
                }
            }
        }
    }

    
}

async function http_request(url, httpMethod) {
    const responseTextArea = document.getElementById('textarea-response');
    try {
        const response = await fetch(url, {
            method: httpMethod
        });
        const responseContent = await response.json();
        responseTextArea.value = JSON.stringify(responseContent, null, 4);

        document.querySelectorAll('a[href="#response-pane"]')[0].click()
    } catch (err) {
        responseTextArea.value = err;
    }

}


ready(add_event_listeners_to_form)