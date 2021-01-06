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

    const addParameterRowBtn = document.getElementById('btn-parameter-add-row');
    addParameterRowBtn.addEventListener('click', addRowToTable)
    addParameterRowBtn.tableId = 'table-parameters';

    const addHeaderRowBtn = document.getElementById('btn-header-add-row');
    addHeaderRowBtn.addEventListener('click', addRowToTable)
    addHeaderRowBtn.tableId = 'table-header';

    const clearParameterTableBtn = document.getElementById('btn-parameter-clear-table');
    clearParameterTableBtn.addEventListener('click', clearTable)
    clearParameterTableBtn.tableId = 'table-parameters';


    const clearHeaderTableBtn = document.getElementById('btn-header-clear-table');
    clearHeaderTableBtn.addEventListener('click', clearTable)
    clearHeaderTableBtn.tableId = 'table-header';


    const urlTextbox = document.getElementById('textbox-url');
    urlTextbox.addEventListener('keyup', updateFullUrl)

    const initialTableObjects = [
        {
            currentTarget: { tableId: 'table-parameters' }
        },
        {
            currentTarget: { tableId: 'table-header' }
        }
    ]
    initialTableObjects.forEach((element) => {
        addRowToTable(element)
    })
    updateFullUrl()
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
    

}

function clearTable(event) {
    if (event != null) {
        const parametersTableBody = document.getElementById(event.currentTarget.tableId).getElementsByTagName('tbody')[0];
        while (parametersTableBody.childElementCount > 0) {
            parametersTableBody.removeChild(parametersTableBody.lastChild)
        }
        addRowToTable(event)
    }
    
}

function addRowToTable(event) {
    if (event != null) {
        const parametersTableBody = document.getElementById(event.currentTarget.tableId).getElementsByTagName('tbody')[0];
        
        const newRowId = parametersTableBody.childElementCount;
        const dataType = event.currentTarget.tableId.replace('table-', '');

        let newRow = document.createElement('tr')
        
        let newCheckboxCell = document.createElement('td')
        let newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.checked = true;
        newCheckbox.classList.add('form-control-sm')
        newCheckbox.id = 'checkbox-active-' + dataType + '-' + newRowId;

        newCheckboxCell.appendChild(newCheckbox)
        newRow.appendChild(newCheckboxCell)

        let newKeyCell = document.createElement('td')
        newKeyCell.id = dataType + '-key-' + newRowId;
        newKeyCell.contentEditable = true;
        newKeyCell.addEventListener('keyup', updateFullUrl)

        newRow.appendChild(newKeyCell)

        let newValueCell = document.createElement('td')
        newValueCell.id = dataType + '-value-' + newRowId;
        newValueCell.contentEditable = true;
        newValueCell.addEventListener('keyup', updateFullUrl)

        newRow.appendChild(newValueCell)

        let newDescriptionCell = document.createElement('td')
        newDescriptionCell.id = dataType + '-description-' + newRowId;
        newDescriptionCell.contentEditable = true;

        newRow.appendChild(newDescriptionCell)

        parametersTableBody.appendChild(newRow)
    }
}

function updateFullUrl() {
    const urlTextbox = document.getElementById('textbox-url');

    const fullUrlTextbox = document.getElementById('textbox-full-url')
    const parametersTableBody = document.getElementById('table-parameters').getElementsByTagName('tbody')[0];

    const protocolBlock = document.getElementById('protocol-switch');


    fullUrlTextbox.value = protocolBlock.innerText + urlTextbox.value;

    // Build query parameters onto URL.
    if (parametersTableBody.firstChild && document.getElementById('parameters-key-0').innerText != '') {
        fullUrlTextbox.value += '?'
        for (let [index, row] of parametersTableBody.childNodes.entries()) {
            if (document.getElementById('checkbox-active-parameters-' + index).checked) {
                fullUrlTextbox.value += document.getElementById('parameters-key-' + index).innerText

                if (document.getElementById('parameters-value-' + index).innerText != '') {
                    fullUrlTextbox.value += '=' + document.getElementById('parameters-value-' + index).innerText
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