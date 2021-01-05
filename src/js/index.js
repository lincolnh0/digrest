function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function add_event_listeners_to_form() {
    const formDigrest = document.getElementById('digrest-form');
    const urlTextbox = document.getElementById('textbox-url');
    const selectRequest = document.getElementById('select-request');
    urlTextbox.addEventListener('change', () =>     {
        formDigrest.action = urlTextbox.value;
    })

    const submitBtn = document.getElementById('btn-submit');
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        http_request(urlTextbox.value, selectRequest.value);
        
    })

    const protocalBlock = document.getElementById('protocol-switch');
    protocalBlock.addEventListener('click', () => {
        
        protocalBlock.innerText = protocalBlock.innerText == 'http://' ? 'https://' : 'http://';
        
    });
}

async function http_request(url, httpMethod) {
    const responseTextArea = document.getElementById('textarea-response');
    try {
        const response = await fetch(document.getElementById('protocol-switch').innerText + url, {
            method: httpMethod
        });
        const responseContent = await response.text();
        responseTextArea.value = responseContent;
    } catch (err) {
        responseTextArea.value = err;
    }
}


ready(add_event_listeners_to_form)